export const loadCloudTheme = (value) => {
  let css = document.getElementById('wondershade-cloud-theme');

  if (!css){
    css = document.createElement('style');
    css.id = 'wondershade-cloud-theme';
    document.head.appendChild(css);
  }

  const cloudOpacity = game.settings.get('wondershade', 'cloudOpacity');

  css.textContent = `
    .clouds {
      background: transparent url(https://wonder-vtt.s3.us-west-1.amazonaws.com/${value}-clouds.webp) repeat top center;
      -webkit-animation: move-clouds-back 320s linear infinite;
      animation: move-clouds-back 320s linear infinite;

      opacity: ${(cloudOpacity === 0) ? 0.5 : cloudOpacity};
    }`;
};

export const loadCloudOpacity = (value) => {
  let css = document.getElementById('wondershade-cloud-theme');

  if (!css){
    css = document.createElement('style');
    css.id = 'wondershade-cloud-theme';
    document.head.appendChild(css);
  }

  const cloudTheme = game.settings.get('wondershade', 'cloudTheme');

  css.textContent = `
    .clouds {
      background: transparent url(https://wonder-vtt.s3.us-west-1.amazonaws.com/${cloudTheme}-clouds.webp) repeat top center;
      -webkit-animation: move-clouds-back 320s linear infinite;
      animation: move-clouds-back 320s linear infinite;

      opacity: ${value};
    }`;
};
