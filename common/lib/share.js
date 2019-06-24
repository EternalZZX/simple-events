import wx from 'weixin-js-sdk';
import WeChat from '@/lib/api/wechat';
import native, { JsBridge } from '@/lib/bridge';

class Share {
  constructor (option) {
    this.option = {
      url: window.location.href,
      icon: 'https://events.eternalzzx.com/static/web/share/share-default.png',
      menu: ['wechat_friend', 'wechat_friend_circle', 'copy_link'],
      ...option
    };
    this.option.url = `${this.option.url}${this.option.url.indexOf('?') === -1 ? '?' : '&'}pathfrom=`;
    JsBridge.isWeChat && this._wx();
    JsBridge.isClient && this._client();
  }

  _client () {
    const config = {
      title: this.option.title,
      description: this.option.description,
      url: `${this.option.url}app`,
      imageUrl: this.option.icon,
      shareMenuList: this.option.menu
    };
    native.showShareMenu({
      share: config,
      show: true
    });
  }

  _wx () {
    const config = {
      title: this.option.title,
      desc: this.option.description,
      link: `${this.option.url}wx`,
      imgUrl: this.option.icon
    };
    WeChat.sign(window.location.href).then(data => {
      wx.config(data);
      wx.ready(() => {
        wx.onMenuShareAppMessage(config);
        wx.onMenuShareTimeline(config);
        wx.hideMenuItems({
          menuList: ['menuItem:share:qq', 'menuItem:share:weiboApp']
        });
      });
    });
  }
}

export default Share;
