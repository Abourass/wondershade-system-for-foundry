import { createGalaxy } from '../theme/cloudThemes.js';
import attachCollapsibleListeners from '../theme/collapsible.js';

export default class WonderActorSheet extends ActorSheet {
  /**
   * Options for the UI composition
   * This will make Item Sheets open larger and with the classes we want
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      width: 900,
      height: 800,
      // resizable: false,
      // draggable: false,
      classes: ['wondershade', 'sheet', 'character'],
      tabs: [{
        navSelector: '.tab-controls',
        contentSelector: '.tabs',
        initial: 'skills',
      },
      {
        navSelector: '.magick-controls',
        contentSelector: '.magick-tabs',
        initial: 'wonder',
      }],
      // scrollY: ['.sheet-body'],
    });
  }

  get template(){
    return `systems/wondershade/templates/sheets/actors/${this.actor.data.type}-sheet.hbs`;
  }

  getData() {
    // Execute the default getData() method
    const ctx = super.getData();
    // console.debug('[WonderSystem:CTX]', ctx);

    // Prepare the spell slots early so they are copied in the next step
    this._prepareSpellSlots(ctx);

    // Create a safe clone of the actor data
    const actorData = this.actor.data.toObject(false);

    console.log('[WonderSystem:ActorData]', actorData);

    // Attach the localization to the ctx
    ctx.config = CONFIG.wondershade;

    // Let's alias actor.data.data since it's tedious to access
    ctx.actorData = actorData.data;
    // Attach flags
    ctx.flags = actorData.flags;

    this._prepareItems(ctx);

    // if (data.actorData.firstOpen){
    //   const maxHealth = Math.round(((data.actorData.abilities.str.value / 5) + (data.actorData.abilities.con.value / 5)) * 1.5);
    //   // lets set their current health
    //   data.actorData.attributes.hp.value = maxHealth;
    //   // Lets set their max health
    //   data.actorData.attributes.hp.max = maxHealth;

    //   data.actorData.firstOpen = false;
    // }

    return ctx;
  }

  _prepareItems(ctx) {
    // Create Arrays to store the User-Specific Items In
    const weapons = [];
    const equipment = [];
    const consumables = [];
    const tools = [];
    const loot = [];
    const classFeatures = [];
    const feats = [];
    const backpack = [];
    const spells = {
      cantrips: [],
      wonderSpells: [],
      finesse: [],
      firstLevel: [],
      secondLevel: [],
      thirdLevel: [],
      fourthLevel: [],
      fifthLevel: [],
      sixthLevel: [],
      seventhLevel: [],
      eighthLevel: [],
      ninthLevel: [],
    };

    // Iterate through the items, assigning them to their appropriate array
    for (const item of ctx.items) {
      item.img = item.img || DEFAULT_TOKEN;
      if (item.type === 'weapon') weapons.push(item);
      if (item.type === 'equipment') equipment.push(item);
      if (item.type === 'consumable') consumables.push(item);
      if (item.type === 'tool') tools.push(item);
      if (item.type === 'loot') loot.push(item);
      if (item.type === 'classFeature') classFeatures.push(item);
      if (item.type === 'feat') feats.push(item);
      if (item.type === 'spell'){
        switch (item.data.level) {
          case 0: spells.cantrips.push(item); break;
          case 1: spells.firstLevel.push(item); break;
          case 2: spells.secondLevel.push(item); break;
          case 3: spells.thirdLevel.push(item); break;
          case 4: spells.fourthLevel.push(item); break;
          case 5: spells.fifthLevel.push(item); break;
          case 6: spells.sixthLevel.push(item); break;
          case 7: spells.seventhLevel.push(item); break;
          case 8: spells.eighthLevel.push(item); break;
          case 9: spells.ninthLevel.push(item); break;
          case 10: spells.wonderSpells.push(item); break;
        }
      }
      if (item.type === 'backpack') backpack.push(item);
    }

    // Assign the user specific data to the context
    ctx.weapons = weapons;
    ctx.allEquipment = equipment;
    ctx.consumables = consumables;
    ctx.tools = tools;
    ctx.allLoot = loot;
    ctx.classFeatures = classFeatures;
    ctx.allFeats = feats;
    ctx.allSpells = spells;
    ctx.containers = backpack;
    console.log('[WonderSystem:ActorSheet:_prepareItems]', ctx);
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Inject the Galaxy Theme high up enough into the DOM it's not affected by the sheet refresh
    createGalaxy(html);

    // console.log(this.actor);

    attachCollapsibleListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    if (this.actor.isOwner){
      // Attach Edit Event to Items
      this._attachItemEditEvents(html);

      // Add Inventory Item
      html.find('.add-item').click(this._itemCreationEvent.bind(this));

      // Attach the spell slot change event
      html.find('.spellSlotCheck').change(this._spellSlotCheckEvent.bind(this));

      // Attach the spell slot disable event
      html.find('.smallDot').contextmenu(this._toggleDisabledSlots.bind(this));

      // Rollable abilities.
      html.find('.rollable').click(this._onRoll.bind(this));

      // Attach the delete event to items
      this._attachItemDeletionEvents(html);
    }
  }

  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    // console.debug('[ActorSheet:Roll] -> dataset', dataset);

    // Handle item rolls.

    if (dataset?.rollType === 'item') {
      const itemEl = element.closest('.item');
      // console.debug('[ActorSheet:Roll] -> item');
      const { itemId, itemStat, itemSpell } = itemEl.dataset;
      // console.debug('[ActorSheet:Roll] -> itemId', itemId);
      const item = this.actor.items.get(itemId);
      // console.debug('[ActorSheet:Roll] -> item', item);
      const { value } = (itemSpell)
        ? this.actor.data.data.attributes.sanity
        : this.actor.data.data.abilities[itemStat];
      const roll = new Roll('1d100', this.actor.getRollData());
      await item.roll({ value, name: itemStat, roll });
      return roll;
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      const label = dataset.label ? `[ability] ${dataset.label}` : '';
      const roll = new Roll(dataset.roll, this.actor.getRollData());
      // console.debug('[ActorSheet:Roll] -> roll', roll);
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }

    // Handle skill rolls.
    if (dataset.rollSkill || dataset.rollForce || dataset.rollAbility) {
      // console.log('[ActorSheet:Roll] -> skill', dataset);
      // console.log('[ActorSheet:Roll] -> actor', this.actor);
      const { value } = (() => {
        if (dataset.rollSkill) return this.actor.data.data.skills[dataset.rollSkill];
        if (dataset.rollForce) return this.actor.data.data.attributes[dataset.rollForce];
        if (dataset.rollAbility) return this.actor.data.data.abilities[dataset.rollAbility];
      })();
      const roll = new Roll('1d100', this.actor.getRollData());
      await this.actor.roll({
        label: dataset.label,
        value,
        name: dataset?.rollSkill || dataset?.rollStat || dataset?.rollAbility,
        roll,
      });
      return roll;
    }
  }

  async _itemCreationEvent(event){
    event.preventDefault();

    const element = event.currentTarget;
    const { itemType } = element.dataset;

    const itemData = {
      name: `New ${itemType}`,
      type: itemType,
      data: duplicate(element.dataset),
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data.itemType;

    // Finally, create the item!
    return Item.create(itemData, {parent: this.actor});
  }

  _attachItemEditEvents(html){
    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click((ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });
  }

  _attachItemDeletionEvents(html){
    // Delete Inventory Item
    html.find('.item-delete').click((ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });
  }

  _prepareSpellSlots(ctx){
    this._calculateSpellSlots(ctx.actor.data.data.spellSlots);
  }

  _toggleDisabledSlots(event){
    // Grab the Input next to the button
    const input = event.currentTarget.previousElementSibling;
    // Grab the spell slot level from the data-attributes
    const spellLevel = input.dataset.level;
    // Check if we are about to remove the disabled flag
    const increasingSlots = (input.disabled === true);
    // Remove check if checked
    if (input.checked) input.checked = false;
    // Invert the disabled flag
    input.disabled = !input.disabled;
    // Increase or decrease the available slots
    const { available } = this.actor.data.data.spellSlots[spellLevel];
    // Save the data
    this.actor.update({ data: { spellSlots: { [spellLevel]: { available: increasingSlots ? available + 1 : available - 1 } } } });
  }

  _spellSlotCheckEvent(event) {
    const checked = event.currentTarget.checked;
    const spellLevel = event.currentTarget.dataset.level;
    const index = Number(event.currentTarget.dataset.index) + 1;
    const { spellSlots } = this.actor.data.data;

    if (checked){
      spellSlots[spellLevel].checked.push(index);
    } else {
      spellSlots[spellLevel].checked = spellSlots[spellLevel].checked.filter(i => i !== index);
    }

    this._calculateSpellSlots(spellSlots);
    this.actor.update({ data: { spellSlots: { [spellLevel]: { checked: spellSlots[spellLevel].checked } } } });
  }

  _calculateSpellSlots(spellSlots){
    for (const key of Object.keys(spellSlots)){
      const { checked, available, max } = spellSlots[key];

      spellSlots[key].slots = Array.from({length: max}, (_, i) => i + 1).map((i) => {
        if (checked.includes(i)) return 'checked';
        if (i > available) return 'disabled';
        return 'unchecked';
      });
    }
  }
}
