import tracker from "../utils/tracker";
export function injectXHR() {
  let XMLHttpRequest = window.XMLHttpRequest; // 拿到XML对象
  let oldOpen = XMLHttpRequest.prototype.open; // 存储旧open
  XMLHttpRequest.prototype.open = function (method, url, async) {
    // 重写open
    if(!url.match(/logstores/) && !url.match(/sockjs/)) {
      this.logData = { method, url, async };
    }
    return oldOpen.apply(this, arguments);
  };
  let oldSend = XMLHttpRequest.prototype.send; // 存储旧send
  XMLHttpRequest.prototype.send = function (body) {
    // 重写send
    if (this.logData) {
      const startTime = Date.now(); // 在发送之前记录一下开始的时间
      const handler = (type) => (event) => {
        const duration = Date.now() - startTime; // 实际执行时间
        const status = this.status;
        const statusText = this.statusText;
        tracker.send({
          kind: "stability",
          type: "xhrError",
          eventType: type, // load、error、abort
          pathname: this.responseURL, // 请求路径
          status: status + "-" + statusText, // 状态码
          duration, // 持续时间
          response: this.response ? JSON.stringify(this.response) : "",
          params: body || "",
        });
      };
      this.addEventListener("load", handler("load"), false);
      this.addEventListener("error", handler("error"), false);
      this.addEventListener("abort", handler("abort"), false);
    }
    return oldSend.apply(this, arguments);
  };
}
