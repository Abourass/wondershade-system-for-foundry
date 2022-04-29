import { WonderSystemConf } from './modules/config.js';
import registerSystemSettings from './modules/system/settings.js';
import { loadCloudTheme } from './modules/theme/cloudThemes.js';
import preloadHBSTemplates from './modules/system/preloadHBS.js';

// Import Sheets and Their Base Documents
import WonderItem from './modules/documents/item.js';
import WonderActor from './modules/documents/ActorDoc.js';
import WonderItemSheet from './modules/sheets/itemSheet.js';
import WonderActorSheet from './modules/sheets/actorSheet.js';

// Import Macros And Helpers
// import { advancement } from './modules/advancement'; <- Enabling this breaks all of our sheets. No idea. -Mod
import createItemMacro from './modules/system/createItemMacro.js';
import rollItemMacro from './modules/system/rollItemMacro.js';

Hooks.once('init', () => {
  console.debug('[WonderSystem:Loading]');
  // Add utility classes to the global game object so that they're more easily accessible in global contexts.
  game.wondershade = {
    // advancement,
    WonderActor,
    WonderItem,
    rollItemMacro,
  };

  // Add conf for localization and html stuff
  CONFIG.wondershade = WonderSystemConf;
  // Register custom actor class
  CONFIG.Actor.documentClass = WonderActor;
  // Register custom Item Class
  CONFIG.Item.documentClass = WonderItem;
  // Unregister the default item sheet
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('wondershade', WonderItemSheet, { makeDefault: true });
  // Unregister the default item sheet
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('wondershade', WonderActorSheet, { makeDefault: true });

  registerSystemSettings();
  preloadHBSTemplates();
  // Load User's preferred cloud theme
  loadCloudTheme(game.settings.get('wondershade', 'cloudTheme'));
});

const isObject = value => !!(value && typeof value === 'object' && !Array.isArray(value));
const isALocalizationString = value => typeof value === 'string' && value.startsWith('WonderSystem.');

/*
 * Localize everything in the config file under `.local`
 * moves all the localized objects to under the base config
 * then deletes the `.local` property
 * @param {object} config
*/
function localizeConfig(config){ // TODO: This can definitely be optimized, but at the moment I haven't the mind for it
  for (const key in config.local) {
    if (typeof config.local[key] === 'string' && isALocalizationString(config.local[key])) {
      if (config.local.hasOwnProperty(key)) {
        const element = config.local[key];
        config[key] = game.i18n.localize(element);
      }
    } else if (isObject(config.local[key])) {
      for (const subKey in config.local[key]) {
        if (typeof config.local[key][subKey] === 'string' && isALocalizationString(config.local[key][subKey])) {
          if (config.local[key].hasOwnProperty(subKey)) {
            if (!config[key]) config[key] = {};
            const element = config.local[key][subKey];
            config[key][subKey] = game.i18n.localize(element);
          }
        } else if (isObject(config.local[key][subKey])) {
          for (const subsubKey in config.local[key][subKey]) {
            if (typeof config.local[key][subKey][subsubKey] === 'string' && isALocalizationString(config.local[key][subKey][subsubKey])) {
              if (config.local[key][subKey].hasOwnProperty(subsubKey)) {
                if (!config[key]) config[key] = {};
                if (!config[key][subKey]) config[key][subKey] = {};
                const element = config.local[key][subKey][subsubKey];
                config[key][subKey][subsubKey] = game.i18n.localize(element);
              }
            } else {
              if (!config[key]) config[key] = {};
              if (!config[key][subKey]) config[key][subKey] = {};
              config[key][subKey][subsubKey] = config.local[key][subKey][subsubKey];
            }
          }
        } else {
          if (!config[key]) config[key] = {};
          config[key][subKey] = config.local[key][subKey];
        }
      }
    } else {
      config[key] = config.local[key];
    }
  }
  delete config.local;
  return config;
}

Hooks.once('setup', () => {
  localizeConfig(CONFIG.wondershade);
});

Handlebars.registerHelper('skillChecked', (data, skill, debug = false) => {
  if (debug) {
    console.debug(`[WonderSystem::HBS:SkillChecked:${skill}] -> called`);
    console.debug(`[WonderSystem::HBS:SkillChecked:${skill}] -> checked`, data.skills[skill].checked);
  }
  return data.skills[skill].checked;
});

Handlebars.registerHelper('skillValue', (data, skill, debug = false) => {
  if (debug) {
    console.debug(`[WonderSystem::HBS:SkillValue:${skill}] -> value`, data.skills[skill].value);
  }
  return data.skills[skill].value;
});

Handlebars.registerHelper('includes', (arr, value) => arr.includes(value));

Handlebars.registerHelper('atKey', (data, key) => data[key]);

Handlebars.registerHelper('spellSlots', (data, spellLevel) => data[`${spellLevel}Level`].slots);

Handlebars.registerHelper('spells', (data, spellLevel) => {
  if ('allSpells' in data){
    if (spellLevel === 'cantrips') return data.allSpells[spellLevel];
    if (spellLevel === 'finesse-and-class') return data.allSpells.finesse;
    if (spellLevel === 'wonder') return data.allSpells.wonderSpells;
    return data.allSpells[`${spellLevel}Level`];
  }
  console.error('[WonderSystem::HBS:Spells] -> data failure ', data);
});

Handlebars.registerHelper('hasSome', data => data.length > 0);

Handlebars.registerHelper('formatDifficultyText', text => ((text.toString()[0] === '-') ? text : `+${text}`));

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', async() => {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});
