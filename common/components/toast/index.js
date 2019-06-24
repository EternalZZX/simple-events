import Vue from 'vue';
import HlToast from './src/toast';

class Toast {
  constructor () {
    this.instance = null;
  }

  show (options = {}) {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    this.instance = this._toastFactory(options);
    document.body.appendChild(this.instance.$mount().$el);
    return this.instance;
  }

  hide () {
    this.instance && this.instance.close()
  }

  _toastFactory (options) {
    this.instance && this.instance.destroy();
    const ToastConstructor = Vue.extend(HlToast);
    return new ToastConstructor({
      data: options
    });
  }
}

export default new Toast();
