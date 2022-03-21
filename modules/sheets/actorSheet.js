export default class WonderActorSheet extends ActorSheet {
  /**
   * Options for the UI composition
   * This will make Item Sheets open larger
   * and with the classes we want
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 800,
      height: 860,
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
    // Let's alias actor data.data since it's tedious to access
    data.actorData = data.actor.data.data;

    // Attach the stat types
    data.stats = {
      top: [
        { shortTxt: 'Str', fullTxt: 'Strength' },
        { shortTxt: 'Int', fullTxt: 'Intelligence' },
        { shortTxt: 'Dex', fullTxt: 'Dexterity' },
        { shortTxt: 'Cha', fullTxt: 'Charisma' },
      ],
      bottom: [
        { shortTxt: 'Con', fullTxt: 'Constitution' },
        { shortTxt: 'Pow', fullTxt: 'Power' },
        { shortTxt: 'Luck', fullTxt: 'Luck' },
        { shortTxt: 'I. Luck', fullTxt: 'ILuck' },
      ]
    }
    return data;
  }
}
