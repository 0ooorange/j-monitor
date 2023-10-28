export default function (callback) {
  // document 的加载状态：loading（正在加载）、interactive（可交互）、complete（完成）
  if (document.readyState === "complete") {
    callback();
  } else {
    window.addEventListener("load", callback);
  }
}
