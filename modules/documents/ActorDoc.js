/**
 *
 * @param {number} value
 * @param {number} min The minimum the value can be returned as
 * @param {number} max The maximum the value can be returned as
 * @returns {number}
 */
Math.keepInsideRange = function(value, min, max) {
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('Math.keepInsideRange: value, min and max must be numbers');
  }
  if (value < min) value = min;
  if (value > max) value = max;
  return value;
};

export default class WonderActor extends Actor {
  chatTemplates = {
    skill: '/systems/wondershade/templates/chat/skill.hbs',
  };

  prepareData(){
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /**
   *
   * @param {number} value
   * @param {number} difficulty
   * @param {number} innateLuck
   * @returns {{success: number, hardSuccess: number, criticalSuccess: number, hardFailure: number, criticalFailure: number}}
   */
  _getSuccessAndFailure(value, difficulty, innateLuck){
    // Typecast the attributes if they are not already numbers
    if (typeof value !== 'number') Number(value);
    if (typeof difficulty !== 'number') difficulty = Number(difficulty);
    if (typeof innateLuck !== 'number') innateLuck = Number(innateLuck);
    // Success is equal to the skill's value minus the difficulty
    const success = Math.keepInsideRange((value + difficulty + innateLuck), 1, 100);
    // Hard Success is 25% of success
    const hardSuccess = (success !== 1)
      ? Math.keepInsideRange(Math.floor(success / 4), 1, 100)
      : 0;
    // Crit success is 12.5% of success
    let criticalSuccess = (success !== 1)
      ? Math.keepInsideRange(Math.floor(success / 8), 1, 100)
      : 0;
    // if hard success and crit success are the same subtract one from crit success
    if (hardSuccess === criticalSuccess) --criticalSuccess;
    // Hard Failure is 100 - 28% lack of skill (easier to fuck up in life)
    const hardFailure = Math.keepInsideRange(100 - Math.floor((100 - success) / 3.5), 1, 100);
    // Critical Failure is 100 - 12.5% lack of skill
    const criticalFailure = Math.keepInsideRange(100 - Math.floor((100 - success) / 8), 1, 100);

    return { success, hardSuccess, criticalSuccess, hardFailure, criticalFailure };
  }

  /**
   *
   * @param {number} computedRoll
   * @param {number} value
   * @param {number} difficulty
   * @param {number} innateLuck
   * @returns {'Success'|'Hard Success'|'Critical Success'|'Failure'|'Hard Failure'|'Critical Failure'}
   */
  _getOutcome(computedRoll, value, difficulty, innateLuck){
    const { success, hardSuccess, criticalSuccess, hardFailure, criticalFailure } = this._getSuccessAndFailure(value, difficulty, innateLuck);

    if (computedRoll <= success) {
      if (computedRoll <= hardSuccess) {
        if (computedRoll <= criticalSuccess) return 'Critical Success';
        return 'Hard Success';
      }
      return 'Success';
    }
    if (computedRoll >= hardFailure) {
      if (computedRoll >= criticalFailure) return 'Critical Failure';
      return 'Hard Failure';
    }
    return 'Failure';
  }

  /**
   * Handle clickable rolls.
   * @param {Event} ctx
   * @private
   */
  async roll(ctx) {
    // Alias the actor to make the function more self documenting
    const actor = this.data;
    // Grab the actors willpower
    const willpower = Number(actor.data.attributes.willpower);
    // Grab the characters difficulty
    const difficulty = Number(actor.data.attributes.difficulty);
    // Grab I. Luck
    const innateLuck = Number(actor.data.abilities.iLuck.value);
    // Get the success and failure values for this skill
    const { success, hardSuccess, criticalSuccess, hardFailure, criticalFailure } = this._getSuccessAndFailure(ctx.value, difficulty, innateLuck);

    await ctx.roll.evaluate({ async: true });

    const computedRoll = Math.keepInsideRange(Number(ctx.roll.result) + willpower, 1, 100);
    const rollOutcome = this._getOutcome(computedRoll, ctx.value, difficulty, innateLuck);

    if (rollOutcome === 'Critical Failure'){
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
      actor,
      owner: actor._id,
      skill: {
        keyVal: ctx.name,
        value: Number(ctx.value),
        label: ctx.label,
      },
      condition: {
        success,
        hardSuccess,
        criticalSuccess,
        hardFailure,
        criticalFailure,
      },
      roll: {
        ctx: ctx.roll,
        result: ctx.roll.result,
        computed: computedRoll,
        outcome: rollOutcome,
        success: (computedRoll <= success),
        hard: rollOutcome === 'Hard Success' || rollOutcome === 'Hard Failure',
        crit: rollOutcome === 'Critical Success' || rollOutcome === 'Critical Failure',
      },
      difficulty: Number(actor.data.attributes.difficulty),
      willpower,
      innateLuck,
    };

    chatData.content = await renderTemplate(this.chatTemplates.skill, cardData);

    return ChatMessage.create(chatData);
  }
}
