import { WonderSystemConf } from './modules/config.js';
import WonderItemSheet from './modules/sheets/itemSheet.js';
import WonderActorSheet from './modules/sheets/actorSheet.js';
import preloadHBSTemplates from './modules/system/preloadHBS.js';

Hooks.once('init', () => {
  console.log('Wonder System loading...');
  // Add conf for localization and html stuff
  CONFIG.wondershade = WonderSystemConf;
  // Unregister the default item sheet
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('wondershade', WonderItemSheet, { makeDefault: true });
  // Unregister the default item sheet
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('wondershade', WonderActorSheet, { makeDefault: true });

  preloadHBSTemplates();
});

Handlebars.registerHelper('dynamicLocalization', (data, key) => game.i18n.localize(data[key]));
