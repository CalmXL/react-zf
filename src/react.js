import { wrapToVdom } from './util';
import { createDOMElement, getDOMElementByVdom } from './react-dom/client';

/**
 * 创建 React 元素也就是虚拟DOM的工厂方法
 * @param {*} type DOM 的类型
 * @param {*} config 配置对象
 * @param {*} children 儿子们
 */
function createElement(type, config, children) {
  // console.log(type, config, children);

  // 1. 创建 props 对象
  const props = { ...config };

  // 2. 如果参数数量大于三个，说明不止一个儿子
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    // 没有儿子或者只有一个儿子
    props.children = wrapToVdom(children);
  }

  return {
    type,
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
  }

  setState(partialState, callback) {
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
    callback();
  }

  forceUpdate() {
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

const React = {
  createElement,
  Component,
};

export default React;
