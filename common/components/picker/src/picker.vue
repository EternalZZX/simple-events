<template>
  <div class="hl-picker">
    <div class="hl-picker__line"></div>
    <div class="hl-picker__body">
      <hl-picker-item v-for="(item, index) in options"
        :key="index"
        :values="item.values"
        :value-index="item.index" 
        :column-index="index" 
        :key-name="item.key"
        :max-length="item.maxLength"
        :style="item.style"
        @change="handleChange">
      </hl-picker-item>
    </div>
  </div>
</template>

<script>
import HlPickerItem from './picker-item';
export default {
  name: 'HlPicker',
  components: {
    HlPickerItem
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    value: {
      default: null
    },
    options: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      result: []
    }
  },
  watch: {
    value: {
      handler (val) {
        const values = Object.prototype.toString.call(val) === '[object Array]' ? val : [val];
        values.forEach((value, columnIndex) => {
          let index;
          if (typeof value === 'object' && value) {
            const key = this.options[columnIndex].key || 'value';
            index = this.options[columnIndex].values.findIndex(item => item[key] === value[key]);
          } else {
            index = this.options[columnIndex].values.findIndex(item => item === value);
          }
          index !== -1 && this.$set(this.options[columnIndex], 'index', index);
        });
      },
      immediate: true
    },
    options (val) {
      val.forEach(this.init);
    }
  },
  created () {
    this.options.forEach(this.init);
  },
  methods : {
    init (option) {
      option.width && this.$set(option, 'style', {
        flex: 'initial',
        width: option.width
      });
      !option.maxLength && this.$set(
        option, 'maxLength', option.values.length
      );
    },
    handleChange (columnIndex, result, isSend) {
      this.result[columnIndex] = result;
      if (isSend) {
        const data = this.options.length === 1 ? this.result[0] : this.result;
        this.$emit('update:value', data);
        this.$emit('change', data);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/common';

.hl-picker {
  position: relative;
  width: 100%;
  height: 456px;

  .hl-picker__body {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .hl-picker__line {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;

    &:before {
      content: '';
      display: flex;
      width: 100%;
      height: 72px;
      border-top: $splitBorder;
      border-bottom: $splitBorder;
    }
  }
}

</style>