<template>
  <div class="hl-swiper swiper-container">
    <slot name="parallax"></slot>
    <div class="swiper-wrapper">
      <slot></slot>
    </div>
    <div v-if="options.pagination && options.pagination.el" class="swiper-pagination"></div>
    <div v-if="options.navigation && options.navigation.prevEl" class="swiper-button-prev"></div>
    <div v-if="options.navigation && options.navigation.nextEl" class="swiper-button-next"></div>
    <div v-if="options.scrollbar && options.scrollbar.el" class="swiper-scrollbar"></div>
  </div>
</template>

<script>
import Swiper from 'swiper';
export default {
  name: 'HlSwiper',
  props: {
    index: {
      type: Number,
      default: 0
    },
    options: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      instance: null,
      events: [
        'beforeDestroy',
        'slideChange',
        'slideChangeTransitionStart',
        'slideChangeTransitionEnd',
        'slideNextTransitionStart',
        'slideNextTransitionEnd',
        'slidePrevTransitionStart',
        'slidePrevTransitionEnd',
        'transitionStart',
        'transitionEnd',
        'touchStart',
        'touchMove',
        'touchMoveOpposite',
        'sliderMove',
        'touchEnd',
        'click',
        'tap',
        'doubleTap',
        'imagesReady',
        'progress',
        'reachBeginning',
        'reachEnd',
        'fromEdge',
        'setTranslate',
        'setTransition',
        'resize'
      ]
    }
  },
  mounted () {
    !this.options.manual && this.init();
  },
  activated () {
    this.update();
  },
  updated () {
    this.update();
  },
  beforeDestroy () {
    this.$nextTick(() => {
      if (this.instance) {
        this.instance.destroy && this.instance.destroy();
        delete this.instance;
      }
    });
  },
  methods: {
    init () {
      if (this.options.pagination) {
        this.options.pagination === true && (this.options.pagination = {});
        !this.options.pagination.el && (this.options.pagination.el = '.swiper-pagination');
      }
      if (this.options.navigation) {
        this.options.navigation === true && (this.options.navigation = {});
        !this.options.navigation.prevEl && (this.options.navigation.prevEl = '.swiper-button-prev');
        !this.options.navigation.nextEl && (this.options.navigation.nextEl = '.swiper-button-next');
      }
      if (this.options.scrollbar) {
        this.options.scrollbar === true && (this.options.scrollbar = {});
        !this.options.scrollbar.el && (this.options.scrollbar.el = '.swiper-scrollbar');
      }
      this.$nextTick(() => {
        this.instance = new Swiper(this.$el, this.options);
        for (const event of this.events) {
          this.instance.on(event, () => {
            event === 'slideChange' && this.$emit('update:index', this.instance.realIndex);
            this.$emit(event.replace(/([A-Z])/g, '-$1').toLowerCase(), ...arguments);
          });
        }
        this.$emit('mounted', this.instance);
      });
    },
    update () {
      if (this.instance) {
        this.instance.update && this.instance.update();
        this.instance.navigation && this.instance.navigation.update();
        this.instance.pagination && this.instance.pagination.render();
        this.instance.pagination && this.instance.pagination.update();
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'swiper/dist/css/swiper';

.hl-swiper /deep/ {
  .swiper-pagination {
    bottom: 10px;
    height: 20px;

    .swiper-pagination-bullet {
      display: inline-block;
      width: 18px;
      height: 18px;
      margin: 0 5px;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 50%;

      &.swiper-pagination-bullet-active {
        background-color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}
</style>
