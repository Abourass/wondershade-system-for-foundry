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
      {value: 0, text: 'No Bonus / Penalty'},
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
        { name: 'Art', keyVal: 'art' },
        { name: 'Barter', keyVal: 'barter' },
        { name: 'Craft', keyVal: 'craft' },
        { name: 'Deception', keyVal: 'deception' },
        { name: 'Disguise', keyVal: 'disguise' },
        { name: 'Dodge', keyVal: 'dodge' },
      ].sort(dynamicSort('name')),
      middle: [
        { name: 'Drive / Pilot', value: 20, ruffle: 1 },
        { name: 'History', value: 10 },
        { name: 'Intimidation', value: 5 },
        { name: 'Medicine', value: 1 },
        { name: 'Nature', value: 5 },
        { name: 'Navigate', value: 15 },
        { name: 'Occult', value: 0, ruffle: 1 },
        { name: 'Performance', value: 5},
        { name: 'Persuade', value: 10},
      ].sort(dynamicSort('name')),
      right: [
        { name: 'Machinery', value: 5 },
        { name: 'Science', value: 10, ruffle: 1 },
        { name: 'Search', value: 10 },
        { name: 'Speed', value: 0 },
        { name: 'Sleight of Hand', value: 5},
        { name: 'Stealth', value: 10, ruffle: 1},
        { name: 'Survival', value: 10},
        { name: 'Unsanity', value: 0},
        { name: 'Vibe Check', value: 15},
      ].sort(dynamicSort('name')),
    },
  },
};
