import 'core-js';
import $ from '@/lib/src/jquery-3.4.1.min.js';
import Utils from '@/lib/utils';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper';
import './assets/styles/index';

const elementIds = [
  'video', 'design', 'inner', '360', 'control', 'mutual',
  'safe', 'quota', 'bodywork', 'air', 'specs', 'news'
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

const swiperText = {
  'swiper-design': [
    '<h4>“星空点阵式”启辰家族前格栅</h4><p>双侧搭配“光翼”镀铬饰条，</p><p>展现科技想象力，尽显霸气。</p>',
    '<h4>悬浮式车顶</h4><p>双色车身设计，搭配悬浮式车顶，</p><p>兼具科技感与时尚个性。</p>',
    '<h4>“星耀式” LED光导尾灯</h4><p>“星耀式”LED光导尾灯，</p><p>独特造型更具视觉张力。</p>',
    '<h4>“星航” 投射式LED前大灯</h4><p>“星航”投射式LED前大灯设计，</p><p>光影中流露科技魅力。</p>'
  ],
  'swiper-inner': [
    '<h4>科技范高质感内饰</h4><p class="et-text_period">哑光飞翼贯穿前面板与中控大屏。</p><p class="et-text_comma">高质感多层加饰面板，围绕驾驶舱，</p><p class="et-text_comma">形成环绕式感觉，</p><p class="et-text_period">门把手所触及处均有皮质包饰。</p>',
    '<h4>全景天窗</h4><p class="et-text_comma">大尺寸电动可开启全景天窗，</p><p class="et-text_period">提供广阔视野享受。</p>',
    '<h4>Multi-Layer人体工学座椅</h4><p class="et-text_comma">采用航空低重力座椅设计理念，</p><p class="et-text_comma">提供更好的支撑，</p><p class="et-text_comma">有效降低乘坐疲劳感，乐享无拘舒适；</p><p class="et-text_comma">双色缝线工艺，黑棕搭配更显运动气质，</p><p class="et-text_period">不失品质感。</p>'
  ]
}
const swiperIds = ['swiper-design', 'swiper-inner'];
swiperIds.map(id => new Swiper(`#${id}`, {
  autoplay: {
    delay: 8000
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
  },
  on: {
    slideChange () {
      const el = $(`#${id}-text`);
      el.attr('class', 'et-text et-text_hide');
      el.empty();
      el.append(swiperText[id][this.realIndex]);
      setTimeout(() => {
        el.attr('class', 'et-text fade-in-bottom');
      }, 100)
    }
  }
}));

new Swiper ('#swiper-news', {
  speed: 500,
  width: 970,
  slidesOffsetBefore: 80,
  slidesOffsetAfter: -80,
  slidesPerView: 2,
  grabCursor: true
});

const animation = () => {
  const windiwScrollTop = $(window).scrollTop();
  for (const key of Object.keys(elements)) {
    if (!elements[key].ready && windiwScrollTop >= elements[key].offsetTop + 200) {
      elements[key].ready = true;
      elements[key].el.addClass('element-in');
    }
  }
}

const debounceAnimation = Utils.debounce(10, animation);

debounceAnimation();
$(window).scroll(debounceAnimation);
