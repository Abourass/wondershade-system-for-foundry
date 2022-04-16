function dynamicSort(property) {
  let sortOrder = 1;
  if (property[0] === '-'){
    sortOrder = -1;
    property = property.substr(1);
  }
  return function(a, b) {
    // eslint-disable-next-line no-nested-ternary
    const result = (a[property] < b[property])
      ? -1
      : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  };
}

export const WonderSystemConf = {
  local: {
    attr: {
      str: 'WonderSystem.attributes.STR',
      int: 'WonderSystem.attributes.INT',
      dex: 'WonderSystem.attributes.DEX',
      con: 'WonderSystem.attributes.CON',
      cha: 'WonderSystem.attributes.CHA',
      pow: 'WonderSystem.attributes.POW',
      luck: 'WonderSystem.attributes.LUCK',
      iLuck: 'WonderSystem.attributes.ILUCK',
    },
    consumableTypes: {
      ammo: 'WonderSystem.ConsumableAmmunition',
      potion: 'WonderSystem.ConsumablePotion',
      poison: 'WonderSystem.ConsumablePoison',
      food: 'WonderSystem.ConsumableFood',
      scroll: 'WonderSystem.ConsumableScroll',
      wand: 'WonderSystem.ConsumableWand',
      rod: 'WonderSystem.ConsumableRod',
      trinket: 'WonderSystem.ConsumableTrinket',
    },
    itemRarity: {
      common: 'WonderSystem.ItemRarityCommon',
      uncommon: 'WonderSystem.ItemRarityUncommon',
      rare: 'WonderSystem.ItemRarityRare',
      veryRare: 'WonderSystem.ItemRarityVeryRare',
      legendary: 'WonderSystem.ItemRarityLegendary',
      artifact: 'WonderSystem.ItemRarityArtifact',
    },
    spellPreparationModes: {
      prepared: 'WonderSystem.SpellPrepPrepared',
      pact: 'WonderSystem.PactMagic',
      always: 'WonderSystem.SpellPrepAlways',
      atwill: 'WonderSystem.SpellPrepAtWill',
      innate: 'WonderSystem.SpellPrepInnate',
    },
  },

  html: {
    willpower: [
      { value: -30, text: 'Overloaded (-30%)' },
      { value: -20, text: 'Pumped (-20%)' },
      { value: -10, text: 'Hyper (-10%)' },
      { value: 0, text: 'Normal (0%)' },
      { value: 10, text: 'Tired (+10%)' },
      { value: 20, text: 'Rundown (+20%)' },
      { value: 30, text: 'Exhausted (+30%)' },
    ],
    difficulty: [
      {value: -40, text: '40% Easier'},
      {value: -30, text: '30% Easier'},
      {value: -25, text: '25% Easier'},
      {value: -20, text: '20% Easier'},
      {value: -15, text: '15% Easier'},
      {value: -10, text: '10% Easier'},
      {value: -5, text: '5% Easier'},
      {value: 0, text: 'Roll Difficulty'},
      {value: 5, text: '5% Harder'},
      {value: 10, text: '10% Harder'},
      {value: 15, text: '15% Harder'},
      {value: 20, text: '20% Harder'},
      {value: 25, text: '25% Harder'},
      {value: 30, text: '30% Harder'},
      {value: 40, text: '40% Harder'},
    ],
    skills: {
      left: [
        { name: 'Alertness', keyVal: 'alertness' },
        { name: 'Animal Handling', keyVal: 'animalHandling' },
        { name: 'Athletics', keyVal: 'athletics' },
        { name: 'Barter', keyVal: 'barter' },
        { name: 'Craft', keyVal: 'craft' },
        { name: 'Deception', keyVal: 'deception' },
        { name: 'Disguise', keyVal: 'disguise' },
        { name: 'Dodge', keyVal: 'dodge' },
      ].sort(dynamicSort('name')),
      middle: [
        { name: 'Drive / Pilot', keyVal: 'drivePilot' },
        { name: 'History', keyVal: 'history' },
        { name: 'Intimidation', keyVal: 'intimidation' },
        { name: 'Medicine', keyVal: 'medicine' },
        { name: 'Nature', keyVal: 'nature' },
        { name: 'Navigate', keyVal: 'navigate' },
        { name: 'Occult', keyVal: 'occult' },
        { name: 'Performance', keyVal: 'performance' },
      ].sort(dynamicSort('name')),
      right: [
        { name: 'Persuade', keyVal: 'persuade' },
        { name: 'Machinery', keyVal: 'machinery' },
        { name: 'Science', keyVal: 'science' },
        { name: 'Search', keyVal: 'search' },
        { name: 'Sleight of Hand', keyVal: 'sleightOfHand' },
        { name: 'Stealth', keyVal: 'stealth' },
        { name: 'Survival', keyVal: 'survival' },
        { name: 'Vibe Check', keyVal: 'vibeCheck' },
      ].sort(dynamicSort('name')),
    },
    spellSections: [
      { name: 'Wonder', keyVal: 'wonder', spellSlot: '' },
      { name: 'Finesse & Class', keyVal: 'finesse-and-class', spellSlot: '' },
      { name: 'Cantrips', keyVal: 'cantrips', spellSlot: '' },
      { name: '1st Level', keyVal: 'first', spellSlot: 'spell1' },
      { name: '2nd Level', keyVal: 'second', spellSlot: 'spell2' },
      { name: '3rd Level', keyVal: 'third', spellSlot: 'spell3' },
      { name: '4th Level', keyVal: 'fourth', spellSlot: 'spell4' },
      { name: '5th Level', keyVal: 'fifth', spellSlot: 'spell5' },
      { name: '6th Level', keyVal: 'sixth', spellSlot: 'spell6' },
      { name: '7th Level', keyVal: 'seventh', spellSlot: 'spell7' },
      { name: '8th Level', keyVal: 'eighth', spellSlot: 'spell8' },
      { name: '9th Level', keyVal: 'ninth', spellSlot: 'spell9' },
      { name: 'All', keyVal: 'all' },
    ],
    spellLevelsWithoutSlots: ['wonder', 'finesse-and-class', 'cantrips'],
  },
};
