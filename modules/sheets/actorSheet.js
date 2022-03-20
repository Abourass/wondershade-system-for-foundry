export default class WonderItemSheet extends ActorSheet {
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
