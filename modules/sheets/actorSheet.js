export default class WonderItemSheet extends ActorSheet {
  /**
   * Options for the UI composition
   * This will make Item Sheets open larger
   * and with the classes we want
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 600,
      height: 600,
      // resizable: false,
      // draggable: false,
      classes: ['wondershade', 'sheet', 'character'],
      // scrollY: ['.sheet-body'],
    });
  }

  get template(){
    return `systems/wondershade/templates/sheets/actors/${this.actor.data.type}-sheet.html`;
  }

  getData() {
    // Execute the default getData() method
    const data = super.getData();
    // Attach the localization to the data
    data.config = CONFIG.wondershade;
    return data;
  }
}
