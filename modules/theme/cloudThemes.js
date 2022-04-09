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

/**
 * createGalaxy
 *
 * Attaches the relevant HTML higher up the DOM so they don't get targeted by the Sheet refresh.
 */
export const createGalaxy = () => {
  function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
  }

  const charSheet = document.querySelectorAll('.wondershade.sheet.character');

  charSheet.forEach((sheet) => {
    if (sheet.children.length === 3) {
      const stars = document.createElement('div');
      stars.classList.add('stars');
      const twinkle = document.createElement('div');
      twinkle.classList.add('twinkling');
      const clouds = document.createElement('div');
      clouds.classList.add('clouds');

      insertAfter(stars, sheet.children[0]);
      insertAfter(twinkle, sheet.children[1]);
      insertAfter(clouds, sheet.children[2]);
    }
  });
};
