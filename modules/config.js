export const WonderSystemConf = {
  local: {
    attr: {
      str: 'WonderSystem.attributes.strAbbr',
      int: 'WonderSystem.attributes.intAbbr',
      dex: 'WonderSystem.attributes.dexAbbr',
      con: 'WonderSystem.attributes.conAbbr',
      cha: 'WonderSystem.attributes.chaAbbr',
      pow: 'WonderSystem.attributes.powAbbr',
      luck: 'WonderSystem.attributes.luckAbbr',
      iLuck: 'WonderSystem.attributes.iLuckAbbr',
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
    ]
  }
};
