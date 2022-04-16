export default class WonderItemSheet extends ItemSheet {
  /**
   * Options for the UI composition
   * This will make Item Sheets open larger and with the classes we want
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 600,
      height: 600,
      classes: ['wondershade', 'sheet', 'item'],
      // scrollY: ['.sheet-body'],
      resizable: true,
      scrollY: ['.tab.details'],
      tabs: [{navSelector: '.tabs', contentSelector: '.sheet-body', initial: 'description'}],

    });
  }

  // Point to the correct HTML depending on the item type
  get template(){
    return `systems/wondershade/templates/sheets/items/${this.item.data.type}-sheet.hbs`;
  }

  async getData(options) {
    // Execute the default getData() method
    const data = super.getData(options);
    // Item Data
    const itemData = data.data;

    data.labels = this.items?.labels;

    // Attach the localization to the data
    data.config = CONFIG.wondershade;

    // Item Type, Status, and Details
    data.itemType = game.i18n.localize(`ITEM.Type${data.item.type.titleCase()}`);
    data.itemStatus = this._getItemStatus(itemData);
    data.itemProperties = this._getItemProperties(itemData);
    // data.baseItems = await this._getItemBaseTypes(itemData);
    data.isPhysical = itemData.data.hasOwnProperty('quantity');

    return data;
  }

  /**
   * Get the base weapons and tools based on the selected type.
   *
   * @param {object} item        Item data for the item being displayed
   * @returns {Promise<object>}  Object with base items for this type formatted for selectOptions.
   * @protected
   */
  async _getItemBaseTypes(item) {
    const type = item.type === 'equipment' ? 'armor' : item.type;
    const ids = CONFIG.WonderSystem[`${type}Ids`];
    if (ids === undefined) return {};

    const typeProperty = type === 'armor' ? 'armor.type' : `${type}Type`;
    const baseType = foundry.utils.getProperty(item.data, typeProperty);

    const items = await Object.entries(ids).reduce(async(acc, [name, id]) => {
      const baseItem = await ProficiencySelector.getBaseItem(id);
      const obj = await acc;
      if (baseType !== foundry.utils.getProperty(baseItem.data, typeProperty)) return obj;
      obj[name] = baseItem.name;
      return obj;
    }, {});

    return Object.fromEntries(Object.entries(items).sort((lhs, rhs) => lhs[1].localeCompare(rhs[1])));
  }

  /**
   * Get the text item status which is shown beneath the Item type in the top-right corner of the sheet.
   * @param {object} item    Copy of the item data being prepared for display.
   * @returns {string|null}  Item status string if applicable to item's type.
   * @private
   */
  _getItemStatus(item) {
    if (item.type === 'spell') {
      return CONFIG.WonderSystem.spellPreparationModes[item.data.preparation];
    }
    if (['weapon', 'equipment'].includes(item.type)) {
      return game.i18n.localize(item.data.equipped ? 'WonderSystem.Equipped' : 'WonderSystem.Unequipped');
    }
    if (item.type === 'tool') {
      return game.i18n.localize(item.data.proficient ? 'WonderSystem.Proficient' : 'WonderSystem.NotProficient');
    }
  }

  /**
   * Get the Array of item properties which are used in the small sidebar of the description tab.
   * @param {object} item  Copy of the item data being prepared for display.
   * @returns {Array<string>}   List of property labels to be shown.
   * @private
   */
  _getItemProperties(item) {
    const props = [];
    const labels = this.item.labels;

    if (item.type === 'weapon') {
      props.push(...Object.entries(item.data.properties)
        .filter(e => e[1] === true)
        .map(e => CONFIG.WonderSystem.weaponProperties[e[0]]));
    } else if (item.type === 'spell') {
      props.push(
        labels.components,
        labels.materials,
        item.data.components.concentration ? game.i18n.localize('WonderSystem.Concentration') : null,
        item.data.components.ritual ? game.i18n.localize('WonderSystem.Ritual') : null,
      );
    } else if (item.type === 'equipment') {
      props.push(CONFIG.WonderSystem.equipmentTypes[item.data.armor.type]);
      if (this.item.isArmor || this._isItemMountable(item)) props.push(labels.armor);
    } else if (item.type === 'feat') {
      props.push(labels.featType);
    }

    // Action type
    if (item.data.actionType) {
      props.push(CONFIG.WonderSystem.itemActionTypes[item.data.actionType]);
    }

    // Action usage
    if ((item.type !== 'weapon') && item.data.activation && !isObjectEmpty(item.data.activation)) {
      props.push(
        labels.activation,
        labels.range,
        labels.target,
        labels.duration,
      );
    }
    return props.filter(p => !!p);
  }
}
