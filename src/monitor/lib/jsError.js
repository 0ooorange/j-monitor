import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";
import tracker from "../utils/tracker";
export function injectJsError() {
  // 监听全局未捕获的错误
  window.addEventListener("error", function (event) {
    // 错误事件对象
    let lastEvent = getLastEvent(); // 最后一个交互事件
    if(event.target && (event.target.src || event.target.href)) { // 资源加载错误
      tracker.send({
        kind: "stability", // 监控指标的大类
        type: "error", // 小类型，这是一个错误
        errorType: "resourceError", // JS执行错误
        filename: event.target.src, // 报错文件
        tagName: event.target.nodeName, // SCRIPT
        selector: getSelector(event.target), // 代表最后一个操作元素
      })
    } else { // js执行错误
      tracker.send({
        kind: "stability", // 监控指标的大类
        type: "error", // 小类型，这是一个错误
        errorType: "jsError", // JS执行错误
        message: event.message, // 报错信息
        filename: event.filename, // 报错文件
        position: `${event.lineno}:${event.colno}`, // 报错位置
        stack: getLines(event.error.stack), // 报错元素
        selector: lastEvent
          ? getSelector(lastEvent.composedPath && lastEvent.composedPath())
          : "", // 代表最后一个操作元素
      });
    }
  }, true);

  // 监听全局promise错误
  window.addEventListener("unhandledrejection", function (event) {
    // 错误事件对象
        let lastEvent = getLastEvent(); // 最后一个交互事件
    let message = "", stack = "", reason = event.reason, filename = "", position = "";
    if (typeof reason === "string") { // 例如：当reject("error")时，reason为"error"，字符串类型
      message = reason;
      filename = event.target.origin;
    } else if (typeof reason === "object") { // 例如：当执行语句发生错误时，reason为一个对象
      message = reason.message;
      if (reason.stack) {
        /* 以/at/开头，后面跟着一个或多个空格，然后是一个或多个任意字符（除了换行符），接着是一个冒号，
           然后是一个或多个数字，再接着是一个冒号，最后是一个或多个数字。*/
        const matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
        filename = matchResult[1];
        position = `${matchResult[2]}:${matchResult[3]}`;
      }
      stack = getLines(reason.stack);
    }
    tracker.send({
      kind: "stability", // 监控指标的大类
      type: "error", // 小类型，这是一个错误
      errorType: "promiseError", // JS执行错误
      message, // 报错信息
      filename, // 报错文件
      position, // 报错位置
      stack, // 报错元素
      selector: lastEvent ? getSelector(lastEvent.target) : "", // 代表最后一个操作元素
    });
  }, true);
  function getLines(stack) {
    return stack
      .split("\n")
      .slice(1)
      .map((item) => item.split("at")[1].trim())
      .join("^");
  }
}
