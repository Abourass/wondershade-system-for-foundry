import keepInsideRange from '../helpers/keepInsideRange.js';
import getOutcomeAndConditions from '../rolls/successAndFailureConditions.js';

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export default class WonderItem extends Item {
  chatTemplates = {
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
    console.debug('[WonderItem:prepareDerivedData()] -> itemData', itemData);
    const data = itemData.data;
    console.debug('[WonderItem:prepareDerivedData()] -> GLOBAL CONFIG', CONFIG);
    const config = CONFIG.wondershade;
    // console.debug('[WonderItem] prepareDerivedData', itemData);
    console.debug('[WonderItem:prepareDerivedData()] this', this);
    this.labels = {};
    const labels = this.labels;

    // // Classes
    // if (itemData.type === 'class') {
    //   data.levels = Math.clamped(data.levels, 1, 20);
    // }

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

    // // Activated Items
    // if (data.hasOwnProperty('activation')) {
    //   // Ability Activation Label
    //   const act = data.activation || {};
    //   // console.debug('[WonderItem] config', config);
    //   if (act) labels.activation = [act.cost, config.abilityActivationTypes[act.type]].filterJoin(' ');

    //   // Target Label
    //   const tgt = data.target || {};
    //   if (['none', 'touch', 'self'].includes(tgt.units)) tgt.value = null;
    //   if (['none', 'self'].includes(tgt.type)) {
    //     tgt.value = null;
    //     tgt.units = null;
    //   }
    //   labels.target = [tgt.value, config.distanceUnits[tgt.units], config.targetTypes[tgt.type]].filterJoin(' ');

    //   // Range Label
    //   const rng = data.range || {};
    //   if (['none', 'touch', 'self'].includes(rng.units)) {
    //     rng.value = null;
    //     rng.long = null;
    //   }
    //   labels.range = [rng.value, rng.long ? `/ ${rng.long}` : null, config.distanceUnits[rng.units]].filterJoin(' ');

    //   // Duration Label
    //   const dur = data.duration || {};
    //   if (['inst', 'perm'].includes(dur.units)) dur.value = null;
    //   labels.duration = [dur.value, config.timePeriods[dur.units]].filterJoin(' ');

    //   // Recharge Label
    //   const chg = data.recharge || {};
    //   labels.recharge = `${game.i18n.localize('WonderSystem.Recharge')} [${chg.value}${parseInt(chg.value, 10) < 6 ? '+' : ''}]`;
    // }

    // // Item Actions
    // if (data.hasOwnProperty('actionType')) {
    //   // Damage
    //   const dam = data.damage || {};
    //   if (dam.parts) {
    //     labels.damage = dam.parts.map(d => d[0]).join(' + ').replace(/\+ -/g, '- ');
    //     labels.damageTypes = dam.parts.map(d => config.damageTypes[d[1]]).join(', ');
    //   }
    // }

    // // If this item is owned, we prepareFinalAttributes() at the end of actor init
    // if (!this.isOwned) this.prepareFinalAttributes();
  }

  /**
   * Does the item provide an amount of healing instead of conventional damage?
   * @type {boolean}
   */
  get isHealing() {
    return (this.data.data.actionType === 'heal') && this.data.data.damage.parts.length;
  }

  // /**
  //  * Populate a label with the compiled and simplified damage formula based on owned item
  //  * actor data. This is only used for display purposes and is not related to `Item5e#rollDamage`.
  //  * @returns {{damageType: number, formula: string}[]}
  //  */
  // getDerivedDamageLabel() {
  //   const itemData = this.data.data;
  //   if (!this.hasDamage || !itemData || !this.isOwned) return [];
  //   const rollData = this.getRollData();
  //   const derivedDamage = itemData.damage?.parts?.map((damagePart) => {
  //     let formula;
  //     try {
  //       const roll = new Roll(damagePart[0], rollData);
  //       formula = simplifyRollFormula(roll.formula, { preserveFlavor: true });
  //     } catch (err) { console.warn(`Unable to simplify formula for ${this.name}: ${err}`); }
  //     return { formula, damageType: damagePart[1] };
  //   });
  //   this.labels.derivedDamage = derivedDamage;
  //   return derivedDamage;
  // }

  // /**
  //  * Update the derived spell DC for an item that requires a saving throw.
  //  * @returns {number|null}
  //  */
  // getSaveDC() {
  //   if (!this.hasSave) return;
  //   const save = this.data.data?.save;

  //   // Actor spell-DC based scaling
  //   if (save.scaling === 'spell') {
  //     save.dc = this.isOwned ? getProperty(this.actor.data, 'data.attributes.spelldc') : null;
  //   } else if (save.scaling !== 'flat') { // Ability-score based scaling
  //     save.dc = this.isOwned ? getProperty(this.actor.data, `data.abilities.${save.scaling}.dc`) : null;
  //   }

  //   // Update labels
  //   const abl = CONFIG.WonderSystem.abilities[save.ability];
  //   this.labels.save = game.i18n.format('WonderSystem.SaveDC', {dc: save.dc || '', ability: abl});
  //   return save.dc;
  // }

  /* -------------------------------------------- */

  // /**
  //  * Update a label to the Item detailing its total to hit bonus.
  //  * Sources:
  //  * - item document's innate attack bonus
  //  * - item's actor's proficiency bonus if applicable
  //  * - item's actor's global bonuses to the given item type
  //  * - item's ammunition if applicable
  //  *
  //  * @returns {{rollData: object, parts: string[]}|null}  Data used in the item's Attack roll.
  //  */
  // getAttackToHit() {
  //   const itemData = this.data.data;
  //   if (!this.hasAttack || !itemData) return;
  //   const rollData = this.getRollData();

  //   // Define Roll bonuses
  //   const parts = [];

  //   // Include the item's innate attack bonus as the initial value and label
  //   if (itemData.attackBonus) {
  //     parts.push(itemData.attackBonus);
  //     this.labels.toHit = itemData.attackBonus;
  //   }

  //   // Take no further action for un-owned items
  //   if (!this.isOwned) return {rollData, parts};

  //   // Ability score modifier
  //   parts.push('@mod');

  //   // Add proficiency bonus if an explicit proficiency flag is present or for non-item features
  //   if (!['weapon', 'consumable'].includes(this.data.type) || itemData.proficient) {
  //     parts.push('@prof');
  //     if (this.data.data.prof?.hasProficiency) {
  //       rollData.prof = this.data.data.prof.term;
  //     }
  //   }

  //   // Actor-level global bonus to attack rolls
  //   const actorBonus = this.actor.data.data.bonuses?.[itemData.actionType] || {};
  //   if (actorBonus.attack) parts.push(actorBonus.attack);

  //   // One-time bonus provided by consumed ammunition
  //   if ((itemData.consume?.type === 'ammo') && this.actor.items) {
  //     const ammoItemData = this.actor.items.get(itemData.consume.target)?.data;

  //     if (ammoItemData) {
  //       const ammoItemQuantity = ammoItemData.data.quantity;
  //       const ammoCanBeConsumed = ammoItemQuantity && (ammoItemQuantity - (itemData.consume.amount ?? 0) >= 0);
  //       const ammoItemAttackBonus = ammoItemData.data.attackBonus;
  //       const ammoIsTypeConsumable = (ammoItemData.type === 'consumable') && (ammoItemData.data.consumableType === 'ammo');
  //       if (ammoCanBeConsumed && ammoItemAttackBonus && ammoIsTypeConsumable) {
  //         parts.push('@ammo');
  //         rollData.ammo = ammoItemAttackBonus;
  //       }
  //     }
  //   }

  //   // Condense the resulting attack bonus formula into a simplified label
  //   const roll = new Roll(parts.join('+'), rollData);
  //   const formula = simplifyRollFormula(roll.formula);
  //   this.labels.toHit = !/^[+-]/.test(formula) ? `+ ${formula}` : formula;

  //   // Update labels and return the prepared roll data
  //   return {rollData, parts};
  // }

  /* -------------------------------------------- */

  // /**
  //  * Retrieve an item's critical hit threshold. Uses the smallest value from among the
  //  * following sources:
  //  * - item document
  //  * - item document's actor (if it has one)
  //  * - the constant '20'
  //  *
  //  * @returns {number|null}  The minimum value that must be rolled to be considered a critical hit.
  //  */
  // getCriticalThreshold() {
  //   const itemData = this.data.data;
  //   const actorFlags = this.actor.data.flags.wondershade || {};
  //   if (!this.hasAttack || !itemData) return;

  //   // Get the actor's critical threshold
  //   let actorThreshold = null;

  //   if (this.data.type === 'weapon') {
  //     actorThreshold = actorFlags.weaponCriticalThreshold;
  //   } else if (this.data.type === 'spell') {
  //     actorThreshold = actorFlags.spellCriticalThreshold;
  //   }

  //   // Return the lowest of the the item and actor thresholds
  //   return Math.min(itemData.critical?.threshold ?? 20, actorThreshold ?? 20);
  // }

  /* -------------------------------------------- */

  // /**
  //  * Populates the max uses of an item. If the item is an owned item and the `max`
  //  * is not numeric, calculate based on actor data.
  //  */
  // prepareMaxUses() {
  //   const data = this.data.data;
  //   if (!data.uses?.max) return;
  //   let max = data.uses.max;

  //   // If this is an owned item and the max is not numeric, we need to calculate it
  //   if (this.isOwned && !Number.isNumeric(max)) {
  //     if (this.actor.data === undefined) return;
  //     try {
  //       max = Roll.replaceFormulaData(max, this.actor.getRollData(), {missing: 0, warn: true});
  //       max = Roll.safeEval(max);
  //     } catch (e) {
  //       console.error('Problem preparing Max uses for', this.data.name, e);
  //       return;
  //     }
  //   }
  //   data.uses.max = Number(max);
  // }

  // /**
  //  * Compute item attributes which might depend on prepared actor data. If this item is
  //  * embedded this method will be called after the actor's data is prepared. Otherwise it
  //  * will be called at the end of `Item5e#prepareDerivedData`.
  //  */
  // prepareFinalAttributes() {
  //   // Proficiency
  //   const isProficient = (this.type === 'spell') || this.data.data.proficient; // Always proficient in spell attacks.
  //   // this.data.data.prof = new Proficiency(this.actor?.data.data.attributes.prof, isProficient);

  //   if (this.data.data.hasOwnProperty('actionType')) {
  //     console.log('[WonderItem] prepareFinalAttributes', CONFIG.wondershade);
  //     // Ability checks
  //     this.labels.abilityCheck = game.i18n.format('WonderSystem.AbilityPromptTitle', {
  //       ability: CONFIG.wondershade.abilities[this.data.data?.ability],
  //     });

  //     // Saving throws
  //     this.getSaveDC();

  //     // To Hit
  //     this.getAttackToHit();

  //     // Limited Uses
  //     this.prepareMaxUses();

  //     // Damage Label
  //     this.getDerivedDamageLabel();
  //   }
  // }

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
  async roll(ctx) {
    // Alias the actor to make the function more self documenting
    const item = this.data;
    const actor = this.actor.data;
    console.log('[WonderItem] roll -> item', item);
    console.log('[WonderItem] roll -> ctx', ctx);
    console.log('[WonderItem] roll -> this', this);
    // Grab the actors willpower
    const willpower = Number(actor.data.attributes.willpower);
    // Grab the characters difficulty
    const difficulty = Number(actor.data.attributes.difficulty);
    // Grab I. Luck
    const innateLuck = Number(actor.data.abilities.iLuck.value);

    await ctx.roll.evaluate({ async: true });

    const computedRoll = keepInsideRange(Number(ctx.roll.result) + willpower, 1, 100);
    // Get the success and failure values for this skill
    const { condition, outcome } = getOutcomeAndConditions(computedRoll, ctx.value, difficulty, innateLuck);

    if (outcome === 'Critical Failure'){
      ctx.roll.dice[0].options.sfx = { specialEffect: 'PlayAnimationImpact' };
    }

    const chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ actor }),
      roll: ctx.roll,
      rollMode: game.settings.get('core', 'rollMode'),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    };

    const cardData = {
      item,
      actor,
      owner: this.actor._id,
      condition,
      roll: {
        ctx: ctx.roll,
        result: ctx.roll.result,
        computed: computedRoll,
        outcome,
        success: outcome === 'Success' || outcome === 'Hard Success' || outcome === 'Critical Success',
        hard: outcome === 'Hard Success' || outcome === 'Hard Failure',
        crit: outcome === 'Critical Success' || outcome === 'Critical Failure',
      },
      difficulty: Number(actor.data.attributes.difficulty),
      willpower,
      innateLuck,
    };
    // console.debug('[WonderItem:roll()] -> cardData', cardData);

    chatData.content = await renderTemplate(this.chatTemplates[this.type], cardData);

    return ChatMessage.create(chatData);
  }
}
