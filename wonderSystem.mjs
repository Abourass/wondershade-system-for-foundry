import { wondershadeConf } from './modules/config.js';
import WonderItemSheet from './modules/sheets/itemSheet.js';
import WonderActorSheet from './modules/sheets/actorSheet.js';

async function preloadHBSTemplates(){
  const templatePaths = [
    'systems/wondershade/templates/partials/layout/backgroundInfo.hbs',
  ];

  return loadTemplates(templatePaths);
}

Hooks.once('init', () => {
  console.log('Wonder System loading...');

  CONFIG.wondershade = wondershadeConf;

  // Unregister the default item sheet
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('wondershade', WonderItemSheet, { makeDefault: true });

  // Unregister the default item sheet
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('wondershade', WonderActorSheet, { makeDefault: true });

  preloadHBSTemplates();
});
