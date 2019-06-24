import HlSwiper from './src/swiper';
import HlSwiperSlide from './src/swiper-slide';

const Swiper = { HlSwiper, HlSwiperSlide };

Swiper.install = Vue => {
  Vue.component(HlSwiper.name, HlSwiper);
  Vue.component(HlSwiperSlide.name, HlSwiperSlide);
};

export { HlSwiper, HlSwiperSlide };
export default Swiper;
