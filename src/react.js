import { wrapToVdom } from './util';
import { createDOMElement, getDOMElementByVdom } from './react-dom/client';
import { REACT_FORWARD_REF } from './constant';

// 定义一个变量，用于控制当前是否处于批量更新模式
let isBatchingUpdates = false;
// 定义一个元素是唯一的集合, 有待更新的组件称为 dirtyComponent
const dirtyComponents = new Set();

/**
 * isBatchingUpdates 设置函数
 * @param {*} value
 */
export function setIsBatchingUpdates(value) {
  isBatchingUpdates = value;
}

/**
 * 更新脏组件
 */
export function flushDirtyComponents() {
  dirtyComponents.forEach((component) => {
    component.forceUpdate();
  });
  dirtyComponents.clear();
  isBatchingUpdates = false;
}

/**
 * 创建 React 元素也就是虚拟DOM的工厂方法
 * 该方法会由 babel 调用解析 jsx
 * @param {*} type DOM 的类型
 * @param {*} config 配置对象
 * @param {*} children 儿子们
 */
function createElement(type, config, children) {
  // 1. 创建 props 对象
  // const props = { ...config };
  const { ref, ...props } = config;

  // 2. 如果参数数量大于三个，说明不止一个儿子
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    // 没有儿子或者只有一个儿子
    props.children = wrapToVdom(children);
  }

  return {
    type,
    ref,
    props,
  };
}

// 在 ES6 中类其实是一个语法糖，本质上也还是一个函数
class Component {
  // 给类组件的类型添加一个静态属性
  static isReactComponent = true;

  constructor(props) {
    // 收到的属性对象保存在自己的实例上
    this.props = props;
    // 保存需要但是还没有生效的更新
    this.pendingStates = [];
  }

  setState(partialState, callback) {
    // 如果当前处于批量更新模式，则把当前的实例增加到脏组件集合中
    if (isBatchingUpdates) {
      dirtyComponents.add(this);
      // 把更新状态添加到待更新队列中
      this.pendingStates.push(partialState);
    } else {
      // 判断 partialState 函数执行,传入老状态
      const newState =
        typeof partialState === 'function'
          ? partialState(this.state)
          : partialState;
      // 合并新老状态
      this.state = {
        ...this.state,
        ...newState,
      };

      this.forceUpdate();
      // 在组件更新之后执行回调函数
      callback && callback();
    }
  }

  // 根据 this.pendingStates 计算更新状态
  accumulateState = () => {
    let state = this.pendingStates.reduce((state, partialState) => {
      // 判断 partialState 函数执行,传入老状态
      const newState =
        typeof partialState === 'function'
          ? partialState(this.state)
          : partialState;
      // 合并新老状态
      state = {
        ...this.state,
        ...newState,
      };
      return state;
    }, this.state);
    // 清空更新队列，返回新状态
    this.pendingStates.length = 0;

    return state;
  };

  forceUpdate() {
    // 在重新渲染之前，先更新最新的状态
    if (this.pendingStates.length !== 0) {
      this.state = this.accumulateState();
    }

    // 重新调用 render 方法,计算新的虚拟 DOM, 再创建新的真实DOM,替换老的
    const renderVdom = this.render();
    // 创建真实 DOM
    const newDOMElement = createDOMElement(renderVdom);

    // 替换掉老的真实 DOM, 需要老的 DOM 和 DOM 父节点
    // const oldDOMElement = this.oldRenderVdom.domElement;
    const oldDOMElement = getDOMElementByVdom(this.oldRenderVdom);

    // 获取父节点
    const parentDOM = oldDOMElement.parentNode;
    // 替换新节点
    parentDOM.replaceChild(newDOMElement, oldDOMElement);
    // 最后更新 oldRenderVdom
    this.oldRenderVdom = renderVdom;
  }
}

function createRef() {
  return {
    current: null,
  };
}

/**
 * 转发 ref, 可以实现 ref 的转发, 可以接收 ref, 并且转发
 * @param {*} render 组件的渲染函数
 */
function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render,
  };
}

const React = {
  Component,
  createElement,
  createRef,
  forwardRef,
};

export default React;
