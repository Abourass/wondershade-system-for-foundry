import { ClassFeatures } from './classFeatures.js';

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
      { value: -30, text: 'Overloaded' },
      { value: -20, text: 'Pumped' },
      { value: -10, text: 'Hyper' },
      { value: 0, text: 'Normal' },
      { value: 10, text: 'Tired' },
      { value: 20, text: 'Rundown' },
      { value: 30, text: 'Exhausted' },
    ],
    difficulty: [
      {value: 40, text: '40% Easier'},
      {value: 30, text: '30% Easier'},
      {value: 25, text: '25% Easier'},
      {value: 20, text: '20% Easier'},
      {value: 15, text: '15% Easier'},
      {value: 10, text: '10% Easier'},
      {value: 5, text: '5% Easier'},
      {value: 0, text: 'Roll Difficulty'},
      {value: -5, text: '5% Harder'},
      {value: -10, text: '10% Harder'},
      {value: -15, text: '15% Harder'},
      {value: -20, text: '20% Harder'},
      {value: -25, text: '25% Harder'},
      {value: -30, text: '30% Harder'},
      {value: -40, text: '40% Harder'},
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

// ? We don't use these we call them attributes. Keeping this to find references easier.
// /**
//  * The set of Ability Scores used within the system.
//  * @enum {string}
//  */
WonderSystemConf.local.abilities = {
  str: 'WonderSystem.AbilityStr',
  dex: 'WonderSystem.AbilityDex',
  con: 'WonderSystem.AbilityCon',
  int: 'WonderSystem.AbilityInt',
  wis: 'WonderSystem.AbilityPow',
  cha: 'WonderSystem.AbilityCha',
};

// /**
//  * Localized abbreviations for Ability Scores.
//  * @enum {string}
//  */
// WonderSystemConf.local.abilityAbbreviations = {
//   str: 'WonderSystem.AbilityStrAbbr',
//   dex: 'WonderSystem.AbilityDexAbbr',
//   con: 'WonderSystem.AbilityConAbbr',
//   int: 'WonderSystem.AbilityIntAbbr',
//   wis: 'WonderSystem.AbilityWisAbbr',
//   cha: 'WonderSystem.AbilityChaAbbr',
// };

/* -------------------------------------------- */

/**
 * Character alignment options.
 * @enum {string}
 */
WonderSystemConf.local.alignments = {
  lg: 'WonderSystem.AlignmentLG',
  ng: 'WonderSystem.AlignmentNG',
  cg: 'WonderSystem.AlignmentCG',
  ln: 'WonderSystem.AlignmentLN',
  tn: 'WonderSystem.AlignmentTN',
  cn: 'WonderSystem.AlignmentCN',
  le: 'WonderSystem.AlignmentLE',
  ne: 'WonderSystem.AlignmentNE',
  ce: 'WonderSystem.AlignmentCE',
};

/* -------------------------------------------- */

/**
 * An enumeration of item attunement types.
 * @enum {number}
 */
WonderSystemConf.local.attunementTypes = {
  NONE: 0,
  REQUIRED: 1,
  ATTUNED: 2,
};

/**
 * An enumeration of item attunement states.
 * @type {{"0": string, "1": string, "2": string}}
 */
WonderSystemConf.local.attunements = {
  0: 'WonderSystem.AttunementNone',
  1: 'WonderSystem.AttunementRequired',
  2: 'WonderSystem.AttunementAttuned',
};

/* -------------------------------------------- */

/**
 * General weapon categories.
 * @enum {string}
 */
WonderSystemConf.local.weaponProficiencies = {
  sim: 'WonderSystem.WeaponSimpleProficiency',
  mar: 'WonderSystem.WeaponMartialProficiency',
};

/**
 * A mapping between `WonderSystem.weaponTypes` and `WonderSystem.weaponProficiencies` that
 * is used to determine if character has proficiency when adding an item.
 * @enum {(boolean|string)}
 */
WonderSystemConf.local.weaponProficienciesMap = {
  natural: true,
  simpleM: 'sim',
  simpleR: 'sim',
  martialM: 'mar',
  martialR: 'mar',
};

/**
 * The basic weapon types in 5e. This enables specific weapon proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
WonderSystemConf.local.weaponIds = {
  battleaxe: 'I0WocDSuNpGJayPb',
  blowgun: 'wNWK6yJMHG9ANqQV',
  club: 'nfIRTECQIG81CvM4',
  dagger: '0E565kQUBmndJ1a2',
  dart: '3rCO8MTIdPGSW6IJ',
  flail: 'UrH3sMdnUDckIHJ6',
  glaive: 'rOG1OM2ihgPjOvFW',
  greataxe: '1Lxk6kmoRhG8qQ0u',
  greatclub: 'QRCsxkCwWNwswL9o',
  greatsword: 'xMkP8BmFzElcsMaR',
  halberd: 'DMejWAc8r8YvDPP1',
  handaxe: 'eO7Fbv5WBk5zvGOc',
  handcrossbow: 'qaSro7kFhxD6INbZ',
  heavycrossbow: 'RmP0mYRn2J7K26rX',
  javelin: 'DWLMnODrnHn8IbAG',
  lance: 'RnuxdHUAIgxccVwj',
  lightcrossbow: 'ddWvQRLmnnIS0eLF',
  lighthammer: 'XVK6TOL4sGItssAE',
  longbow: '3cymOVja8jXbzrdT',
  longsword: '10ZP2Bu3vnCuYMIB',
  mace: 'Ajyq6nGwF7FtLhDQ',
  maul: 'DizirD7eqjh8n95A',
  morningstar: 'dX8AxCh9o0A9CkT3',
  net: 'aEiM49V8vWpWw7rU',
  pike: 'tC0kcqZT9HHAO0PD',
  quarterstaff: 'g2dWN7PQiMRYWzyk',
  rapier: 'Tobce1hexTnDk4sV',
  scimitar: 'fbC0Mg1a73wdFbqO',
  shortsword: 'osLzOwQdPtrK3rQH',
  sickle: 'i4NeNZ30ycwPDHMx',
  spear: 'OG4nBBydvmfWYXIk',
  shortbow: 'GJv6WkD7D2J6rP6M',
  sling: '3gynWO9sN4OLGMWD',
  trident: 'F65ANO66ckP8FDMa',
  warpick: '2YdfjN1PIIrSHZii',
  warhammer: 'F0Df164Xv1gWcYt0',
  whip: 'QKTyxoO0YDnAsbYe',
};

/* -------------------------------------------- */

/**
 * The categories into which Tool items can be grouped.
 *
 * @enum {string}
 */
WonderSystemConf.local.toolTypes = {
  art: 'WonderSystem.ToolArtisans',
  game: 'WonderSystem.ToolGamingSet',
  music: 'WonderSystem.ToolMusicalInstrument',
};

/**
 * The categories of tool proficiencies that a character can gain.
 *
 * @enum {string}
 */
WonderSystemConf.local.toolProficiencies = {
  ...WonderSystemConf.local.toolTypes,
  vehicle: 'WonderSystem.ToolVehicle',
};

/**
 * The basic tool types in 5e. This enables specific tool proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
WonderSystemConf.local.toolIds = {
  alchemist: 'SztwZhbhZeCqyAes',
  bagpipes: 'yxHi57T5mmVt0oDr',
  brewer: 'Y9S75go1hLMXUD48',
  calligrapher: 'jhjo20QoiD5exf09',
  card: 'YwlHI3BVJapz4a3E',
  carpenter: '8NS6MSOdXtUqD7Ib',
  cartographer: 'fC0lFK8P4RuhpfaU',
  chess: '23y8FvWKf9YLcnBL',
  cobbler: 'hM84pZnpCqKfi8XH',
  cook: 'Gflnp29aEv5Lc1ZM',
  dice: 'iBuTM09KD9IoM5L8',
  disg: 'IBhDAr7WkhWPYLVn',
  drum: '69Dpr25pf4BjkHKb',
  dulcimer: 'NtdDkjmpdIMiX7I2',
  flute: 'eJOrPcAz9EcquyRQ',
  forg: 'cG3m4YlHfbQlLEOx',
  glassblower: 'rTbVrNcwApnuTz5E',
  herb: 'i89okN7GFTWHsvPy',
  horn: 'aa9KuBy4dst7WIW9',
  jeweler: 'YfBwELTgPFHmQdHh',
  leatherworker: 'PUMfwyVUbtyxgYbD',
  lute: 'qBydtUUIkv520DT7',
  lyre: 'EwG1EtmbgR3bM68U',
  mason: 'skUih6tBvcBbORzA',
  navg: 'YHCmjsiXxZ9UdUhU',
  painter: 'ccm5xlWhx74d6lsK',
  panflute: 'G5m5gYIx9VAUWC3J',
  pois: 'il2GNi8C0DvGLL9P',
  potter: 'hJS8yEVkqgJjwfWa',
  shawm: 'G3cqbejJpfB91VhP',
  smith: 'KndVe2insuctjIaj',
  thief: 'woWZ1sO5IUVGzo58',
  tinker: '0d08g1i5WXnNrCNA',
  viol: 'baoe3U5BfMMMxhCU',
  weaver: 'ap9prThUB2y9lDyj',
  woodcarver: 'xKErqkLo4ASYr5EP',
};

/* -------------------------------------------- */

/**
 * The various lengths of time over which effects can occur.
 * @enum {string}
 */
WonderSystemConf.local.timePeriods = {
  inst: 'WonderSystem.TimeInst',
  turn: 'WonderSystem.TimeTurn',
  round: 'WonderSystem.TimeRound',
  minute: 'WonderSystem.TimeMinute',
  hour: 'WonderSystem.TimeHour',
  day: 'WonderSystem.TimeDay',
  month: 'WonderSystem.TimeMonth',
  year: 'WonderSystem.TimeYear',
  perm: 'WonderSystem.TimePerm',
  spec: 'WonderSystem.Special',
};

/* -------------------------------------------- */

/**
 * Various ways in which an item or ability can be activated.
 * @enum {string}
 */
WonderSystemConf.local.abilityActivationTypes = {
  none: 'WonderSystem.None',
  action: 'WonderSystem.Action',
  bonus: 'WonderSystem.BonusAction',
  reaction: 'WonderSystem.Reaction',
  minute: WonderSystemConf.local.timePeriods.minute,
  hour: WonderSystemConf.local.timePeriods.hour,
  day: WonderSystemConf.local.timePeriods.day,
  special: WonderSystemConf.local.timePeriods.spec,
  legendary: 'WonderSystem.LegendaryActionLabel',
  lair: 'WonderSystem.LairActionLabel',
  crew: 'WonderSystem.VehicleCrewAction',
};

/* -------------------------------------------- */

/**
 * Different things that an ability can consume upon use.
 * @enum {string}
 */
WonderSystemConf.local.abilityConsumptionTypes = {
  ammo: 'WonderSystem.ConsumeAmmunition',
  attribute: 'WonderSystem.ConsumeAttribute',
  material: 'WonderSystem.ConsumeMaterial',
  charges: 'WonderSystem.ConsumeCharges',
};

/* -------------------------------------------- */

/**
 * Creature sizes.
 * @enum {string}
 */
WonderSystemConf.local.actorSizes = {
  tiny: 'WonderSystem.SizeTiny',
  sm: 'WonderSystem.SizeSmall',
  med: 'WonderSystem.SizeMedium',
  lg: 'WonderSystem.SizeLarge',
  huge: 'WonderSystem.SizeHuge',
  grg: 'WonderSystem.SizeGargantuan',
};

/**
 * Default token image size for the values of `WonderSystem.actorSizes`.
 * @enum {number}
 */
WonderSystemConf.local.tokenSizes = {
  tiny: 0.5,
  sm: 1,
  med: 1,
  lg: 2,
  huge: 3,
  grg: 4,
};

/**
 * Colors used to visualize temporary and temporary maximum HP in token health bars.
 * @enum {number}
 */
WonderSystemConf.local.tokenHPColors = {
  damage: 0xFF0000,
  healing: 0x00FF00,
  temp: 0x66CCFF,
  tempmax: 0x440066,
  negmax: 0x550000,
};

/* -------------------------------------------- */

/**
 * Default types of creatures.
 * @enum {string}
 */
WonderSystemConf.local.creatureTypes = {
  aberration: 'WonderSystem.CreatureAberration',
  beast: 'WonderSystem.CreatureBeast',
  celestial: 'WonderSystem.CreatureCelestial',
  construct: 'WonderSystem.CreatureConstruct',
  dragon: 'WonderSystem.CreatureDragon',
  elemental: 'WonderSystem.CreatureElemental',
  fey: 'WonderSystem.CreatureFey',
  fiend: 'WonderSystem.CreatureFiend',
  giant: 'WonderSystem.CreatureGiant',
  humanoid: 'WonderSystem.CreatureHumanoid',
  monstrosity: 'WonderSystem.CreatureMonstrosity',
  ooze: 'WonderSystem.CreatureOoze',
  plant: 'WonderSystem.CreaturePlant',
  undead: 'WonderSystem.CreatureUndead',
};

/* -------------------------------------------- */

/**
 * Classification types for item action types.
 * @enum {string}
 */
WonderSystemConf.local.itemActionTypes = {
  mwak: 'WonderSystem.ActionMWAK',
  rwak: 'WonderSystem.ActionRWAK',
  msak: 'WonderSystem.ActionMSAK',
  rsak: 'WonderSystem.ActionRSAK',
  save: 'WonderSystem.ActionSave',
  heal: 'WonderSystem.ActionHeal',
  abil: 'WonderSystem.ActionAbil',
  util: 'WonderSystem.ActionUtil',
  other: 'WonderSystem.ActionOther',
};

/* -------------------------------------------- */

/**
 * Different ways in which item capacity can be limited.
 * @enum {string}
 */
WonderSystemConf.local.itemCapacityTypes = {
  items: 'WonderSystem.ItemContainerCapacityItems',
  weight: 'WonderSystem.ItemContainerCapacityWeight',
};

/* -------------------------------------------- */

/**
 * List of various item rarities.
 * @enum {string}
 */
WonderSystemConf.local.itemRarity = {
  common: 'WonderSystem.ItemRarityCommon',
  uncommon: 'WonderSystem.ItemRarityUncommon',
  rare: 'WonderSystem.ItemRarityRare',
  veryRare: 'WonderSystem.ItemRarityVeryRare',
  legendary: 'WonderSystem.ItemRarityLegendary',
  artifact: 'WonderSystem.ItemRarityArtifact',
};

/* -------------------------------------------- */

/**
 * Enumerate the lengths of time over which an item can have limited use ability.
 * @enum {string}
 */
WonderSystemConf.local.limitedUsePeriods = {
  sr: 'WonderSystem.ShortRest',
  lr: 'WonderSystem.LongRest',
  day: 'WonderSystem.Day',
  charges: 'WonderSystem.Charges',
};

/* -------------------------------------------- */

/**
 * Specific equipment types that modify base AC.
 * @enum {string}
 */
WonderSystemConf.local.armorTypes = {
  light: 'WonderSystem.EquipmentLight',
  medium: 'WonderSystem.EquipmentMedium',
  heavy: 'WonderSystem.EquipmentHeavy',
  natural: 'WonderSystem.EquipmentNatural',
  shield: 'WonderSystem.EquipmentShield',
};

/* -------------------------------------------- */

/**
 * Equipment types that aren't armor.
 * @enum {string}
 */
WonderSystemConf.local.miscEquipmentTypes = {
  clothing: 'WonderSystem.EquipmentClothing',
  trinket: 'WonderSystem.EquipmentTrinket',
  vehicle: 'WonderSystem.EquipmentVehicle',
};

/* -------------------------------------------- */

/**
 * The set of equipment types for armor, clothing, and other objects which can be worn by the character.
 * @enum {string}
 */
WonderSystemConf.local.equipmentTypes = {
  ...WonderSystemConf.local.miscEquipmentTypes,
  ...WonderSystemConf.local.armorTypes,
};

/* -------------------------------------------- */

/**
 * The various types of vehicles in which characters can be proficient.
 * @enum {string}
 */
WonderSystemConf.local.vehicleTypes = {
  air: 'WonderSystem.VehicleTypeAir',
  land: 'WonderSystem.VehicleTypeLand',
  water: 'WonderSystem.VehicleTypeWater',
};

/* -------------------------------------------- */

/**
 * The set of Armor Proficiencies which a character may have.
 * @type {object}
 */
WonderSystemConf.local.armorProficiencies = {
  lgt: WonderSystemConf.local.equipmentTypes.light,
  med: WonderSystemConf.local.equipmentTypes.medium,
  hvy: WonderSystemConf.local.equipmentTypes.heavy,
  shl: 'WonderSystem.EquipmentShieldProficiency',
};

/**
 * A mapping between `WonderSystem.equipmentTypes` and `WonderSystem.armorProficiencies` that
 * is used to determine if character has proficiency when adding an item.
 * @enum {(boolean|string)}
 */
WonderSystemConf.local.armorProficienciesMap = {
  natural: true,
  clothing: true,
  light: 'lgt',
  medium: 'med',
  heavy: 'hvy',
  shield: 'shl',
};

/**
 * The basic armor types in 5e. This enables specific armor proficiencies,
 * automated AC calculation in NPCs, and starting equipment.
 * @enum {string}
 */
WonderSystemConf.local.armorIds = {
  breastplate: 'SK2HATQ4abKUlV8i',
  chainmail: 'rLMflzmxpe8JGTOA',
  chainshirt: 'p2zChy24ZJdVqMSH',
  halfplate: 'vsgmACFYINloIdPm',
  hide: 'n1V07puo0RQxPGuF',
  leather: 'WwdpHLXGX5r8uZu5',
  padded: 'GtKV1b5uqFQqpEni',
  plate: 'OjkIqlW2UpgFcjZa',
  ringmail: 'nsXZejlmgalj4he9',
  scalemail: 'XmnlF5fgIO3tg6TG',
  splint: 'cKpJmsJmU8YaiuqG',
  studded: 'TIV3B1vbrVHIhQAm',
};

/**
 * The basic shield in 5e.
 * @enum {string}
 */
WonderSystemConf.local.shieldIds = {
  shield: 'sSs3hSzkKBMNBgTs',
};

/**
 * Common armor class calculations.
 * @enum {{ label: string, [formula]: string }}
 */
WonderSystemConf.local.armorClasses = {
  flat: {
    label: 'WonderSystem.ArmorClassFlat',
    formula: '@attributes.ac.flat',
  },
  natural: {
    label: 'WonderSystem.ArmorClassNatural',
    formula: '@attributes.ac.flat',
  },
  default: {
    label: 'WonderSystem.ArmorClassEquipment',
    formula: '@attributes.ac.base + @abilities.dex.mod',
  },
  mage: {
    label: 'WonderSystem.ArmorClassMage',
    formula: '13 + @abilities.dex.mod',
  },
  draconic: {
    label: 'WonderSystem.ArmorClassDraconic',
    formula: '13 + @abilities.dex.mod',
  },
  unarmoredMonk: {
    label: 'WonderSystem.ArmorClassUnarmoredMonk',
    formula: '10 + @abilities.dex.mod + @abilities.wis.mod',
  },
  unarmoredBarb: {
    label: 'WonderSystem.ArmorClassUnarmoredBarbarian',
    formula: '10 + @abilities.dex.mod + @abilities.con.mod',
  },
  custom: {
    label: 'WonderSystem.ArmorClassCustom',
  },
};

/* -------------------------------------------- */

/**
 * Enumerate the valid consumable types which are recognized by the system.
 * @enum {string}
 */
WonderSystemConf.local.consumableTypes = {
  ammo: 'WonderSystem.ConsumableAmmunition',
  potion: 'WonderSystem.ConsumablePotion',
  poison: 'WonderSystem.ConsumablePoison',
  food: 'WonderSystem.ConsumableFood',
  scroll: 'WonderSystem.ConsumableScroll',
  wand: 'WonderSystem.ConsumableWand',
  rod: 'WonderSystem.ConsumableRod',
  trinket: 'WonderSystem.ConsumableTrinket',
};

/* -------------------------------------------- */

/**
 * The valid currency denominations with localized labels, abbreviations, and conversions.
 * @enum {{
 *   label: string,
 *   abbreviation: string,
 *   [conversion]: {into: string, each: number}
 * }}
 */
WonderSystemConf.local.currencies = {
  pp: {
    label: 'WonderSystem.CurrencyPP',
    abbreviation: 'WonderSystem.CurrencyAbbrPP',
  },
  gp: {
    label: 'WonderSystem.CurrencyGP',
    abbreviation: 'WonderSystem.CurrencyAbbrGP',
    conversion: {into: 'pp', each: 10},
  },
  ep: {
    label: 'WonderSystem.CurrencyEP',
    abbreviation: 'WonderSystem.CurrencyAbbrEP',
    conversion: {into: 'gp', each: 2},
  },
  sp: {
    label: 'WonderSystem.CurrencySP',
    abbreviation: 'WonderSystem.CurrencyAbbrSP',
    conversion: {into: 'ep', each: 5},
  },
  cp: {
    label: 'WonderSystem.CurrencyCP',
    abbreviation: 'WonderSystem.CurrencyAbbrCP',
    conversion: {into: 'sp', each: 10},
  },
};

/* -------------------------------------------- */

/**
 * Types of damage the can be caused by abilities.
 * @enum {string}
 */
WonderSystemConf.local.damageTypes = {
  acid: 'WonderSystem.DamageAcid',
  bludgeoning: 'WonderSystem.DamageBludgeoning',
  cold: 'WonderSystem.DamageCold',
  fire: 'WonderSystem.DamageFire',
  force: 'WonderSystem.DamageForce',
  lightning: 'WonderSystem.DamageLightning',
  necrotic: 'WonderSystem.DamageNecrotic',
  piercing: 'WonderSystem.DamagePiercing',
  poison: 'WonderSystem.DamagePoison',
  psychic: 'WonderSystem.DamagePsychic',
  radiant: 'WonderSystem.DamageRadiant',
  slashing: 'WonderSystem.DamageSlashing',
  thunder: 'WonderSystem.DamageThunder',
};

/**
 * Types of damage to which an actor can possess resistance, immunity, or vulnerability.
 * @enum {string}
 */
WonderSystemConf.local.damageResistanceTypes = {
  ...WonderSystemConf.local.damageTypes,
  physical: 'WonderSystem.DamagePhysical',
};

/* -------------------------------------------- */

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @enum {string}
 */
WonderSystemConf.local.movementTypes = {
  burrow: 'WonderSystem.MovementBurrow',
  climb: 'WonderSystem.MovementClimb',
  fly: 'WonderSystem.MovementFly',
  swim: 'WonderSystem.MovementSwim',
  walk: 'WonderSystem.MovementWalk',
};

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @enum {string}
 */
WonderSystemConf.local.movementUnits = {
  ft: 'WonderSystem.DistFt',
  mi: 'WonderSystem.DistMi',
  m: 'WonderSystem.DistM',
  km: 'WonderSystem.DistKm',
};

/**
 * The valid units of measure for the range of an action or effect.
 * This object automatically includes the movement units from `WonderSystem.movementUnits`.
 * @enum {string}
 */
WonderSystemConf.local.distanceUnits = {
  none: 'WonderSystem.None',
  self: 'WonderSystem.DistSelf',
  touch: 'WonderSystem.DistTouch',
  spec: 'WonderSystem.Special',
  any: 'WonderSystem.DistAny',
  ...WonderSystemConf.local.movementUnits,
};

/* -------------------------------------------- */

/**
 * Configure aspects of encumbrance calculation so that it could be configured by modules.
 * @enum {{ imperial: number, metric: number }}
 */
WonderSystemConf.local.encumbrance = {
  currencyPerWeight: {
    imperial: 50,
    metric: 110,
  },
  strMultiplier: {
    imperial: 15,
    metric: 6.8,
  },
  vehicleWeightMultiplier: {
    imperial: 2000, // 2000 lbs in an imperial ton
    metric: 1000, // 1000 kg in a metric ton
  },
};

/* -------------------------------------------- */

/**
 * The types of single or area targets which can be applied to abilities.
 * @enum {string}
 */
WonderSystemConf.local.targetTypes = {
  none: 'WonderSystem.None',
  self: 'WonderSystem.TargetSelf',
  creature: 'WonderSystem.TargetCreature',
  ally: 'WonderSystem.TargetAlly',
  enemy: 'WonderSystem.TargetEnemy',
  object: 'WonderSystem.TargetObject',
  space: 'WonderSystem.TargetSpace',
  radius: 'WonderSystem.TargetRadius',
  sphere: 'WonderSystem.TargetSphere',
  cylinder: 'WonderSystem.TargetCylinder',
  cone: 'WonderSystem.TargetCone',
  square: 'WonderSystem.TargetSquare',
  cube: 'WonderSystem.TargetCube',
  line: 'WonderSystem.TargetLine',
  wall: 'WonderSystem.TargetWall',
};

/* -------------------------------------------- */

/**
 * Mapping between `WonderSystem.targetTypes` and `MeasuredTemplate` shape types to define
 * which templates are produced by which area of effect target type.
 * @enum {string}
 */
WonderSystemConf.local.areaTargetTypes = {
  cone: 'cone',
  cube: 'rect',
  cylinder: 'circle',
  line: 'ray',
  radius: 'circle',
  sphere: 'circle',
  square: 'rect',
  wall: 'ray',
};

/* -------------------------------------------- */

/**
 * Different types of healing that can be applied using abilities.
 * @enum {string}
 */
WonderSystemConf.local.healingTypes = {
  healing: 'WonderSystem.Healing',
  temphp: 'WonderSystem.HealingTemp',
};

/* -------------------------------------------- */

/**
 * Denominations of hit dice which can apply to classes.
 * @type {string[]}
 */
WonderSystemConf.local.hitDieTypes = ['d6', 'd8', 'd10', 'd12', 'd20'];

/* -------------------------------------------- */

/**
 * The set of possible sensory perception types which an Actor may have.
 * @enum {string}
 */
WonderSystemConf.local.senses = {
  blindsight: 'WonderSystem.SenseBlindsight',
  darkvision: 'WonderSystem.SenseDarkvision',
  tremorsense: 'WonderSystem.SenseTremorsense',
  truesight: 'WonderSystem.SenseTruesight',
};

/* -------------------------------------------- */

/**
 * The set of skill which can be trained.
 * @enum {string}
 */
WonderSystemConf.local.skills = {
  acr: 'WonderSystem.SkillAcr',
  ani: 'WonderSystem.SkillAni',
  arc: 'WonderSystem.SkillArc',
  ath: 'WonderSystem.SkillAth',
  dec: 'WonderSystem.SkillDec',
  his: 'WonderSystem.SkillHis',
  ins: 'WonderSystem.SkillIns',
  itm: 'WonderSystem.SkillItm',
  inv: 'WonderSystem.SkillInv',
  med: 'WonderSystem.SkillMed',
  nat: 'WonderSystem.SkillNat',
  prc: 'WonderSystem.SkillPrc',
  prf: 'WonderSystem.SkillPrf',
  per: 'WonderSystem.SkillPer',
  rel: 'WonderSystem.SkillRel',
  slt: 'WonderSystem.SkillSlt',
  ste: 'WonderSystem.SkillSte',
  sur: 'WonderSystem.SkillSur',
};

/* -------------------------------------------- */

/**
 * Various different ways a spell can be prepared.
 */
WonderSystemConf.local.spellPreparationModes = {
  prepared: 'WonderSystem.SpellPrepPrepared',
  pact: 'WonderSystem.PactMagic',
  always: 'WonderSystem.SpellPrepAlways',
  atwill: 'WonderSystem.SpellPrepAtWill',
  innate: 'WonderSystem.SpellPrepInnate',
};

/**
 * Subset of `WonderSystem.spellPreparationModes` that consume spell slots.
 * @type {boolean[]}
 */
WonderSystemConf.local.spellUpcastModes = ['always', 'pact', 'prepared'];

/**
 * Ways in which a class can contribute to spellcasting levels.
 * @enum {string}
 */
WonderSystemConf.local.spellProgression = {
  none: 'WonderSystem.SpellNone',
  full: 'WonderSystem.SpellProgFull',
  half: 'WonderSystem.SpellProgHalf',
  third: 'WonderSystem.SpellProgThird',
  pact: 'WonderSystem.SpellProgPact',
  artificer: 'WonderSystem.SpellProgArt',
};

/* -------------------------------------------- */

/**
 * The available choices for how spell damage scaling may be computed.
 * @enum {string}
 */
WonderSystemConf.local.spellScalingModes = {
  none: 'WonderSystem.SpellNone',
  cantrip: 'WonderSystem.SpellCantrip',
  level: 'WonderSystem.SpellLevel',
};

/* -------------------------------------------- */

/**
 * The set of types which a weapon item can take.
 * @enum {string}
 */
WonderSystemConf.local.weaponTypes = {
  simpleM: 'WonderSystem.WeaponSimpleM',
  simpleR: 'WonderSystem.WeaponSimpleR',
  martialM: 'WonderSystem.WeaponMartialM',
  martialR: 'WonderSystem.WeaponMartialR',
  natural: 'WonderSystem.WeaponNatural',
  improv: 'WonderSystem.WeaponImprov',
  siege: 'WonderSystem.WeaponSiege',
};

/* -------------------------------------------- */

/**
 * The set of weapon property flags which can exist on a weapon.
 * @enum {string}
 */
WonderSystemConf.local.weaponProperties = {
  ada: 'WonderSystem.WeaponPropertiesAda',
  amm: 'WonderSystem.WeaponPropertiesAmm',
  fin: 'WonderSystem.WeaponPropertiesFin',
  fir: 'WonderSystem.WeaponPropertiesFir',
  foc: 'WonderSystem.WeaponPropertiesFoc',
  hvy: 'WonderSystem.WeaponPropertiesHvy',
  lgt: 'WonderSystem.WeaponPropertiesLgt',
  lod: 'WonderSystem.WeaponPropertiesLod',
  mgc: 'WonderSystem.WeaponPropertiesMgc',
  rch: 'WonderSystem.WeaponPropertiesRch',
  rel: 'WonderSystem.WeaponPropertiesRel',
  ret: 'WonderSystem.WeaponPropertiesRet',
  sil: 'WonderSystem.WeaponPropertiesSil',
  spc: 'WonderSystem.WeaponPropertiesSpc',
  thr: 'WonderSystem.WeaponPropertiesThr',
  two: 'WonderSystem.WeaponPropertiesTwo',
  ver: 'WonderSystem.WeaponPropertiesVer',
};

/**
 * Types of components that can be required when casting a spell.
 * @enum {string}
 */
WonderSystemConf.local.spellComponents = {
  V: 'WonderSystem.ComponentVerbal',
  S: 'WonderSystem.ComponentSomatic',
  M: 'WonderSystem.ComponentMaterial',
};

/**
 * Schools to which a spell can belong.
 * @enum {string}
 */
WonderSystemConf.local.spellSchools = {
  abj: 'WonderSystem.SchoolAbj',
  con: 'WonderSystem.SchoolCon',
  div: 'WonderSystem.SchoolDiv',
  enc: 'WonderSystem.SchoolEnc',
  evo: 'WonderSystem.SchoolEvo',
  ill: 'WonderSystem.SchoolIll',
  nec: 'WonderSystem.SchoolNec',
  trs: 'WonderSystem.SchoolTrs',
};

/**
 * Valid spell levels.
 * @enum {string}
 */
WonderSystemConf.local.spellLevels = {
  0: 'WonderSystem.SpellLevel0',
  1: 'WonderSystem.SpellLevel1',
  2: 'WonderSystem.SpellLevel2',
  3: 'WonderSystem.SpellLevel3',
  4: 'WonderSystem.SpellLevel4',
  5: 'WonderSystem.SpellLevel5',
  6: 'WonderSystem.SpellLevel6',
  7: 'WonderSystem.SpellLevel7',
  8: 'WonderSystem.SpellLevel8',
  9: 'WonderSystem.SpellLevel9',
  10: 'WonderSystem.SpellLevel10',
};

/**
 * Spell scroll item ID within the `WonderSystem.sourcePacks` compendium for each level.
 * @enum {string}
 */
WonderSystemConf.local.spellScrollIds = {
  0: 'rQ6sO7HDWzqMhSI3',
  1: '9GSfMg0VOA2b4uFN',
  2: 'XdDp6CKh9qEvPTuS',
  3: 'hqVKZie7x9w3Kqds',
  4: 'DM7hzgL836ZyUFB1',
  5: 'wa1VF8TXHmkrrR35',
  6: 'tI3rWx4bxefNCexS',
  7: 'mtyw4NS1s7j2EJaD',
  8: 'aOrinPg7yuDZEuWr',
  9: 'O4YbkJkLlnsgUszZ',
};

/**
 * Compendium packs used for localized items.
 * @enum {string}
 */
WonderSystemConf.local.sourcePacks = {
  ITEMS: 'wondershade.items',
};

/**
 * Define the standard slot progression by character level.
 * The entries of this array represent the spell slot progression for a full spell-caster.
 * @type {number[][]}
 */
WonderSystemConf.local.SPELL_SLOT_TABLE = [
  [2],
  [3],
  [4, 2],
  [4, 3],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

/* -------------------------------------------- */

/**
 * Settings to configure how actors are merged when polymorphing is applied.
 * @enum {string}
 */
WonderSystemConf.local.polymorphSettings = {
  keepPhysical: 'WonderSystem.PolymorphKeepPhysical',
  keepMental: 'WonderSystem.PolymorphKeepMental',
  keepSaves: 'WonderSystem.PolymorphKeepSaves',
  keepSkills: 'WonderSystem.PolymorphKeepSkills',
  mergeSaves: 'WonderSystem.PolymorphMergeSaves',
  mergeSkills: 'WonderSystem.PolymorphMergeSkills',
  keepClass: 'WonderSystem.PolymorphKeepClass',
  keepFeats: 'WonderSystem.PolymorphKeepFeats',
  keepSpells: 'WonderSystem.PolymorphKeepSpells',
  keepItems: 'WonderSystem.PolymorphKeepItems',
  keepBio: 'WonderSystem.PolymorphKeepBio',
  keepVision: 'WonderSystem.PolymorphKeepVision',
};

/* -------------------------------------------- */

/**
 * Skill, ability, and tool proficiency levels.
 * The key for each level represents its proficiency multiplier.
 * @enum {string}
 */
WonderSystemConf.local.proficiencyLevels = {
  0: 'WonderSystem.NotProficient',
  1: 'WonderSystem.Proficient',
  0.5: 'WonderSystem.HalfProficient',
  2: 'WonderSystem.Expertise',
};

/* -------------------------------------------- */

/**
 * The amount of cover provided by an object. In cases where multiple pieces
 * of cover are in play, we take the highest value.
 * @enum {string}
 */
WonderSystemConf.local.cover = {
  0: 'WonderSystem.None',
  0.5: 'WonderSystem.CoverHalf',
  0.75: 'WonderSystem.CoverThreeQuarters',
  1: 'WonderSystem.CoverTotal',
};

/* -------------------------------------------- */

/**
 * A selection of actor attributes that can be tracked on token resource bars.
 * @type {string[]}
 */
WonderSystemConf.local.trackableAttributes = [
  'attributes.ac.value', 'attributes.init.value', 'attributes.movement', 'attributes.senses', 'attributes.spelldc',
  'attributes.spellLevel', 'details.cr', 'details.spellLevel', 'details.xp.value', 'skills.*.passive',
  'abilities.*.value',
];

/* -------------------------------------------- */

/**
 * A selection of actor and item attributes that are valid targets for item resource consumption.
 * @type {string[]}
 */
WonderSystemConf.local.consumableResources = [
  'item.quantity', 'item.weight', 'item.duration.value', 'currency', 'details.xp.value', 'abilities.*.value',
  'attributes.senses', 'attributes.movement', 'attributes.ac.flat', 'item.armor.value', 'item.target', 'item.range',
  'item.save.dc',
];

/* -------------------------------------------- */

/**
 * Conditions that can effect an actor.
 * @enum {string}
 */
WonderSystemConf.local.conditionTypes = {
  blinded: 'WonderSystem.ConBlinded',
  charmed: 'WonderSystem.ConCharmed',
  deafened: 'WonderSystem.ConDeafened',
  diseased: 'WonderSystem.ConDiseased',
  exhaustion: 'WonderSystem.ConExhaustion',
  frightened: 'WonderSystem.ConFrightened',
  grappled: 'WonderSystem.ConGrappled',
  incapacitated: 'WonderSystem.ConIncapacitated',
  invisible: 'WonderSystem.ConInvisible',
  paralyzed: 'WonderSystem.ConParalyzed',
  petrified: 'WonderSystem.ConPetrified',
  poisoned: 'WonderSystem.ConPoisoned',
  prone: 'WonderSystem.ConProne',
  restrained: 'WonderSystem.ConRestrained',
  stunned: 'WonderSystem.ConStunned',
  unconscious: 'WonderSystem.ConUnconscious',
};

/**
 * Languages a character can learn.
 * @enum {string}
 */
WonderSystemConf.local.languages = {
  common: 'WonderSystem.LanguagesCommon',
  aarakocra: 'WonderSystem.LanguagesAarakocra',
  abyssal: 'WonderSystem.LanguagesAbyssal',
  aquan: 'WonderSystem.LanguagesAquan',
  auran: 'WonderSystem.LanguagesAuran',
  celestial: 'WonderSystem.LanguagesCelestial',
  deep: 'WonderSystem.LanguagesDeepSpeech',
  draconic: 'WonderSystem.LanguagesDraconic',
  druidic: 'WonderSystem.LanguagesDruidic',
  dwarvish: 'WonderSystem.LanguagesDwarvish',
  elvish: 'WonderSystem.LanguagesElvish',
  giant: 'WonderSystem.LanguagesGiant',
  gith: 'WonderSystem.LanguagesGith',
  gnomish: 'WonderSystem.LanguagesGnomish',
  goblin: 'WonderSystem.LanguagesGoblin',
  gnoll: 'WonderSystem.LanguagesGnoll',
  halfling: 'WonderSystem.LanguagesHalfling',
  ignan: 'WonderSystem.LanguagesIgnan',
  infernal: 'WonderSystem.LanguagesInfernal',
  orc: 'WonderSystem.LanguagesOrc',
  primordial: 'WonderSystem.LanguagesPrimordial',
  sylvan: 'WonderSystem.LanguagesSylvan',
  terran: 'WonderSystem.LanguagesTerran',
  cant: 'WonderSystem.LanguagesThievesCant',
  undercommon: 'WonderSystem.LanguagesUndercommon',
};

/**
 * XP required to achieve each character level.
 * @type {number[]}
 */
WonderSystemConf.local.CHARACTER_EXP_LEVELS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
  120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
];

/**
 * XP granted for each challenge rating.
 * @type {number[]}
 */
WonderSystemConf.local.CR_EXP_LEVELS = [
  10, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000,
  20000, 22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000,
];

/**
 * Character features automatically granted by classes & subclasses at certain levels.
 * @type {object}
 */
WonderSystemConf.local.classFeatures = ClassFeatures;

/**
 * Special character flags.
 * @enum {{
 *   name: string,
 *   hint: string,
 *   [abilities]: string[],
 *   [skills]: string[],
 *   section: string,
 *   type: any,
 *   placeholder: any
 * }}
 */
WonderSystemConf.local.characterFlags = {
  diamondSoul: {
    name: 'WonderSystem.FlagsDiamondSoul',
    hint: 'WonderSystem.FlagsDiamondSoulHint',
    section: 'WonderSystem.Feats',
    type: Boolean,
  },
  elvenAccuracy: {
    name: 'WonderSystem.FlagsElvenAccuracy',
    hint: 'WonderSystem.FlagsElvenAccuracyHint',
    section: 'WonderSystem.RacialTraits',
    type: Boolean,
  },
  halflingLucky: {
    name: 'WonderSystem.FlagsHalflingLucky',
    hint: 'WonderSystem.FlagsHalflingLuckyHint',
    section: 'WonderSystem.RacialTraits',
    type: Boolean,
  },
  initiativeAdv: {
    name: 'WonderSystem.FlagsInitiativeAdv',
    hint: 'WonderSystem.FlagsInitiativeAdvHint',
    section: 'WonderSystem.Feats',
    type: Boolean,
  },
  initiativeAlert: {
    name: 'WonderSystem.FlagsAlert',
    hint: 'WonderSystem.FlagsAlertHint',
    section: 'WonderSystem.Feats',
    type: Boolean,
  },
  jackOfAllTrades: {
    name: 'WonderSystem.FlagsJOAT',
    hint: 'WonderSystem.FlagsJOATHint',
    section: 'WonderSystem.Feats',
    type: Boolean,
  },
  observantFeat: {
    name: 'WonderSystem.FlagsObservant',
    hint: 'WonderSystem.FlagsObservantHint',
    skills: ['prc', 'inv'],
    section: 'WonderSystem.Feats',
    type: Boolean,
  },
  powerfulBuild: {
    name: 'WonderSystem.FlagsPowerfulBuild',
    hint: 'WonderSystem.FlagsPowerfulBuildHint',
    section: 'WonderSystem.RacialTraits',
    type: Boolean,
  },
  reliableTalent: {
    name: 'WonderSystem.FlagsReliableTalent',
    hint: 'WonderSystem.FlagsReliableTalentHint',
    section: 'WonderSystem.Feats',
    type: Boolean,
  },
  remarkableAthlete: {
    name: 'WonderSystem.FlagsRemarkableAthlete',
    hint: 'WonderSystem.FlagsRemarkableAthleteHint',
    abilities: ['str', 'dex', 'con'],
    section: 'WonderSystem.Feats',
    type: Boolean,
  },
  weaponCriticalThreshold: {
    name: 'WonderSystem.FlagsWeaponCritThreshold',
    hint: 'WonderSystem.FlagsWeaponCritThresholdHint',
    section: 'WonderSystem.Feats',
    type: Number,
    placeholder: 20,
  },
  spellCriticalThreshold: {
    name: 'WonderSystem.FlagsSpellCritThreshold',
    hint: 'WonderSystem.FlagsSpellCritThresholdHint',
    section: 'WonderSystem.Feats',
    type: Number,
    placeholder: 20,
  },
  meleeCriticalDamageDice: {
    name: 'WonderSystem.FlagsMeleeCriticalDice',
    hint: 'WonderSystem.FlagsMeleeCriticalDiceHint',
    section: 'WonderSystem.Feats',
    type: Number,
    placeholder: 0,
  },
};

/**
 * Flags allowed on actors. Any flags not in the list may be deleted during a migration.
 * @type {string[]}
 */
WonderSystemConf.local.allowedActorFlags = ['isPolymorphed', 'originalActor'].concat(Object.keys(WonderSystemConf.local.characterFlags));
