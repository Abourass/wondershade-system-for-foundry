export default class WonderActor extends ActorSheet {
  constructor(...args) {
    super(...args);

    /**
     * Track the set of item filters which are applied
     * @type {Set}
     */
    this._filters = {
      inventory: new Set(),
      spellbook: new Set(),
      features: new Set(),
      effects: new Set(),
    };
  }

  /**
   * Insert a spell into the spellbook object when rendering the character sheet.
   * @param {object} data      Copy of the Actor data being prepared for display.
   * @param {Array<object>} spells  Spells to be included in the spellbook.
   * @returns {Array<object>}       Spellbook sections in the proper order.
   * @private
   */
  _prepareSpellbook(data, spells) {
    const owner = this.actor.isOwner;
    const levels = data.data.spells;
    const spellbook = {};

    // Define some mappings
    const sections = {
      atwill: -20,
      innate: -10,
      pact: 0.5,
    };

    // Label spell slot uses headers
    const useLabels = {
      '-20': '-',
      '-10': '-',
      0: '&infin;',
    };

    // Format a spellbook entry for a certain indexed level
    const registerSection = (sl, i, label, {prepMode = 'prepared', value, max, override} = {}) => {
      spellbook[i] = {
        order: i,
        label: label,
        usesSlots: i > 0,
        canCreate: owner,
        canPrepare: (data.actor.type === 'character') && (i >= 1),
        spells: [],
        uses: useLabels[i] || value || 0,
        slots: useLabels[i] || max || 0,
        override: override || 0,
        dataset: {type: 'spell', level: prepMode in sections ? 1 : i, 'preparation.mode': prepMode},
        prop: sl,
      };
    };

    // Determine the maximum spell level which has a slot
    const maxLevel = Array.fromRange(10).reduce((max, i) => {
      if (i === 0) return max;
      const level = levels[`spell${i}`];
      if ((level.max || level.override) && (i > max)) max = i;
      return max;
    }, 0);

    // Level-based spell casters have cantrips and leveled slots
    if (maxLevel > 0) {
      registerSection('spell0', 0, CONFIG.DND5E.spellLevels[0]);
      for (let lvl = 1; lvl <= maxLevel; lvl++) {
        const sl = `spell${lvl}`;
        registerSection(sl, lvl, CONFIG.DND5E.spellLevels[lvl], levels[sl]);
      }
    }

    // Pact magic users have cantrips and a pact magic section
    if (levels.pact && levels.pact.max) {
      if (!spellbook['0']) registerSection('spell0', 0, CONFIG.DND5E.spellLevels[0]);
      const l = levels.pact;
      const config = CONFIG.DND5E.spellPreparationModes.pact;
      const level = game.i18n.localize(`DND5E.SpellLevel${levels.pact.level}`);
      const label = `${config} — ${level}`;
      registerSection('pact', sections.pact, label, {
        prepMode: 'pact',
        value: l.value,
        max: l.max,
        override: l.override,
      });
    }

    // Iterate over every spell item, adding spells to the spellbook by section
    spells.forEach((spell) => {
      const mode = spell.data.preparation.mode || 'prepared';
      let s = spell.data.level || 0;
      const sl = `spell${s}`;

      // Specialized spell casting modes (if they exist)
      if (mode in sections) {
        s = sections[mode];
        if (!spellbook[s]) {
          const l = levels[mode] || {};
          const config = CONFIG.DND5E.spellPreparationModes[mode];
          registerSection(mode, s, config, {
            prepMode: mode,
            value: l.value,
            max: l.max,
            override: l.override,
          });
        }
      } else if (!spellbook[s]) { // Sections for higher-level spells which the caster "should not" have, but spell items exist for
        registerSection(sl, s, CONFIG.DND5E.spellLevels[s], {levels: levels[sl]});
      }

      // Add the spell to the relevant heading
      spellbook[s].spells.push(spell);
    });

    // Sort the spellbook by section level
    const sorted = Object.values(spellbook);
    sorted.sort((a, b) => a.order - b.order);
    return sorted;
  }
}
