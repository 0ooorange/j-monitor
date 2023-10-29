import tracker from "../utils/tracker";
import onload from "../utils/onload";
export function timing() {
  onload(() => {
    setTimeout(() => {
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
        loadEventEnd
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
    }, 3000);
  });
}
