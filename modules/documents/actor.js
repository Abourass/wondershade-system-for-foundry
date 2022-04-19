const calculateModifier = (data) => {
  // Loop through ability scores, and add their modifiers to our sheet output.
  for (const [skill] of Object.values(data.skills)) {
    // Calculate the modifier using d20 rules.
    skill.mod = Math.floor((skill.value - 10) / 2);
  }
};

export default class WonderActor extends Actor {
  prepareData(){
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  prepareBaseData(){
    // Data modifications in this step occur before processing embedded documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this.data;
    // const data = actorData.data;
    // const flags = actorData.flags.boilerplate || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
    this._prepareCreatureData(actorData);
    this._preparePawnData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const data = actorData.data;

    // Calculate ability Modifiers
    calculateModifier(data);
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const data = actorData.data;

    data.xp = (data.cr * data.cr) * 100;
    calculateModifier(data);
  }

  /**
   * Prepare Creature type specific data.
   */
  _prepareCreatureData(actorData) {
    if (actorData.type !== 'creature') return;

    // Make modifications to data here. For example:
    const data = actorData.data;

    data.xp = (data.cr * data.cr) * 100;
    calculateModifier(data);
  }

  /**
   * Prepare Pawn type specific data.
   */
  _preparePawnData(actorData) {
    if (actorData.type !== 'pawn') return;

    // Make modifications to data here. For example:
    const data = actorData.data;

    data.xp = (data.cr * data.cr) * 100;
    calculateModifier(data);
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);
    this._getCreatureRollData(data);
    this._getPawnRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.data.type !== 'character') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.skills) {
      for (const [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.data.type !== 'npc') return;

    // Process additional NPC data here.
  }

  /**
   * Prepare Creature roll data.
   */
  _getCreatureRollData(data) {
    if (this.data.type !== 'creature') return;

    // Process additional NPC data here.
  }

  /**
   * Prepare Pawn roll data.
   */
  _getPawnRollData(data) {
    if (this.data.type !== 'pawn') return;

    // Process additional NPC data here.
  }
}
