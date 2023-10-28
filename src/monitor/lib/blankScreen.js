import tracker from "../utils/tracker";
import onload from "../utils/onload";
export function blankScreen() {
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
    console.log(wrapperPoints);
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
    }
  });
}
