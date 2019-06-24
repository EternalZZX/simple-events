class Utils {
  /**
   * 深拷贝
   * @param {*} obj 对象
   * @return {*} 对象深拷贝
   */
  static jsonClone (obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * 深拷贝
   * @param {*} obj 对象
   * @return {*} 对象深拷贝
   */
  static deepClone (obj) {
    if (typeof obj != 'object' || obj === null) {
      return obj;
    }
    const newObj = obj.constructor === Array ? [] : {};
    for (const key in obj) {
      newObj[key] = this.deepClone(obj[key]);
    }
    return newObj;
  }

  /**
   * 判断对象是否为数组
   * @param {*} object 对象
   * @return {Boolean} 是否
   */
  static isArray (object) {
    return Object.prototype.toString.call(object) === '[object Array]';
  }

  /**
   * 生成随机字符串
   * @param {Number} len 字符串长度
   * @return {String} 随机字符串
   */
  static randString (len = 8) {
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let str = '';
    for (let i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  }

  /**
   * URL参数解析
   * @param {String} url URL字符串
   * @return {Object} 参数对象
   */
  static qsParse (url) {
    const qs = url.split('?');
    const obj = {};
    if (qs && qs[1]) {
      const arr = qs[1].split('&');
      arr.forEach(item => {
        const param = item.split('=');
        if (param[0] && param[1]) {
          obj[param[0]] = param[1];
        }
      });
    }
    return obj;
  }

  /**
   * 获取对象属性
   * @param {Object} obj 对象
   * @param {String} path 属性路径
   * @return {*} 属性
   */
  static safeGetting (obj, path) {
    let prop = obj;
    const arr = path.split(/[.[\]]/);
    for (const key of arr) {
      if (key === '') {
        continue;
      }
      if (prop) {
        prop = prop[key];
      } else {
        return void 0;
      }
    }
    return prop;
  }

  /**
   * 函数节流
   * @param {Number} delay 延迟
   * @param {Boolean} noTrailing 不执行尾随调用, 默认值false
   * @param {Function} callback 回调函数
   * @param {Boolean} debounceMode 防抖模式
   * @return {Function} 节流函数
   */
  static throttle (delay, noTrailing, callback, debounceMode) {
    let timeoutID;
    let lastExec = 0;
    if (typeof noTrailing !== 'boolean') {
      debounceMode = callback;
      callback = noTrailing;
      noTrailing = undefined;
    }
    function wrapper () {
      let self = this;
      let elapsed = Number(new Date()) - lastExec;
      let args = arguments;
      function exec () {
        lastExec = Number(new Date());
        callback.apply(self, args);
      }
      function clear () {
        timeoutID = undefined;
      }
      if (debounceMode && !timeoutID) {
        exec();
      }
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      if (debounceMode === undefined && elapsed > delay) {
        exec();
      } else if (noTrailing !== true) {
        timeoutID = setTimeout(
          debounceMode ? clear : exec,
          debounceMode === undefined ? delay - elapsed : delay
        );
      }
    }
    return wrapper;
  }

  /**
   * 函数防抖
   * @param {Number} delay 延迟
   * @param {Boolean} atBegin 立即执行, 默认值false
   * @param {Function} callback 回调函数
   * @return {Function} 防抖函数
   */
  static debounce (delay, atBegin, callback) {
    return callback === undefined
      ? this.throttle(delay, atBegin, false)
      : this.throttle(delay, callback, atBegin !== false);
  }

  /**
   * 格式化空字符串
   * @param {String} str 字符串
   * @return {String} 格式化字符串
   */
  static formatNone (str) {
    const items = ['', null, undefined];
    if (items.indexOf(str) !== -1) {
      return '-';
    }
    return str;
  }
}

export default Utils;
