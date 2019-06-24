class JsBridge {
  constructor (config) {
    this.androidInterface = window[config.androidInterface];
    this.iosDataKey = config.iosDataKey;
    this.methods = config.methods;
    this.callback = config.callback;
    for (const method of Object.keys(this.methods)) {
      this[method] = (args) => {
        this._openNative(method, args);
      };
    }
    if (!window[config.jsBridge]) {
      window[config.jsBridge] = {};
    }
    this._jsBridge = window[config.jsBridge];
    this._jsBridge[this.iosDataKey] = {};
    this._jsBridge[config.callbackFunction] = data => {
      const res = typeof data !== 'object' ? JSON.parse(data) : data;
      this.callback[res.key].call(this, res.data);
    }
  }

  addJsFunction (key, predicate) {
    if (!this._jsBridge[key]) {
      this._jsBridge[key] = predicate;
    }
  }

  _openNative (method, args = {}) {
    if (!JsBridge.isClient) {
      return;
    }
    if (JsBridge.isAndroid) {
      const argArr = Object.keys(args).map(key => args[key]);
      this.androidInterface[this.methods[method]](...argArr);
    } else {
      this._addData(this.methods[method], args);
      let randStr = Math.random().toString(36).substring(2, 12);
      location.hash = `${this.methods[method]}${randStr}`;
    }
  }

  _addData (key, data) {
    if (Object.keys(data).length) {
      this._jsBridge[this.iosDataKey][key] = JSON.stringify(data);
    }
  }
}

const ua = navigator.userAgent;

JsBridge.isIOS = /(iPhone|iPad|iPod|iOS)/i.test(ua);
JsBridge.isAndroid = /(Android)/i.test(ua);
JsBridge.isWeChat = /MicroMessenger/.test(ua);

const config = {
  jsBridge: 'JsBridge',
  iosDataKey: 'iOSData',
  androidInterface: 'android',
  callbackFunction: 'nativeCallback',
  methods: {},
  callback: {}
};

export { JsBridge };

export default new JsBridge(config);
