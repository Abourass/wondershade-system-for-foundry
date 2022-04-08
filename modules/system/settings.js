import { loadCloudOpacity, loadCloudTheme } from '../theme/cloudThemes.js';

export default function registerSystemSettings(){
  // Register Cloud Options
  game.settings.register('wondershade', 'cloudTheme', {
    name: 'Cloud Theme',
    hint: 'Choose your preferred cloud theme',
    scope: 'client',
    config: true,
    type: String,
    choices: {
      blue: 'Blue',
      cyber: 'Cyber Punk',
      'cyber-alt': 'Cyber Punk (Alternative)',
      'muted-cyber': 'Cyber Punk (Muted)',
      'deep-see': 'Deep Sea',
      genghar: 'Genghar',
      'hue-shift': 'Hue Shift',
      pearly: 'Pearly',
      purple: 'Purple',
      'red-shift': 'Red Shift',
      seashell: 'Seashell',
    },
    default: 'cyber',
    onChange: loadCloudTheme,
  });
  // Register Cloud Opacity Option
  game.settings.register('wondershade', 'cloudOpacity', {
    name: 'Cloud Opacity',
    hint: 'Choose your preferred cloud opacity',
    scope: 'client',
    config: true,
    type: Number,
    range: {
      min: 0,
      max: 1,
      step: 0.05,
    },
    default: 0.5,
    onChange: loadCloudOpacity,
  });
}
