import { REACT_TEXT } from '../constant';
import { isUndefiend, isDefined, wrapToArray } from '../util';
import { setupEventDelegation } from './event';

/**
 * 创建 DOM 容器
 * @param {*} container
 */
function createRoot(container) {
  return {
    render(rootVdom) {
      mountVdom(rootVdom, container);

      // 设置事件代理
      setupEventDelegation(container);
    },
  };
}

function mountVdom(rootVdom, container) {
  // 虚拟DOM -> 真实DOM
  const domElement = createDOMElement(rootVdom);
  if (!domElement) return;
  container.appendChild(domElement);
}

function createDOMElementFromTextComponent(vdom) {
  const { props } = vdom;
  return document.createTextNode(props);
}

function createDOMElementFromClassComponent(vdom) {
  const { type, props } = vdom;

  // 类组件，把属性传递给类组件的构造函数，调用 render 方法返回要渲染的虚拟 DOM
  const classInstance = new type(props).render();

  // 把虚拟DOM 传递给 createDOMElement 返回真实 DOM
  return createDOMElement(classInstance);
}

function createDOMElementFromFunctionComponent(vdom) {
  const { type, props } = vdom;
  // 把属性对象传入函数组件，返回一个 react 元素
  const renderVdom = type(props);
  // 把函数组件返回的 react 元素传递给 createDOMElement, 创建真实 DOM
  return createDOMElement(renderVdom);
}

function createDOMElementFromNativeComponent(vdom) {
  console.log(vdom);

  const { type, props } = vdom;

  // 先根据类型创建真实 DOM
  const domElement = document.createElement(type);
  // 根据属性更新 dom
  updateProps(domElement, {}, props);
  // 挂载子节点
  mountChildren(vdom, domElement);

  // 格式化 children 为数组

  return domElement;
}

function mountChildren(vdom, domElement) {
  const { props } = vdom;
  const children = wrapToArray(props?.children);
  children.forEach((childVdom) => {
    // 把每个儿子都从虚拟  DOM 变成真实 DOM, 并插入到父节点里面
    mountVdom(childVdom, domElement);
  });
}

/**
 * 根据属性更新dom
 * @param {*} domElement  真是 DOM
 * @param {*} oldProps    老属性
 * @param {*} newProps    新属性
 */
function updateProps(domElement, oldProps = {}, newProps) {
  console.log(domElement, newProps);

  Object.keys(newProps).forEach((name) => {
    if (name === 'children') {
      return;
    }

    if (name === 'style') {
      Object.assign(domElement.style, newProps.style);
    } else {
      // TODO 暂时不处理 事件
      domElement[name] = newProps[name];
    }
  });
}

/**
 * 把虚拟 DOM 变成真实 DOM
 * @param {*} element 虚拟DOM
 * @return 真实 DOM
 */
function createDOMElement(vdom) {
  if (isUndefiend(vdom)) return null;

  const { type, props } = vdom;

  // 虚拟dom 为文本
  if (type === REACT_TEXT) {
    return createDOMElementFromTextComponent(vdom);
  } else if (typeof type === 'function') {
    if (type.isReactComponent) {
      // 类组件
      return createDOMElementFromClassComponent(vdom);
    } else {
      // 函数组件
      return createDOMElementFromFunctionComponent(vdom);
    }
  } else {
    // 根据 type 创建真实 DOM
    return createDOMElementFromNativeComponent(vdom);
  }
}

const ReactDOM = {
  createRoot,
};

export default ReactDOM;
