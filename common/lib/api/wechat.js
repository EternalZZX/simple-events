import BaseRequest from '@/lib/request';

class WeChatApi extends BaseRequest {
  constructor () {
    super();
    this.url = 'https://weixin.eternalzzx.com';
  }

  sign (url) {
    return super.get(`${this.url}/serve/jssign`, {
      url: encodeURIComponent(url.split('#')[0])
    });
  }
}

export { WeChatApi };

export default new WeChatApi();
