import 'core-js';
import $ from '@/lib/src/jquery-3.4.1.min.js';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper';
import './assets/styles/index';

const elementIds = [
  'design', 'inner', '360', 'control', 'mutual',
  'safe', 'quota', 'bodywork', 'air', 'specs'
];
const elements = elementIds.reduce((res, id) => {
  const el = document.getElementById(id);
  res[id] = {
    el: $(el),
    offsetTop: el.offsetTop,
    ready: false
  };
  return res;
}, {});

const swiperIds = ['swiper-design', 'swiper-inner'];
swiperIds.forEach(id => {
  new Swiper(`#${id}`, {
    autoplay: {
      delay: 5000
    },
    speed: 500,
    loop: true,
    grabCursor: true,
    pagination: {
      el: `#${id}-pagination`,
      clickable: true,
      renderBullet (index, className) {
        return `<span class="${className}">${index + 1}</span>`;
      }
    },
    navigation: {
      prevEl: `#${id}-prev`,
      nextEl: `#${id}-next`
    }
  });
});

$(window).scroll(() => {
  const windiwScrollTop = $(window).scrollTop();
  for (const key of Object.keys(elements)) {
    if (!elements[key].ready && windiwScrollTop >= elements[key].offsetTop) {
      elements[key].el.addClass('element-in');
      elements[key].ready = true;
    }
  }
});