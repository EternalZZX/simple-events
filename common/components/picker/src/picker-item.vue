<template>
  <hl-touch class="picker-item"
    v-on:panstart="onPanStart"
    v-on:panmove="onPanMove"
    v-on:panend="onPanEnd">
    <div ref="pickerItemContent"
      class="picker-item-content"
      v-nested="[currentValues, keyName]"
      :style="{
        transform: 'rotateX('+ scrollValue +'deg)'
      }">
    </div>
  </hl-touch>
</template>

<script>
import Vue from 'vue';
import VueTouch from 'vue-touch';
import { EaseOutEasing, BounceEasing, MomentumEasing, BoundMomentumEasing } from '../lib/animation';
Vue.use(VueTouch, { name: 'hl-touch' });
export default {
  name: 'HlPickerItem',
  props: {
    values: {
      type: Array
    },
    valueIndex: {
      type: Number,
      default: 0
    },
    columnIndex: {
      type: Number
    },
    keyName: {
      type: String,
      default: 'value'
    },
    maxLength: {
      type: Number
    }
  },
  directives: {
    nested: {
      bind (el, binding) {
        let value = binding.value[0];
        let key = binding.value[1];
        let html = '';
        for(let i = 0; i < 20; i++) {
          let n = 19 - i;
          let item = null;
          if (typeof value[n] == 'object') {
            item = value[n] && typeof value[n][key] !== 'undefined' ? value[n][key] : '';
          } else {
            item = typeof value[n] !== 'undefined' ? value[n] : '';
          }
          html = `<div><span data-index="${n}">${item}</span>${html}</div>`;
        }
        el.innerHTML = html;
      },
      update (el, binding) {
        let value = binding.value[0];
        let key = binding.value[1];
        let spenEl = el.querySelectorAll('span');
        let length = spenEl.length;
        for(let i = 0; i < length; i++) {
          let item = null;
          if (typeof value[i] == 'object') {
            item = value[i] && typeof value[i][key] !== 'undefined' ? value[i][key] : '';
          } else {
            item = typeof value[i] !== 'undefined' ? value[i] : '';
          }
          spenEl[i].innerHTML = item;
        }
      }
    }
  },
  data () {
    return {
      startValue: 0,
      startPageY: 0,
      scrollValue: 0,
      maxVelocity: 6,
      currentValues: this.values.slice(0, 15),
      currentMaxLength: this.maxLength,
      baseScrollValue: 0,
      firstTimeRequest: true,
      poolData: [],
      count: 0,
      requestStart: 0,
      lastValues: [],
      currentIndex: 0,
      isSend: true
    };
  },
  watch: {
    values (val) {
      this.setAlpha(0);
      this.scrollValue = 0;
      this.firstTimeRequest = true;
      this.baseScrollValue = 0;
      this.firstTimeRequest = true;
      this.poolData = [];
      this.count = 0;
      this.currentIndex = 0;
      this.requestStart = 0;
      this.currentValues = val.slice(0, 15);
      this.lastValues = this.currentValues;
      this.currentMaxLength = val.length;
      this.$emit('change', this.columnIndex, val[0], true);
    },
    valueIndex (val) {
      let targetValue = val * 18;
      let currentValue = this.scrollValue;
      this.isSend = true;
      if (this.scrollValue > targetValue) {
        for(let i = currentValue; i >= targetValue; i-=18) {
          this.onScroll(i, this.scrollValue);
          this.scrollValue = i;
        }
      } else {
        for(let i = currentValue; i <= targetValue; i+=18) {
          this.onScroll(i, this.scrollValue);
          this.scrollValue = i;
        }
      }
    },
    currentIndex (val) {
      const result = this.values[val];
      result && this.$emit('change', this.columnIndex, result, this.isSend);
    },
    maxLength (val) {
      this.currentMaxLength = val;
      val = val - 1;
      if (val > this.currentIndex) {
        return;
      }
      this.bounceHelper.stop();
      this.bounce.stop();
      this.boundMomentum.stop();
      this.bounceHelper.setConfig({
        startTime: Date.now(),
        startValue: this.scrollValue,
        endValue: val * 18
      });
      this.bounceHelper.run();
    }
  },
  mounted () {
    this.lastValues = this.currentValues;
    this.setAlpha(0);
    this.initAnimation();
    let defaultValue = this.valueIndex * 18;
    if (!defaultValue) {
      this.$emit('change', this.columnIndex, this.values[0], false);
      return;
    }
    for(let i = 0; i <= defaultValue; i+=18) {
      this.onScroll(i, this.scrollValue);
      this.scrollValue = i;
      this.isSend = false;
    }
  },
  methods: {
    onPanStart (...initialArgs) {
      let e = initialArgs[0];
      this.startPageY = e.changedPointers[0].pageY;
      this.startValue = this.scrollValue;
      this.bounceHelper.stop();
      this.bounce.stop();
      this.boundMomentum.stop();
    },
    onPanMove (...initialArgs) {
      let e = initialArgs[0];
      let deg = (this.startValue - (e.changedPointers[0].pageY - this.startPageY));
      let oldDeg = this.scrollValue;
      this.onScroll(deg, oldDeg);
      this.scrollValue = deg;
      this.isSend = true;
    },
    onPanEnd (...initialArgs) {
      let e = initialArgs[0];
      let maxVelocity = this.maxVelocity;
      let velocity = e.velocityY;
      if (velocity < -maxVelocity) {
        velocity = -maxVelocity;
      } else if (velocity > maxVelocity) {
        velocity = maxVelocity;
      }
      this.maxMomentumValue = (this.currentMaxLength - 1) * 18;
      let boundValue = null;
      if (this.scrollValue < 0) {
        boundValue = 0;
      } else if (this.scrollValue >= this.maxMomentumValue) {
        boundValue = this.maxMomentumValue;
      }
      if (boundValue !== null) {
        this.bounce.setConfig({
          startTime: Date.now(),
          startValue: this.scrollValue,
          endValue: boundValue
        });
        this.bounce.run();
        return;
      }
      this.boundMomentum.momentum.setConfig({
        startTime: Date.now(),
        startValue: this.scrollValue,
        startVelocity: velocity
      });
      this.boundMomentum.setConfig({
        maxMomentumValue: this.maxMomentumValue,
        startValue: this.scrollValue,
        startVelocity: velocity,
        callback: this.animationScrollValue
      });
      this.boundMomentum.run();
    },
    requestPoolData () {
      if (this.count + 3 >= this.requestStart * 5) {
        var data = this.values.slice((this.requestStart++) * 50, this.requestStart * 50), length = 0;
        if (data instanceof Array) {
          data = data.slice(0, 50);
          this.poolData = this.poolData.concat(data);
        }
      }
    },
    onScroll (value, oldValue) {
      this.setAlpha(value);
      this.currentIndex = Math.round(value / 18);
      let data, helperData, countHelper;
      if (value >= oldValue) {
        if (value - this.baseScrollValue > 90) {
          if (this.firstTimeRequest) {
            this.requestPoolData();
            this.firstTimeRequest = false;
          }
          this.baseScrollValue += 90;
          data = this.poolData.slice(15 + (this.count++) * 5, 15 + this.count * 5);
          data.length = 5;
          helperData = this.lastValues;
          countHelper = (this.count + 2) % 4;
          countHelper += countHelper < 0 ? 4 : 0;
          Array.prototype.splice.apply(helperData, [5 * countHelper, 5].concat(data));
          this.currentValues = this.lastValues;
          this.lastValues = this.currentValues;
          this.requestPoolData();
        }
      } else {
        if (value < this.baseScrollValue) {
          if (this.firstTimeRequest) {
            this.requestPoolData();
            this.firstTimeRequest = false;
          }
          this.baseScrollValue -= 90;
          --this.count;
          data = this.count > 0 ? this.poolData.slice((this.count - 1) * 5, this.count * 5) : [];
          data.length = 5;
          helperData = this.lastValues;
          countHelper = (this.count - 1) % 4;
          countHelper += countHelper < 0 ? 4 : 0;
          Array.prototype.splice.apply(helperData, [5 * countHelper, 5].concat(data));
          this.currentValues = this.lastValues;
          this.lastValues = this.currentValues;
        }
      }
    },
    setAlpha (deg) {
      const el = this.$refs.pickerItemContent;
      if (el) {
        let spans = el.querySelectorAll('span');
        let index = Math.round(deg / 18) % 20;
        deg = deg % 360;
        deg = deg < 0 ? deg + 360 : deg;
        for(let i = 0; i < spans.length; i++) {
          let dis = Math.abs(i * 18 - deg);
          let n = Math.abs(1 - dis / 18 * 0.1);
          spans[i].style.opacity = Math.abs(n - 0.5);
          spans[index] && (spans[index].style.opacity = 1);
        }
      }
    },
    animationScrollValue (value, isEnd) {
      let deg = value;
      let oldDeg = this.scrollValue;
      this.onScroll(deg, oldDeg);
      this.scrollValue = value;
    },
    initAnimation () {
      this.boundMomentum = new BoundMomentumEasing;
      this.boundMomentumIsEndedFn = this.boundMomentum.isEnded;
      this.bounceHelper = new EaseOutEasing;
      this.bounce = new EaseOutEasing;
      let boundMomentum = this.boundMomentum;
      let bounce = this.bounce;
      let bounceHelper = this.bounceHelper;
      boundMomentum.momentum.setConfig({
        acceleration: 30,
        friction: 1
      });
      boundMomentum.bounce.setConfig({
        acceleration: 30
      });
      boundMomentum.setConfig({
        minVelocity: 1,
        minMomentumValue: 0,
        callback: this.animationScrollValue
      });
      bounce.setConfig({
        duration: 400,
        callback: this.animationScrollValue
      });
      bounceHelper.setConfig({
        duration: 400,
        callback: this.animationScrollValue
      });
      boundMomentum.isEnded = () => {
        let result = this.boundMomentumIsEndedFn.call(boundMomentum);
        if (!boundMomentum.isOutOfBound && result) {
          animationScrollValueHelper();
        }
        return result;
      }
      let animationScrollValueHelper = () => {
        let scrollValue = Math.round(this.scrollValue / 18);
        let supplyValue = scrollValue * 18 - this.scrollValue;
        bounceHelper.setConfig({
          startTime: Date.now(),
          startValue: this.scrollValue,
          endValue: this.scrollValue + supplyValue
        });
        bounceHelper.run();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/common';

.picker-item /deep/ {
  position: relative;
  display: flex;
  flex: auto;
  height: 100%;
  font-size: $mobileTitleSize;
  color: $textColor;

  .picker-item-content {
    position: absolute;
    top: 192px;
    left: 0px;
    width: 100%;
    height: 72px;
    transform-style: preserve-3d;
    transform-origin: center center -227.295054px;

    div {
      position: absolute;
      top: 72px;
      left: 0px;
      width: 100%;
      transform-origin: top;
      transform-style: preserve-3d;
      transform: rotateX(-18deg);
    }

    & > div {
      top: 0;
      transform: rotateX(0deg);
    }

    span {
      display: block;
      width: 100%;
      height: 72px;
      line-height: 72px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      backface-visibility: hidden;
    }
  }
}
</style>