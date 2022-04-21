import keepInsideRange from '../helpers/keepInsideRange.js';
import getOutcomeAndConditions from '../rolls/successAndFailureConditions.js';

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

    await ctx.roll.evaluate({ async: true });

    const computedRoll = keepInsideRange(Number(ctx.roll.result) + willpower, 1, 100);
    // Get the success and failure values for this skill
    const { condition, outcome } = getOutcomeAndConditions(computedRoll, willpower, difficulty, innateLuck);

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
      actor,
      owner: actor._id,
      skill: { keyVal: ctx.name, value: Number(ctx.value), label: ctx.label },
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

    chatData.content = await renderTemplate(this.chatTemplates.skill, cardData);

    return ChatMessage.create(chatData);
  }
}
