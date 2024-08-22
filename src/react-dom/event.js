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
      container.addEventListener(
        eventType,
        (nativeEvent) => {
          // 要模拟事件的传播的顺序,事件传递路径上的所有 DOM 元素上绑定 React 事件取出来顺序执行
        },
        phase === 'capture'
      );
    });
  });
}
