export const parseUserAgent = (ua = navigator.userAgent) => {
  // Wechat UserAgent: "Mozilla/5.0(iphone;CPU iphone OS 5_1_1 like Mac OS X) AppleWebKit/534.46(KHTML,like Geocko) Mobile/9B206 MicroMessenger/5.0"
  let Sys = {};
  if (ua) {
    ua = ua.toLowerCase();
    let s = ua.match(/micromessenger\/([\d.]+)/);
    if (s) Sys.wechat = s[1];
    else if ((s = ua.match(/msie ([\d.]+)/))) Sys.ie = s[1];
    else if ((s = ua.match(/firefox\/([\d.]+)/))) Sys.firefox = s[1];
    else if ((s = ua.match(/chrome\/([\d.]+)/))) Sys.chrome = s[1];
    else if ((s = ua.match(/opera.([\d.]+)/))) Sys.opera = s[1];
    else if ((s = ua.match(/version\/([\d.]+).*safari/))) Sys.safari = s[1];

    Sys.android = ua.indexOf('android') > -1 || ua.indexOf('adr') > -1; //android终端
    Sys.ios = !!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/); //ios终端
  }
  return Sys;
};

export const parseUserAgentV2 = (
  ua = navigator.userAgent,
  pf = navigator.platform
) => {
  if (!ua) return {};
  let y = ua.toLowerCase();
  let p = pf.toLowerCase();
  let result = {};
  result.mobile = !(!p.match('mac') && !p.match('win'));
  result.wxdebugger = -1 !== y.indexOf('wxdebugger');
  // result.isWechat = -1 !== y.indexOf('micromessenger');
  result.android = -1 !== y.indexOf('android');
  result.ios = -1 !== y.indexOf('iphone') || -1 !== y.indexOf('ipad');
  result.wechat = (function() {
    let e =
      y.match(/micromessenger\/(\d+\.\d+\.\d+)/) ||
      y.match(/micromessenger\/(\d+\.\d+)/);
    return e ? e[1] : null;
  })();
  return result;
};

export const parseUserAgentV3 = (e = navigator.userAgent) => {
  return {
    mobile: /AppleWebKit.*Mobile.*/i.test(e),
    ios: /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(e),
    android: /Android/i.test(e) || /Linux/i.test(e),
    windowsphone: /Windows Phone/i.test(e),
    iPhone: /iPhone/i.test(e),
    iPad: /iPad/i.test(e),
    webApp: !/Safari/i.test(e),
    MicroMessenger: /MicroMessenger/i.test(e),
    weibo: /Weibo/i.test(e),
    uc: /UCBrowser/i.test(e),
    qq: /MQQBrowser/i.test(e),
    baidu: /Baidu/i.test(e),
    mqq: /QQ\/([\d.]+)/i.test(e),
    mbaidu: /baiduboxapp/i.test(e),
    iqiyi: /iqiyi/i.test(e),
    QQLive: /QQLive/i.test(e),
    Safari: /Safari/i.test(e),
    Youku: /youku/i.test(e)
  };
};

export default parseUserAgent;
