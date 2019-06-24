<template>
  <div class="hl-select__wrapper">
    <div class="hl-select" @click="open">
      <span :class="label ? 'hl-select__label' : 'hl-select__placeholder'">
        {{ label || placeholder }}
      </span>
    </div>

    <hl-dialog
      :show.sync="selectShow"
      type="bottom"
      animation="bounce"
      @submit="updateSelect">
      <template slot="header">{{ title }}</template>
      <hl-picker v-model="selected"
        :options="pickerOptions">
      </hl-picker>
    </hl-dialog>
  </div>
</template>

<script>
import HlDialog from '@/components/dialog';
import HlPicker from '@/components/picker';
export default {
  name: 'HlSelect',
  components: {
    HlDialog,
    HlPicker
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
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    title: {
      type: String,
      default: '请选择'
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data () {
    return {
      label: '',
      selected: null,
      selectShow: false
    };
  },
  computed: {
    pickerOptions () {
      return [{
        key: this.labelKey,
        values: this.options
      }];
    }
  },
  watch: {
    value: {
      handler (val) {
        this.label = typeof this.selected === 'object' && this.selected
          ? this.selected[this.labelKey]
          : this.selected || '';
      },
      immediate: true
    }
  },
  methods: {
    open () {
      if (this.value !== null) {
        this.selected = this.options.find(item => (
          typeof item === 'object' && item
            ? item[this.valueKey] === this.value
            : item === this.value
        ));
      } else if (this.options.length) {
        this.selected = this.options[0];
      }
      this.selectShow = true;
    },
    updateSelect () {
      this.$emit('update:value',
        typeof this.selected === 'object' && this.selected
          ? this.selected[this.valueKey]
          : this.selected
      );
      this.selectShow = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~styles/common';

.hl-select {
  display: inline-block;
  cursor: pointer;

  .hl-select__label {
    font-size: $mobileTextSize;
    color: $textColor;
    @extend %text-overflow;
  }

  .hl-select__placeholder {
    font-size: $mobileTextSize;
    color: $descriptionColor;
  }
}
</style>
