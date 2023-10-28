const userAgent = require('user-agent');
const host = 'cn-guangzhou.log.aliyuncs.com';
const project = 'tracking-monitor';
const logstoreName = 'tracking-monitor-store';
function getExtraData() {
  return {
    title: document.title,
    url: location.url,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).name,
    // ...
  }
}
class sendTracker {
  constructor() {
    this.url = `http://${project}.${host}/logstores/${logstoreName}/track`; // 请求路径
    this.xhr = new XMLHttpRequest;
  }
  send(data) {
    const extraData = getExtraData();
    let log = {...extraData, ...data};
    // 处理数字类型（阿里官方规定对象中的值不能是数字）
    for(const key in log) {
      if(typeof log[key] === 'number') {
        log[key] = '' + log[key];
      }
    }
    this.xhr.open('POST', this.url, true);
    const body = JSON.stringify({
      __source__: "source",
      __logs__: [log],
      __tags__: {}
    })
    console.log(JSON.parse(body));
    this.xhr.setRequestHeader('content-type', 'application/json'); // 请求体类型
    this.xhr.setRequestHeader('x-log-apiversion', '0.6.0'); // 版本号
    this.xhr.setRequestHeader('x-log-bodyrawsize', body.length); // 请求体大小
    this.xhr.onload = () => {
      console.log('tracker onload, response: ', this.xhr.response);
    }
    this.xhr.onerror = (err) => {
      console.log('tracker onerror, err: ', err);
    }
    this.xhr.send(body);
  }
}
export default new sendTracker();