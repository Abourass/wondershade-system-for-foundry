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
    onChange: (value) => {
      console.log(value);
      let css = document.getElementById('wondershade-cloud-theme');

      if (!css){
        css = document.createElement('style');
        css.id = 'wondershade-cloud-theme';
        document.head.appendChild(css);
      }

      css.textContent = `
        .clouds {
          background: transparent url(https://wonder-vtt.s3.us-west-1.amazonaws.com/${value}-clouds.webp) repeat top center;
          -webkit-animation: move-clouds-back 320s linear infinite;
          animation: move-clouds-back 320s linear infinite;
        }`;
    },
  });
}
