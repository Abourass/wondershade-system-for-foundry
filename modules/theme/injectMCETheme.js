export default function injectMCETheme(html, debug = false) {
  setTimeout(() => {
    if (debug) console.debug('[injectMCETheme] loaded');
    const editor = html[0].querySelector('.editor');
    if (debug) console.debug('[injectMCETheme] editor:', editor);
    const tinyMCE = editor.querySelector('.tox.tox-tinymce');
    if (debug) console.debug('[injectMCETheme] tinyMCE:', tinyMCE);
    const toxEditArea = tinyMCE.querySelector('.tox-edit-area');
    if (debug) console.debug('[injectMCETheme] toxEditArea:', toxEditArea);
    const iframe = toxEditArea.querySelector('iframe');
    if (debug) console.debug('[injectMCETheme] iframe:', iframe);
    const css = document.createElement('style');
    css.id = 'mce-theme';
    css.textContent = `
    body { color: whitesmoke; }
  `;
    const iFrameHead = iframe.contentWindow.document.head;
    if (debug) console.debug('[injectMCETheme] iFrameHead:', iFrameHead);
    iFrameHead.appendChild(css);
  }, 200);
}
