<template>
  <div class="swiper-slide">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'HlSwiperSlide',
  mounted () {
    this.update();
  },
  updated () {
    this.update();
  },
  methods: {
    update () {
      this.$parent && this.$parent.instance && this.$parent.update();
    }
  }
}
</script>
