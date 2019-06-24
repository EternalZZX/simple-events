<template>
  <div class="hl-datepicker__wrapper">
    <div class="hl-datepicker" @click="open">
      <span :class="label ? 'hl-datepicker__label' : 'hl-datepicker__placeholder'">
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
        :options="options"
        @change="setMaxDate">
      </hl-picker>
    </hl-dialog>
  </div>
</template>

<script>
import HlDialog from '@/components/dialog';
import HlPicker from '@/components/picker';
export default {
  name: 'HlDatepicker',
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
    begin: {
      type: Date,
      default () {
        return new Date();
      }
    },
    end: {
      type: Date,
      default () {
        const date = new Date();
        date.setFullYear(new Date().getFullYear() + 40);
        return date;
      }
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
      selected: null,
      selectShow: false,
      options: []
    };
  },
  computed: {
    label () {
      if (this.value instanceof Date) {
        const year = this.value.getFullYear();
        const month = this.value.getMonth() + 1;
        const date = this.value.getDate();
        return `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
      }
      return '';
    }
  },
  created () {
    this.options = [{
      width: '38%',
      key: 'label',
      values: this.getYearOption(this.begin, this.end),
    }, {
      width: '31%',
      key: 'label',
      values: this.getMonthOption(),
    }, {
      width: '31%',
      key: 'label',
      maxLength: 31,
      values: this.getDateOption()
    }];
    this.selected = [
      this.options[0].values[0],
      this.options[1].values[0],
      this.options[2].values[0]
    ];
  },
  methods: {
    open () {
      this.selectShow = true;
      if (this.value instanceof Date) {
        this.$set(this.selected, 0, {
          label: `${this.value.getFullYear()}年`,
          value: this.value.getFullYear()
        });
        this.$set(this.selected, 1, {
          label: `${this.value.getMonth() + 1}月`,
          value: this.value.getMonth() + 1
        });
        this.$set(this.selected, 2, {
          label: `${this.value.getDate()}日`,
          value: this.value.getDate()
        });
      }
    },
    getYearOption (begin, end) {
      const m = begin.getFullYear();
      const n = end.getFullYear();
      const result = [];
      for (let i = m; i <= n; i++) {
        result.push({
          value: i,
          label: `${i}年`
        });
      }
      return result;
    },
    getMonthOption () {
      const result = [];
      for (let i = 1; i <= 12; i++) {
        result.push({
          value: i,
          label: `${i}月`
        });
      }
      return result;
    },
    getDateOption () {
      const result = [];
      for (let i = 1; i <= 31; i++) {
        result.push({
          value: i,
          label: `${i}日`
        });
      }
      return result;
    },
    setMaxDate (val) {
      this.options[2].maxLength = val
        ? new Date(new Date(val[0].value, val[1].value, 1) - 1).getDate()
        : 31;
    },
    updateSelect () {
      if (this.selected) {
        const date = new Date(0);
        date.setFullYear(this.selected[0].value);
        date.setMonth(this.selected[1].value - 1);
        date.setDate(this.selected[2].value);
        this.$emit('update:value', date);
        this.selectShow = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~styles/common';

.hl-datepicker {
  display: inline-block;
  cursor: pointer;

  .hl-datepicker__label {
    font-size: $mobileTextSize;
    color: $textColor;
    @extend %text-overflow;
  }

  .hl-datepicker__placeholder {
    font-size: $mobileTextSize;
    color: $descriptionColor;
  }
}
</style>
