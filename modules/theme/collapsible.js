// eslint-disable-next-line import/no-unresolved
import localDB from 'https://cdn.skypack.dev/pin/localforage@v1.10.0-vSTz1U7CF0tUryZh6xTs/mode=imports,min/optimized/localforage.js';
import isInView from '../generic/isInView.js';

export default async function attachCollapsibleListeners(){
  let areOpen = await localDB.getItem('wondershade.collapsible') ?? [];
  const elements = [...document.getElementsByClassName('collapsible')];

  elements.map(async(el, i) => {
    el.onclick = async() => {
      if (areOpen.includes(i)) {
        areOpen = areOpen.filter(item => item !== i);
      } else {
        areOpen.push(i);
      }
      localDB.setItem('wondershade.collapsible', areOpen);
      el.classList.toggle('open');
      const content = el.nextElementSibling;
      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    };

    if (areOpen.includes(i)) {
      el.classList.add('open');
      const content = el.nextElementSibling;
      if (isInView(content) && content.scrollHeight !== 0) {
        content.style.maxHeight = `${content.scrollHeight}px`;
      } else { // If they refreshed the page set a default height
        content.style.maxHeight = '120px';
      }
    }
  });
}
