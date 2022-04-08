import { WonderSystemConf } from './modules/config.js';
import WonderItemSheet from './modules/sheets/itemSheet.js';
import WonderActorSheet from './modules/sheets/actorSheet.js';
import preloadHBSTemplates from './modules/system/preloadHBS.js';
import registerSystemSettings from './modules/system/settings.js';
import { loadCloudTheme } from './modules/theme/cloudThemes.js';

Hooks.once('init', () => {
  console.log('[WonderSystem:Loading]');
  // Add conf for localization and html stuff
  CONFIG.wondershade = WonderSystemConf;
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

Handlebars.registerHelper('dynamicLocalization', (data, key) => game.i18n.localize(data[key]));

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

Handlebars.registerHelper('spellSlots', (data, spellLevel) => data[spellLevel].slots);
