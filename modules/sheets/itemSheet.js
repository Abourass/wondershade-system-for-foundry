/* eslint-disable no-unused-vars */
import injectMCETheme from '../theme/injectMCETheme.js';

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
    const ctx = super.getData(options);
    // Item Data
    const itemData = ctx.data;

    ctx.labels = this.items?.labels;

    // Attach the localization to the data
    ctx.config = CONFIG.wondershade;

    // Item Type, Status, and Details
    ctx.itemType = game.i18n.localize(`ITEM.Type${ctx.item.type.titleCase()}`);
    ctx.itemStatus = this._getItemStatus(itemData);
    ctx.itemProperties = this._getItemProperties(itemData);
    // ctx.baseItems = await this._getItemBaseTypes(itemData);
    // ctx.isPhysical = itemData.data.hasOwnProperty('quantity');

    if (itemData.type === 'spell' && !Array.isArray(itemData.data.damage.parts)) {
      const damageParts = [];
      Object.entries(itemData.data.damage.parts).forEach(([key, val]) => {
        damageParts.push([val['0'], val['1']]);
      });
      itemData.data.damage.parts = damageParts;
    }

    return ctx;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    html.find('.editor-edit').click(() => setTimeout(injectMCETheme(html), 1100));
    html.find('.damage-control').click(this._onDamageControl.bind(this));
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
    const ids = CONFIG.wondershade[`${type}Ids`];
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
      return CONFIG.wondershade.spellPreparationModes[item.data.preparation];
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
        .map(e => CONFIG.wondershade.weaponProperties[e[0]]));
    } else if (item.type === 'spell') {
      props.push(
        labels.components,
        labels.materials,
        item.data.components.concentration ? game.i18n.localize('WonderSystem.Concentration') : null,
        item.data.components.ritual ? game.i18n.localize('WonderSystem.Ritual') : null,
      );
    } else if (item.type === 'equipment') {
      props.push(CONFIG.wondershade.equipmentTypes[item.data.armor.type]);
      if (this.item.isArmor || this._isItemMountable(item)) props.push(labels.armor);
    } else if (item.type === 'feat') {
      props.push(labels.featType);
    }

    // Action type
    if (item.data.actionType) {
      props.push(CONFIG.wondershade.itemActionTypes[item.data.actionType]);
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

  /**
   * Is this item a separate large object like a siege engine or vehicle component that is
   * usually mounted on fixtures rather than equipped, and has its own AC and HP.
   * @param {object} item  Copy of item data being prepared for display.
   * @returns {boolean}    Is item siege weapon or vehicle equipment?
   * @private
   */
  _isItemMountable(item) {
    const data = item.data;
    return (item.type === 'weapon' && data.weaponType === 'siege')
        || (item.type === 'equipment' && data.armor.type === 'vehicle');
  }

  /**
   * Add or remove a damage part from the damage formula.
   * @param {Event} event             The original click event.
   * @returns {Promise<Item5e>|null}  Item with updates applied.
   * @private
   */
  async _onDamageControl(event) {
    event.preventDefault();
    const a = event.currentTarget;

    // Add new damage component
    if (a.classList.contains('add-damage')) {
      await this._onSubmit(event); // Submit any unsaved changes
      console.log('[itemSheet] this', this);
      let { parts } = this.item.data.data.damage;
      if (!Array.isArray(parts)){
        const damageParts = [];
        Object.entries(parts).forEach(([key, val]) => {
          damageParts.push([val['0'], val['1']]);
        });
        parts = damageParts;
      }
      console.log('[itemSheet] parts', parts);
      parts.push(['', '']);
      return this.item.update({ data: { damage: { parts } }});
    }

    // Remove a damage component
    if (a.classList.contains('delete-damage')) {
      await this._onSubmit(event); // Submit any unsaved changes
      const li = a.closest('.damage-part');
      const damage = foundry.utils.deepClone(this.item.data.data.damage);
      damage.parts.splice(Number(li.dataset.damagePart), 1);
      return this.item.update({'data.damage.parts': damage.parts});
    }
  }
}
