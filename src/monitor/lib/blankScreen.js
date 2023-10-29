import tracker from "../utils/tracker";
import onload from "../utils/onload";
export function blankScreen(times = 0) { // 轮询次数
  let wrapperElements = ["html", "body", "#container"];
  let wrapperPoints = 0;
  function getSelector(element) {
    if (element.id) {
      return "#" + element.id;
    } else if (element.className) {
      // return "." + element.className.split(/ +/).join('.'); // 正则
      return (
        "." +
        element.className
          .split(" ")
          .filter((item) => !!item)
          .join(".")
      );
    } else {
      return element.nodeName.toLowerCase();
    }
  }
  function isWrapper(element) {
    if (wrapperElements.includes(getSelector(element))) wrapperPoints++;
  }
  onload(function () {
    for (let i = 0; i < 9; i++) {
      let xElements = document.elementsFromPoint(
        (window.innerWidth / 10) * i,
        window.innerHeight / 2
      );
      let yElements = document.elementsFromPoint(
        window.innerWidth / 2,
        (window.innerHeight / 10) * i
      );
      // let LToptoRBottomElements = document.elementsFromPoint(
      //   (window.innerWidth / 10) * i,
      //   (window.innerHeight / 10) * i
      // );
      // let LBottomtoRTopElements = document.elementsFromPoint(
      //   (window.innerWidth / 10) * (9 - i),
      //   (window.innerHeight / 10) * (9 - i)
      // );
      isWrapper(xElements[0]);
      isWrapper(yElements[0]);
      // isWrapper(LToptoRBottomElements[0]);
      // isWrapper(LBottomtoRTopElements[0]);
    }
    if (wrapperPoints >= 18) {
      let centerElements = document.elementFromPoint(
        window.innerWidth / 2,
        window.innerHeight / 2
      );
      tracker.send({
        kind: "stability", //大类
        type: "blank", //小类
        wrapperPoints, //空白点
        screen: `${window.screen.width}*${window.screen.height}`, //分辨率
        viewPoint: `${window.innerWidth}*${window.innerHeight}`, //视口
        selector: getSelector(centerElements), //选择器
      });
      // 每次都注册一个新的setInterval定时器
      if (!window.whiteLoopTimer || times !== 0) whiteLoop(times);
    } else {
      // 采样点有元素，清空白屏轮询
      if (window.whiteLoopTimer) {
        clearTimeout(window.whiteLoopTimer);
        window.whiteLoopTimer = null;
      }
    }
  });
  function whiteLoop(times) {
    if (window.whiteLoopTimer) { // 先清空再注册
      clearTimeout(window.whiteLoopTimer);
      window.whiteLoopTimer = null;
    }
    if (times <= 5) { // times控制轮询次数不超过10s(6次)；检测时间点：0s、2s、4s、6s、8s、10s
      window.whiteLoopTimer = setInterval(() => {
        blankScreen(++times);
      }, 2000);
    }
  }
}
