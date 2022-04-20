/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export default class WonderItem extends Item {
  chatTemplate = {
    consumable: '/systems/wondershade/templates/chat/consumables.hbs',
    equipment: '/systems/wondershade/templates/chat/equipment.hbs',
    spell: '/systems/wondershade/templates/chat/spell.hbs',
    weapon: '/systems/wondershade/templates/chat/weapon.hbs',
  };

  /**
   * Which ability score modifier is used by this item.
   * @type {string|null}
   */
  get abilityMod() {
    const itemData = this.data.data;
    if (!('ability' in itemData)) return null;

    // Case 1 - defined directly by the item
    if (itemData.ability) return itemData.ability;

    // Case 2 - inferred from a parent actor
    if (this.actor) {
      const actorData = this.actor.data.data;

      // Spells - Use Actor spellcasting modifier
      if (this.data.type === 'spell') return actorData.attributes.spellcasting || 'int';

      // Tools - default to Intelligence
      if (this.data.type === 'tool') return 'int';

      // Weapons
      if (this.data.type === 'weapon') {
        const wt = itemData.weaponType;

        // Weapons using the spellcasting modifier
        if (['msak', 'rsak'].includes(itemData.actionType)) {
          return actorData.attributes.spellcasting || 'int';
        }

        // Finesse weapons - Str or Dex (PHB pg. 147)
        if (itemData.properties.fin === true) {
          return (actorData.abilities.dex.mod >= actorData.abilities.str.mod) ? 'dex' : 'str';
        }

        // Ranged weapons - Dex (PH p.194)
        if (['simpleR', 'martialR'].includes(wt)) return 'dex';
      }
      return 'str';
    }

    // Case 3 - unknown
    return null;
  }

  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareDerivedData() {
    super.prepareDerivedData();

    // Get the Item's data
    const itemData = this.data;
    const data = itemData.data;
    // console.debug('[WonderItem] GLOBAL CONFIG', CONFIG);
    const config = CONFIG.wondershade;
    // console.debug('[WonderItem] prepareDerivedData', itemData);
    // console.debug('[WonderItem] this.labels', this);
    this.labels = {};
    const labels = this.labels;

    // Classes
    if (itemData.type === 'class') {
      data.levels = Math.clamped(data.levels, 1, 20);
    }

    // Spell Level,  School, and Components
    if (itemData.type === 'spell') {
      data.preparation.mode = data.preparation.mode || 'prepared';
      labels.level = config.spellLevels[data.level];
      labels.school = config.spellSchools[data.school];
      labels.components = Object.entries(data.components).reduce((arr, component) => {
        if (component[1] !== true) return arr;
        arr.push(component[0].titleCase().slice(0, 1));
        return arr;
      }, []);
      labels.materials = data?.materials?.value ?? null;
    } else if (itemData.type === 'feat') { // Feat Items
      const act = data.activation;
      if (act && (act.type === config.abilityActivationTypes.legendary)){
        labels.featType = game.i18n.localize('WonderSystem.LegendaryActionLabel');
      } else if (act && (act.type === config.abilityActivationTypes.lair)){
        labels.featType = game.i18n.localize('WonderSystem.LairActionLabel');
      } else if (act && act.type){
        labels.featType = game.i18n.localize(data.damage.length ? 'WonderSystem.Attack' : 'WonderSystem.Action');
      } else { labels.featType = game.i18n.localize('WonderSystem.Passive'); }
    } else if (itemData.type === 'equipment') { // Equipment Items
      labels.armor = data.armor.value ? `${data.armor.value} ${game.i18n.localize('WonderSystem.AC')}` : '';
    }

    // Activated Items
    if (data.hasOwnProperty('activation')) {
      // Ability Activation Label
      const act = data.activation || {};
      // console.debug('[WonderItem] config', config);
      if (act) labels.activation = [act.cost, config.abilityActivationTypes[act.type]].filterJoin(' ');

      // Target Label
      const tgt = data.target || {};
      if (['none', 'touch', 'self'].includes(tgt.units)) tgt.value = null;
      if (['none', 'self'].includes(tgt.type)) {
        tgt.value = null;
        tgt.units = null;
      }
      labels.target = [tgt.value, config.distanceUnits[tgt.units], config.targetTypes[tgt.type]].filterJoin(' ');

      // Range Label
      const rng = data.range || {};
      if (['none', 'touch', 'self'].includes(rng.units)) {
        rng.value = null;
        rng.long = null;
      }
      labels.range = [rng.value, rng.long ? `/ ${rng.long}` : null, config.distanceUnits[rng.units]].filterJoin(' ');

      // Duration Label
      const dur = data.duration || {};
      if (['inst', 'perm'].includes(dur.units)) dur.value = null;
      labels.duration = [dur.value, config.timePeriods[dur.units]].filterJoin(' ');

      // Recharge Label
      const chg = data.recharge || {};
      labels.recharge = `${game.i18n.localize('WonderSystem.Recharge')} [${chg.value}${parseInt(chg.value, 10) < 6 ? '+' : ''}]`;
    }

    // Item Actions
    if (data.hasOwnProperty('actionType')) {
      // Damage
      const dam = data.damage || {};
      if (dam.parts) {
        labels.damage = dam.parts.map(d => d[0]).join(' + ').replace(/\+ -/g, '- ');
        labels.damageTypes = dam.parts.map(d => config.damageTypes[d[1]]).join(', ');
      }
    }

    // If this item is owned, we prepareFinalAttributes() at the end of actor init
    if (!this.isOwned) this.prepareFinalAttributes();
  }

  /**
   * Compute item attributes which might depend on prepared actor data. If this item is
   * embedded this method will be called after the actor's data is prepared. Otherwise it
   * will be called at the end of `Item5e#prepareDerivedData`.
   */
  prepareFinalAttributes() {
    // Proficiency
    const isProficient = (this.type === 'spell') || this.data.data.proficient; // Always proficient in spell attacks.
    // this.data.data.prof = new Proficiency(this.actor?.data.data.attributes.prof, isProficient);

    if (this.data.data.hasOwnProperty('actionType')) {
      // Ability checks
      this.labels.abilityCheck = game.i18n.format('WonderSystem.AbilityPromptTitle', {
        ability: CONFIG.wondershade.abilities[this.data.data?.ability],
      });

      // Saving throws
      this.getSaveDC();

      // To Hit
      this.getAttackToHit();

      // Limited Uses
      this.prepareMaxUses();

      // Damage Label
      this.getDerivedDamageLabel();
    }
  }

  // /**
  //  * Prepare a data object which is passed to any Roll formulas which are created related to this Item
  //  * @private
  //  */
  // getRollData() {
  //   // If present, return the actor's roll data.
  //   if (!this.actor) return null;
  //   const rollData = this.actor.getRollData();
  //   rollData.item = foundry.utils.deepClone(this.data.data);

  //   return rollData;
  // }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    // console.debug('[WonderItem:roll()] -> this', this);
    const chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
    };

    const cardData = { ...this.data, owner: this.actor._id };
    // console.debug('[WonderItem:roll()] -> cardData', cardData);

    chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);

    chatData.roll = true;
    return ChatMessage.create(chatData);
  }
}
