import { setIsBatchingUpdates, flushDirtyComponents } from '../react';

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
 * 根据原生事件对象创建合成事件对象
 * @param {*} nativeEvent
 */
function createSyntheticEvent(nativeEvent) {
  // 表示当前的事件是否阻止冒泡
  let isPropagationStopped = false;
  // 是否取消默认行为
  let isDefaultPrevented = false;

  const handler = {
    get(target, key) {
      // 如果此属性是 target 自己定义的属性,则返回重写后的方法和属性
      if (target.hasOwnProperty(key)) {
        return Reflect.get(target, key);
      } else {
        const value = Reflect.get(nativeEvent, key);
        // 如果函数的话绑定 this, 保证函数 this 指向 nativeEvent
        return typeof value === 'function' ? value.bind(nativeEvent) : value;
      }
    },
  };

  const target = {
    nativeEvent,
    preventDefault() {
      if (nativeEvent.preventDefault) {
        // 标准浏览器
        nativeEvent.preventDefault();
      } else {
        // IE
        nativeEvent.returnValue = false;
      }
      isDefaultPrevented = true;
    },
    stopPropagation() {
      if (nativeEvent.stopPropagation) {
        nativeEvent.stopPropagation();
      } else {
        nativeEvent.cancelBubble = true;
      }
      isPropagationStopped = true;
    },
    isDefaultPrevented() {
      return isDefaultPrevented;
    },
    isPropagationStopped() {
      return isPropagationStopped;
    },
  };

  // 可以根据原生事件创建代理对象
  const syntheticEvent = new Proxy(target, handler);

  return syntheticEvent;
}

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
          // 根据原生事件创建合成事件
          const syntheticEvent = createSyntheticEvent(nativeEvent);
          // 要模拟事件的传播的顺序, 事件传递路径上的所有 DOM 元素上绑定 React 事件取出来顺序执行
          // composedPath() 是 Event 接口的一个方法，当对象数组调用该侦听器时返回事件路径。
          const composedPath = syntheticEvent.composedPath();
          // 因为模拟冒泡和模拟捕获顺序是相反的
          // 因为数组的顺序是子向父,从内到外,其实是冒泡的顺序,如果是在捕获阶段执行,需要倒序
          const elements =
            phase === 'capture' ? composedPath.reverse() : composedPath;

          // 遍历所有的 DOM 元素,执行它身上的 React 事件监听函数
          // 拼出来方法名 onClick onClickCapture
          const methodName = eventTypeMethods[eventType][phase];

          // 在执行事件处理器之前先把批量更新打开
          setIsBatchingUpdates(true);

          for (let element of elements) {
            // 如果某个方法执行的时候, 已经调用 stopPropagation() 则阻止
            if (syntheticEvent.isPropagationStopped()) {
              break;
            }
            // 如果此 dom 节点上绑定有回调函数, 则执行它
            element.reactEvents?.[methodName]?.(syntheticEvent);
          }

          // 等事件处理器完成之后，进行实际的更新
          flushDirtyComponents();
        },
        phase === 'capture'
      );
    });
  });
}
