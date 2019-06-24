<template>
  <button class="hl-button"
    :class="{
      'hl-button_disabled': disabled,
      'hl-button_primary': type === 'primary'
    }"
    @click="click"
    @touchstart="touchstart">
    <slot>{{ text }}</slot>
  </button>
</template>

<script>
export default {
  name: 'HlButton',
  props: {
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default',
      validator (val) {
        return [
          'default',
          'primary'
        ].indexOf(val) !== -1;
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    click (event) {
      this.disabled
        ? this.$emit('error', event)
        : this.$emit('click', event);
    },
    touchstart () {
      // For mobile active style
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~styles/common';

.hl-button {
  display: inline-block;
  padding: 0;
  font-size: $mobileTitleSize;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  outline-style: none;
  user-select: none;
  cursor: pointer;
  
  &.hl-button_disabled {
    cursor: not-allowed;
  }
}
</style>
