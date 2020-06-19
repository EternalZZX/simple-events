import 'core-js';
import 'lib-flexible';
import Vue from 'vue';
import index from './index.vue';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#index',
  components: {
    index
  },
  template: '<index/>'
});
