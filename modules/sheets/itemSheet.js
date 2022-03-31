export default class WonderItemSheet extends ItemSheet {
  /**
   * Options for the UI composition
   * This will make Item Sheets open larger and with the classes we want
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 600,
      height: 600,
      // resizable: false,
      // draggable: false,
      classes: ['wondershade', 'sheet', 'item'],
      // scrollY: ['.sheet-body'],
    });
  }

  // Point to the correct HTML depending on the item type
  get template(){
    return `systems/wondershade/templates/sheets/items/${this.item.data.type}-sheet.hbs`;
  }

  getData() {
    // Execute the default getData() method
    const data = super.getData();
    // Attach the localization to the data
    data.config = CONFIG.wondershade;
    return data;
  }
}
