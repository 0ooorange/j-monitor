import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";
import tracker from "../utils/tracker";
export function longTask() {
  new PerformanceObserver((entryList) => {
    console.log("longTask: ", entryList.getEntries());
    entryList.getEntries().forEach(entry => {
      if(entry.duration > 100) {
        let lastEvent = getLastEvent();
        requestIdleCallback(() => {
          tracker.send({
            kind: "experience",
            type: "longTask",
            eventType: lastEvent.type,
            startTime: entry.startTime,
            duration: entry.duration,
            selector: lastEvent ? getSelector(lastEvent.target || (lastEvent.composedPath && lastEvent.composedPath())) : ""
          });
        })
      }
    })
  }).observe({ entryTypes: ["longtask"] });
}
