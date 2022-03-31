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
    const ctx = super.getData();
    console.log('[WonderSystem:CTX]', ctx);

    // Create a safe clone of the actor data
    const actorData = this.actor.data.toObject(false);

    // Attach the localization to the ctx
    ctx.config = CONFIG.wondershade;
    // Let's alias actor.data.data since it's tedious to access
    ctx.actorData = actorData.data;

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
