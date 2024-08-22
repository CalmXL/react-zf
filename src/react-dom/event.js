// 定义一个事件类型的方法字典
const eventTypeMethods = {
  click: {
    capture: 'onClickCapture',
    bubble: 'onClick',
  },
};

// 阶段
const phases = ['capture', 'bubble'];

/**
 * 设置事件委托,把所有的事件都绑到容器 container 上
 * @param {*} container root 根节点
 */
export function setupEventDelegation(container) {
  // 遍历所有事件
  Reflect.ownKeys(eventTypeMethods).forEach((eventType) => {
    // 遍历两个阶段
    phases.forEach((phase) => {
      // 给容器添加监听函数 eventType 事件名称 click
      // nativeEvent 原生事件对象
      container.addEventListener(
        eventType,
        (nativeEvent) => {
          // 要模拟事件的传播的顺序, 事件传递路径上的所有 DOM 元素上绑定 React 事件取出来顺序执行
          // composedPath() 是 Event 接口的一个方法，当对象数组调用该侦听器时返回事件路径。
          const composedPath = nativeEvent.composedPath();
          // 因为模拟冒泡和模拟捕获顺序是相反的
          // 因为数组的顺序是子向父,从内到外,其实是冒泡的顺序,如果是在捕获阶段执行,需要倒序
          const elements =
            phase === 'capture' ? composedPath.reverse() : composedPath;

          // 遍历所有的 DOM 元素,执行它身上的 React 事件监听函数
          // 拼出来方法名 onClick onClickCapture
          const methodName = eventTypeMethods[eventType][phase];
          for (let element of elements) {
            // 如果此 dom 节点上绑定有回调函数, 则执行它
            element.reactEvents?.[methodName]?.(nativeEvent);
          }
        },
        phase === 'capture'
      );
    });
  });
}
