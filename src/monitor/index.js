import { injectJsError } from "./lib/jsError";
import { injectXHR } from "./lib/xhr";
import { blankScreen } from "./lib/blankScreen";
import { timing } from "./lib/timing";
import { longTask } from "./lib/longTask";
injectJsError();
injectXHR();
blankScreen({
  skeletonProject: false,
  wrapperElements: ["html", "body", "#container"],
});
timing();
longTask();
