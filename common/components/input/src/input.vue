<template>
  <div class="hl-input">
    <input class="hl-input__inner"
      v-model="text"
      :type="type"
      :placeholder="placeholder"
      :maxlength="maxlength">
  </div>
</template>

<script>
export default {
  name: 'HlInput',
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    value: {
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    maxlength: {
      type: Number,
      default: NaN
    },
    validate: {
      type: String,
      default: '',
      validator (val) {
        return [
          '',
          'number',
          'money'
        ].indexOf(val) !== -1;
      }
    }
  },
  data () {
    return {
      text: '',
      watchFlag: true,
      regs: {
        number: /^\d*$/,
        money: /^[0-9]+(\.([0-9]){0,2})?$/
      }
    };
  },
  watch: {
    value (val) {
      this.text = val;
    },
    text (val, oldVal) {
      if (this.validate) {
        if (!this.watchFlag) {
          this.watchFlag = true;
          return;
        }
        if (val !== '' && !this.regs[this.validate].test(val)) {
          this.text = oldVal;
          this.watchFlag = false;
          return;
        }
      }
      this.$emit('update:value', this.text);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~styles/common';

.hl-input {
  position: relative;

  .hl-input__inner {
    width: 100%;
    height: 100%;
    color: $textColor;
    border: none;
    box-sizing: border-box;
  }
}
</style>
