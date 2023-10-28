function getSelector(pathArr) {
  return pathArr.reverse().filter(item => {
    return item !== document && item !== window
  }).map(element => {
    let selector = '';
    if(element.id) {
      selector = `${element.nodeName.toLowerCase()}#${element.id}`;
    } else if(element.className && typeof element.className === 'string') {
      selector = `${element.nodeName.toLowerCase()}#${element.className}`;
    } else {
      selector = `${element.nodeName.toLowerCase()}`;
    }
    return selector;
  }).join(' ')
}
export default function(pathsOrTarget) {
  if(Array.isArray(pathsOrTarget)) {
    return getSelector(pathsOrTarget);
  } else { // 可能是一个target对象
    let path = [];
    while(pathsOrTarget) {
      path.push(pathsOrTarget);
      pathsOrTarget = pathsOrTarget.parentNode;
    }
    return getSelector(path);
  }
}