import tracker from "../utils/tracker";
import onload from "../utils/onload";
import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";
export function timing() {
  // 性能指标
  let FMP, LCP;
  if (PerformanceObserver) {
    // ----观察页面中有意义的元素
    new PerformanceObserver((entryList, observer) => {
      FMP = entryList.getEntries()[0];
      observer.disconnect(); // 不再观察
    }).observe({ entryTypes: ["element"] }); 

    // ----观察页面中最大的元素
    new PerformanceObserver((entryList, observer) => {
      LCP = entryList.getEntries()[0];
      observer.disconnect(); // 不再观察
    }).observe({ entryTypes: ["largest-contentful-paint"] }); 

     // ----观察页面中第一次交互FID
    new PerformanceObserver((entryList, observer) => {
      let lastEvent = getLastEvent();
      let firstInput = entryList.getEntries()[0];
      console.log(lastEvent);
      if (firstInput) {
        // processingStart开始处理的时间，startTime开始点击的时间，差值就是处理的延迟
        let inputDelay = firstInput.processingStart - firstInput.startTime;
        let duration = firstInput.duration; // 处理的耗时
        if (inputDelay > 0 || duration > 0) {
          tracker.send({
            kind: "experience",
            type: "firstInputDelay", // 首次输入延迟
            inputDelay, // 延迟的时长
            duration, // 处理时间
            startTime: firstInput.startTime,
            selector: lastEvent
              ? getSelector(lastEvent.target || (lastEvent.composedPath && lastEvent.composedPath()))
              : "",
          });
        }
      }
      observer.disconnect();
    }).observe({ type: "first-input", buffered: true });
  }
  onload(() => {
    setTimeout(() => {
      /* 用户体验指标监控代码开始 */
      const {
        fetchStart,
        connectStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        loadEventStart,
        loadEventEnd,
      } = performance.getEntries()[0];
      tracker.send({
        kind: "experience", // 用户体验指标
        type: "timing", // 统计每个阶段的时间
        connectTime: connectEnd - connectStart, // 网络连接时间
        ttfbTime: responseStart - requestStart, // 首字节到达时间
        responseTime: responseEnd - responseStart, // 响应的读取时间
        parseDOMTime: loadEventStart - domInteractive, // DOM解析的时间
        domContentLoadedEventTime:
          domContentLoadedEventEnd - domContentLoadedEventStart, // domContentLoaded事件加载的时间
        timeToInteractive: domInteractive - fetchStart, // 首次可交互的时间
        loadTime: loadEventEnd - fetchStart, // 完整加载时间
      });
      /* 用户体验指标监控代码结束 */

      /* 性能指标监控开始 */
      // ----页面中第一次绘制
      let FP = performance.getEntriesByName("first-paint")[0];
      // ----页面中第一次内容绘制
      let FCP = performance.getEntriesByName("first-contentful-paint")[0];
      tracker.send({
        kind: "experience",
        type: "paint", // 统计每个阶段的时间
        firstPaint: FP.startTime,
        firstContentfulPaint: FCP.startTime,
        firstMeaningfulPaint: FMP.startTime,
        largestContentfulPaint: LCP.startTime,
      });
      /* 性能指标监控结束 */
    }, 3000);
  });
}
