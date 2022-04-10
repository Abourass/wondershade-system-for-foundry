import { createGalaxy } from '../theme/cloudThemes.js';

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
    console.debug('[WonderSystem:CTX]', ctx);

    // Prepare the spell slots early so they are copied in the next step
    this._prepareSpellSlots(ctx);

    // Create a safe clone of the actor data
    const actorData = this.actor.data.toObject(false);

    // Attach the localization to the ctx
    ctx.config = CONFIG.wondershade;

    // Let's alias actor.data.data since it's tedious to access
    ctx.actorData = actorData.data;

    // ctx.actorData.spellSlots = Object.keys(actorData.data.spells).map(key => {
    //   if (key !== 'pact'){
    //     return ({
    //       level: key,
    //       checked: actorData.data.spells[key],
    //     })
    //   }
    //   return;
    // })

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
          case 'cantrip': spells.cantrips.push(item); break;
          case 'wonder': spells.wonderSpells.push(item); break;
          case 1: spells.firstLevel.push(item); break;
          case 2: spells.secondLevel.push(item); break;
          case 3: spells.thirdLevel.push(item); break;
          case 4: spells.fourthLevel.push(item); break;
          case 5: spells.fifthLevel.push(item); break;
          case 6: spells.sixthLevel.push(item); break;
          case 7: spells.seventhLevel.push(item); break;
          case 8: spells.eighthLevel.push(item); break;
          case 9: spells.ninthLevel.push(item); break;
        }
      }
      if (item.type === 'backpack') backpack.push(item);
    }

    // Assign the user specific data to the context
    ctx.weapons = weapons;
    ctx.equipment = equipment;
    ctx.consumables = consumables;
    ctx.tools = tools;
    ctx.loot = loot;
    ctx.classFeatures = classFeatures;
    ctx.feats = feats;
    ctx.spells = spells;
    ctx.backpack = backpack;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Inject the Galaxy Theme high up enough into the DOM it's not affected by the sheet refresh
    createGalaxy();

    // Owner-only Listeners
    if (this.actor.owner) {
      html.find('.stat-roll').click(this._onStatRoll.bind(this));
    }

    // Attach Edit Event to Items
    this._itemEditEvent(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Attach the delete event to items
    this._itemDeleteEvent(html);

    // Attach the spell slot change event
    html.find('.spellSlotCheck').change(this._spellSlotCheckEvent.bind(this));
  }

  _onStatRoll(event) {
    const itemID = event.currentTarget.closest('.item').dataset.itemId;
    const item = this.actor.getOwnedItem(itemID);

    // Roll the stat
    item.roll();
  }

  _prepareSpellSlots(ctx){
    for (const key of Object.keys(ctx.actor.data.data.spells)){
      if (key !== 'pact'){
        const { value, max } = ctx.actor.data.data.spells[key];
        ctx.actor.data.data.spells[key].slots = [];

        for (let i = 0; i < value; i++){ ctx.actor.data.data.spells[key].slots.push(true); }
        for (let i = value; i < max; i++){ ctx.actor.data.data.spells[key].slots.push(false); }
      }
    }
  }

  _itemEditEvent(html){
    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click((ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });
  }

  _itemDeleteEvent(html){
    // Delete Inventory Item
    html.find('.item-delete').click((ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });
  }

  _spellSlotCheckEvent(event) {
    const checked = event.currentTarget.checked;
    const spellLevel = event.currentTarget.dataset.id;
    const { spells } = this.object.data.data;

    if (checked){
      spells[spellLevel].value++;
    } else {
      spells[spellLevel].value--;
    }
  }
}
