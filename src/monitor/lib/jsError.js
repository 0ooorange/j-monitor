import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";
import tracker from "../utils/tracker";
export function injectJsError() {
  // 监听全局未捕获的错误
  window.addEventListener(
    "error",
    function (event) {
      // 错误事件对象
      let lastEvent = getLastEvent(); // 最后一个交互事件
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
    },
    true
  );
  function getLines(stack) {
    return stack
      .split("\n")
      .slice(1)
      .map((item) => item.split("at")[1].trim())
      .join("^");
  }
}
