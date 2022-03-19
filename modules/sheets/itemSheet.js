export default class WonderItemSheet extends ItemSheet {
  get template(){
    return `systems/wondershade/templates/sheets/${this.item.data.type}-sheet.html`;
  }
}
