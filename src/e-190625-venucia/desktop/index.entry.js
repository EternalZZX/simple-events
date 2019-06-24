import 'core-js';
import $ from '@/lib/src/jquery-3.4.1.min.js';
import './assets/styles/index';

const elementIds = ['banner', 'design'];
const elements = elementIds.reduce((res, id) => {
  const el = document.getElementById(id);
  res[id] = {
    el: $(el),
    offsetTop: el.offsetTop,
    ready: false
  };
  return res;
}, {});

$(window).scroll(() => {
  const windiwScrollTop = $(window).scrollTop();
  for (const key of Object.keys(elements)) {
    if (!elements[key].ready && elements[key].offsetTop >= windiwScrollTop) {
      console.log('element-in')
      elements[key].el.addClass('element-in');
      elements[key].ready = true;
    }
  }
});