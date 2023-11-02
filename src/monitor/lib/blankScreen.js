/**
 * 检测页面是否白屏
 * @param {function} callback - 回到函数获取检测结果
 * @param {boolean} skeletonProject - 页面是否有骨架屏
 * @param {array} whiteBoxElements - 容器列表，默认值为['html', 'body', '#app', '#root']
 */
import tracker from "../utils/tracker";
import onload from "../utils/onload";
export function blankScreen({ skeletonProject, wrapperElements }, times = 5) {
  let _wrapperNums = 0; // 轮询次数
  let _skeletonInitLists = []; // 初始列表
  let _skeletonCurrList = []; // 当前列表
  let _wrapperPoints = 0; // 采样点数
  
  if (skeletonProject) {
    if(document.readyState !== 'complete') sampling();
  } else {
    onload(sampling);
  }

  // 选中dom点的名称
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

  // 判断采样点是否为容器节点，是则空白采样点加一
  function isWrapper(element) {
    let selector = getSelector(element);
    // 存储采样点
    if(skeletonProject) _wrapperNums ? _skeletonCurrList.push(selector) : _skeletonInitLists(selector);
    // 采样点为容器节点，空白采样点数加一
    if (wrapperElements.includes(getSelector(element))) _wrapperPoints++;
  }

  // 采样对比
  function sampling() {
    _wrapperPoints = 0;
    for (let i = 0; i < 9; i++) {
      let xElements = document.elementsFromPoint((window.innerWidth / 10) * i, window.innerHeight / 2);
      let yElements = document.elementsFromPoint(window.innerWidth / 2, (window.innerHeight / 10) * i);
      // let LToptoRBottomElements = document.elementsFromPoint((window.innerWidth / 10) * i, (window.innerHeight / 10) * i);
      // let LBottomtoRTopElements = document.elementsFromPoint((window.innerWidth / 10) * (9 - i), (window.innerHeight / 10) * (9 - i));
      isWrapper(xElements[0]);
      isWrapper(yElements[0]);
      // isWrapper(LToptoRBottomElements[0]);
      // isWrapper(LBottomtoRTopElements[0]);
    }
    if (_wrapperPoints >= 18) {
      // 上报数据
      sendData();
      // 注册一个setInterval定时器
      if (!window._whiteLoopTimer) whiteLoop(times);
    } else {
      // 判断是否骨架屏是否白屏
      if(skeletonProject) {
        // 第一次不判断
        if(!_wrapperNums) return whiteLoop();
        // 判断初始采样点和当前采样点是否一致
        if(_skeletonInitLists.join() === _skeletonCurrList.join()) {
          // 上报数据
          sendData();
        }
      }
      // 采样点有元素，清空白屏轮询
      if (window._whiteLoopTimer) {
        clearTimeout(window._whiteLoopTimer);
        window._whiteLoopTimer = null;
      }
    }
  }

  // 上报数据
  function sendData() {
    let centerElements = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    tracker.send({
      kind: "stability", //大类
      type: "blank", //小类
      _wrapperPoints, //空白点
      screen: `${window.screen.width}*${window.screen.height}`, //分辨率
      viewPoint: `${window.innerWidth}*${window.innerHeight}`, //视口
      selector: getSelector(centerElements), //选择器
    });
  }

  // 开启白屏轮询
  function whiteLoop(times) { // times控制轮询次数
    if (window._whiteLoopTimer) return;
    window._whiteLoopTimer = setInterval(() => {
      // 控制白屏轮询结束点
      if (!times) {
        clearInterval(window._whiteLoopTimer);
        window._whiteLoopTimer = null;
        return;
      }
      if(skeletonProject) {
        _wrapperNums++;
        _skeletonCurrList = []; // 清空上一次骨架屏列表
      }
      sampling();
      times--;
    }, 2000);
  }
}
