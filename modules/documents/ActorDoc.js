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
    // Hard Failure is 100 - hard Success
    const hardFailure = Math.keepInsideRange(100 - hardSuccess, 1, 100);
    // Critical Failure is 100 - critical Success
    const criticalFailure = Math.keepInsideRange(100 - criticalSuccess, 1, 100);

    return { success, hardSuccess, criticalSuccess, hardFailure, criticalFailure };
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async rollSkill(ctx) {
    console.debug('[WonderActor:rollSkill()] -> ctx', ctx);
    console.debug('[WonderActor:rollSkill()] -> this', this);
    // Alias the actor to make the function more self documenting
    const actor = this.data;
    // Grab the actors willpower
    const willpower = Number(actor.data.attributes.willpower);
    // Get the success and failure values for this skill
    const { success, hardSuccess, criticalSuccess, hardFailure, criticalFailure } = this._getSuccessAndFailure(ctx.skillValue, actor);

    await ctx.roll.evaluate({ async: true });

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
        computed: Math.keepInsideRange(Number(ctx.roll.result) + willpower, 1, 100),
      },
      difficulty: Number(actor.data.attributes.difficulty),
      willpower,
    };
    console.debug('[WonderActor:rollSkill()] -> cardData', cardData);

    chatData.content = await renderTemplate(this.chatTemplates.skill, cardData);

    return ChatMessage.create(chatData);
  }
}
