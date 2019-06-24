<template>
  <transition :name="transitionName">
    <div class="hl-dialog__wrapper" v-if="show">
      <div class="hl-dialog__mask" @click="close"></div>
      <div class="hl-dialog"
        :class="[customClass, {
          'hl-dialog_bottom': type === 'bottom',
          'hl-dialog_default': !customClass
        }]"
        :style="{ top }">
        <div v-if="showHeader"
          class="hl-dialog__header">
          <span class="hl-button"
            v-if="type === 'bottom' && closeButton"
            @click="close">
            取消
          </span>
          <slot name="header"></slot>
          <span class="hl-button hl-button_primary"
            v-if="type === 'bottom' && submitButton"
            @click="submit">
            确定
          </span>
        </div>
        <div class="hl-dialog__body">
          <slot></slot>
        </div>
        <div v-if="$slots.footer"
          class="hl-dialog__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'HlDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'center',
      validator (val) {
        return [
          'center',
          'bottom'
        ].indexOf(val) !== -1;
      }
    },
    customClass: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: '45%'
    },
    animation: {
      type: String,
      default: 'fade',
      validator (val) {
        return [
          'fade',
          'bounce'
        ].indexOf(val) !== -1;
      }
    },
    maskClose: {
      type: Boolean,
      default: true
    },
    closeButton: {
      type: Boolean,
      default: true
    },
    submitButton: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    transitionName () {
      if (this.type === 'center') {
        return `dialog-${this.animation}`;
      } else {
        return this.animation === 'fade'
          ? 'dialog-fade' : 'dialog-slide';
      }
    },
    showHeader () {
      return this.$slots.header || this.type === 'bottom' && (this.closeButton || this.submitButton)
    }
  },
  watch: {
    show (val) {
      document.body.style.overflowY = val ? 'hidden' : 'auto';
      this.$emit(val ? 'open' : 'close');
    }
  },
  methods: {
    submit () {
      this.$emit('submit');
      this.$emit('update:show', false);
    },
    close () {
      this.maskClose && this.$emit('update:show', false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~styles/common';

.hl-dialog__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: $dialogIndex;

  .hl-dialog {
    position: relative;
    margin: auto;
    background-size: cover;
    transform: translateY(-50%);

    &.hl-dialog_default {
      width: 520px;
      background-color: $blockColor;
      border-radius: $dialogRadius;

      .hl-dialog__header {
        font-size: $mobileTitleSize;
        line-height: 90px;
        text-align: center;
        color: $subTitleColor;
        user-select: none;
      }

      .hl-dialog__body {
        padding: 60px 30px;
        text-align: center;
        font-size: $mobileTextSize;
        color: $textColor;
      }

      .hl-dialog__footer {
        display: flex;
        width: 100%;
        height: 94px;
        line-height: 94px;
        border-top: 1px solid #ececec;

        /deep/ .hl-button {
          flex: auto;
          width: 0;
          font-size: $mobileTitleSize;
          color: $descriptionColor;
          background-color: $blockColor;
          border: none;
          border-right: $splitBorder;
          user-select: none;
          outline: none;
          cursor: pointer;
        }

        /deep/ .hl-button.hl-button_primary {
          color: $themeColor;
        }

        /deep/ .hl-button:active {
          background-color: $activeBlockColor;
        }

        /deep/ .hl-button:disabled {
          color: $descriptionColor;
          cursor: not-allowed;
        }

        /deep/ .hl-button:first-child {
          border-bottom-left-radius: $dialogRadius;
        }

        /deep/ .hl-button:last-child {
          border-right: none;
          border-bottom-right-radius: $dialogRadius;
        }
      }
    }

    &.hl-dialog_bottom {
      position: absolute;
      top: auto !important;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      max-width: 750px;
      border-radius: 0;
      transform: none;
    }
    
    &.hl-dialog_default.hl-dialog_bottom {
      .hl-dialog__header {
        .hl-button {
          float: left;
          display: block;
          padding: 0 30px;
          color: $descriptionColor;
          user-select: none;
          cursor: pointer;
        }

        .hl-button.hl-button_primary {
          float: right;
          color: $themeColor;
        }
      }

      .hl-dialog__body {
        padding: 30px;
      }
    }
  }

  .hl-dialog__mask {
    position: absolute;
    top: -3000px;
    right: -3000px;
    bottom: -3000px;
    left: -3000px;
    background-color: rgba(0, 0, 0, .5);
  }

  &.dialog-fade-enter-active {
    animation: dialog-fade-in .15s;
  }

  &.dialog-fade-leave-active {
    animation: dialog-fade-in .1s reverse;
  }

  &.dialog-bounce-enter-active {
    animation: dialog-bounce-in .55s ease;
  }

  &.dialog-bounce-leave-active {
    animation: dialog-bounce-out .3s ease;
  }

  &.dialog-slide-enter-active {
    animation: dialog-slide-in .35s ease;
  }

  &.dialog-slide-leave-active {
    animation: dialog-slide-in .3s ease reverse;
  }
}

@keyframes dialog-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes dialog-bounce-in {
  from {
    opacity: 0;
    transform: translate3d(0, -3000px, 0);
  }
  70% {
    opacity: 1;
    transform: translate3d(0, 30px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes dialog-bounce-out {
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  20% {
    opacity: 1;
    transform: translate3d(0, 20px, 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, -1000px, 0);
  }
}

@keyframes dialog-slide-in {
  from {
    opacity: 0;
    transform: translate3d(0, 3000px, 0);
  }
  70% {
    opacity: 1;
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
