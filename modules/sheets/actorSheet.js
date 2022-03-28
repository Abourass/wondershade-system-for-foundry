export default class WonderActorSheet extends ActorSheet {
  /**
   * Options for the UI composition
   * This will make Item Sheets open larger
   * and with the classes we want
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 900,
      height: 800,
      // resizable: false,
      // draggable: false,
      classes: ['wondershade', 'sheet', 'character'],
      // scrollY: ['.sheet-body'],
    });
  }

  get template(){
    return `systems/wondershade/templates/sheets/actors/${this.actor.data.type}-sheet.hbs`;
  }

  getData() {
    // Execute the default getData() method
    const data = super.getData();
    console.log(data);
    // Attach the localization to the data
    data.config = CONFIG.wondershade;
    // Let's alias actor.data.data since it's tedious to access
    data.actorData = data.actor.data.data;

    if (data.actorData.firstOpen){
      const maxHealth = Math.round(((data.actorData.abilities.str.value / 5) + (data.actorData.abilities.con.value / 5)) * 1.5);
      // lets set their current health
      data.actorData.attributes.hp.value = maxHealth;
      // Lets set their max health
      data.actorData.attributes.hp.max = maxHealth;

      data.actorData.firstOpen = false;
    }

    return data;
  }

  activateListeners(html) {
    // Owner-only Listeners
    if (this.actor.owner) {
      html.find('.stat-roll').click(this._onStatRoll.bind(this));
    }

    super.activateListeners(html);
  }

  _onStatRoll(event) {
    const itemID = event.currentTarget.closest('.item').dataset.itemId;
    const item = this.actor.getOwnedItem(itemID);

    // Roll the stat
    item.roll();
  }
}
