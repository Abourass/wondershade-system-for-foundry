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
    console.log('[WonderItem] roll');
    const chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
    };

    const cardData = { ...this.data, owner: this.actor._id };

    chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);

    chatData.roll = true;
    return ChatMessage.create(chatData);
  }
}
