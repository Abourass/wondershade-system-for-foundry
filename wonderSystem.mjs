import { wondershadeConf } from './modules/config.js';
import WonderItemSheet from './modules/sheets/itemSheet.js';

Hooks.once('init', () => {
  console.log('Wonder System loading...');

  CONFIG.wondershade = wondershadeConf;

  // Unregister the default item sheet
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('wondershade', WonderItemSheet, { makeDefault: true });
});
