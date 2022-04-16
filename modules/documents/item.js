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
    const C = CONFIG.WonderSystem;
    console.log('[WonderItem] prepareDerivedData', itemData);
    console.log('[WonderItem] this.labels', this);
    this.labels = {};
    const labels = this.labels;

    // Classes
    if (itemData.type === 'class') {
      data.levels = Math.clamped(data.levels, 1, 20);
    }

    // Spell Level,  School, and Components
    if (itemData.type === 'spell') {
      data.preparation.mode = data.preparation.mode || 'prepared';
      labels.level = C.spellLevels[data.level];
      labels.school = C.spellSchools[data.school];
      labels.components = Object.entries(data.components).reduce((arr, c) => {
        if (c[1] !== true) return arr;
        arr.push(c[0].titleCase().slice(0, 1));
        return arr;
      }, []);
      labels.materials = data?.materials?.value ?? null;
    } else if (itemData.type === 'feat') { // Feat Items
      const act = data.activation;
      if (act && (act.type === C.abilityActivationTypes.legendary)){
        labels.featType = game.i18n.localize('WonderSystem.LegendaryActionLabel');
      } else if (act && (act.type === C.abilityActivationTypes.lair)){
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
      if (act) labels.activation = [act.cost, C.abilityActivationTypes[act.type]].filterJoin(' ');

      // Target Label
      const tgt = data.target || {};
      if (['none', 'touch', 'self'].includes(tgt.units)) tgt.value = null;
      if (['none', 'self'].includes(tgt.type)) {
        tgt.value = null;
        tgt.units = null;
      }
      labels.target = [tgt.value, C.distanceUnits[tgt.units], C.targetTypes[tgt.type]].filterJoin(' ');

      // Range Label
      const rng = data.range || {};
      if (['none', 'touch', 'self'].includes(rng.units)) {
        rng.value = null;
        rng.long = null;
      }
      labels.range = [rng.value, rng.long ? `/ ${rng.long}` : null, C.distanceUnits[rng.units]].filterJoin(' ');

      // Duration Label
      const dur = data.duration || {};
      if (['inst', 'perm'].includes(dur.units)) dur.value = null;
      labels.duration = [dur.value, C.timePeriods[dur.units]].filterJoin(' ');

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
        labels.damageTypes = dam.parts.map(d => C.damageTypes[d[1]]).join(', ');
      }
    }

    // If this item is owned, we prepareFinalAttributes() at the end of actor init
    if (!this.isOwned) this.prepareFinalAttributes();
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
    console.log('[WonderItem] roll', this);
    const chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
    };

    const cardData = { ...this.data, owner: this.actor._id };
    console.log('[WonderItem] cardData', cardData);

    chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);

    chatData.roll = true;
    return ChatMessage.create(chatData);
  }
}
