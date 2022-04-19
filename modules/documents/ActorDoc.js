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

  _getSuccessAndFailure(skillValue, actor){
    if (typeof skillValue !== 'number') Number(skillValue);
    // Grab the actors roll difficulty
    const difficulty = Number(actor.data.attributes.difficulty);
    // Success is equal to the skill's value minus the difficulty
    const success = Math.keepInsideRange(skillValue + difficulty, 1, 100);
    // Hard Success is 33% of success
    const hardSuccess = (success !== 1)
      ? Math.keepInsideRange(Math.floor(success / 3), 1, 100)
      : 0;
    // Crit success is 14.28% of success
    let criticalSuccess = (success !== 1)
      ? Math.keepInsideRange(Math.floor(success / 7), 1, 100)
      : 0;
    // if hard success and crit success are the same subtract one from crit success
    if (hardSuccess === criticalSuccess) --criticalSuccess;
    // Hard Failure is 100 - 33% lack of skill
    const hardFailure = Math.keepInsideRange(100 - Math.floor((100 - success) / 3), 1, 100);
    // Critical Failure is 100 - 14.28% lack of skill
    const criticalFailure = Math.keepInsideRange(100 - Math.floor((100 - success) / 7), 1, 100);

    return { success, hardSuccess, criticalSuccess, hardFailure, criticalFailure };
  }

  _getOutcome(computedRoll, skillValue, actor){
    const { success, hardSuccess, criticalSuccess, hardFailure, criticalFailure } = this._getSuccessAndFailure(skillValue, actor);

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
   * @param {Event} event   The originating click event
   * @private
   */
  async rollSkill(ctx) {
    // Alias the actor to make the function more self documenting
    const actor = this.data;
    // Grab the actors willpower
    const willpower = Number(actor.data.attributes.willpower);
    // Get the success and failure values for this skill
    const { success, hardSuccess, criticalSuccess, hardFailure, criticalFailure } = this._getSuccessAndFailure(ctx.skillValue, actor);

    await ctx.roll.evaluate({ async: true });

    const computedRoll = Math.keepInsideRange(Number(ctx.roll.result) + willpower, 1, 100);
    const rollOutcome = this._getOutcome(computedRoll, ctx.skillValue, actor);

    if (rollOutcome === 'Critical Failure'){
      ctx.roll.dice[0].options.sfx = {
        specialEffect: 'PlayAnimationImpact',
      };
    }

    console.log(ctx.roll);
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
        keyVal: ctx.skillName,
        value: Number(ctx.skillValue),
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
    };

    chatData.content = await renderTemplate(this.chatTemplates.skill, cardData);

    return ChatMessage.create(chatData);
  }
}
