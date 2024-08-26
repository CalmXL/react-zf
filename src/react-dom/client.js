import { REACT_FORWARD_REF, REACT_TEXT } from '../constant';
import { isUndefiend, isDefined, wrapToArray } from '../util';
import { setupEventDelegation } from './event';

/**
 * 创建 DOM 容器
 * @param {*} container
 * @returns 返回一个 render 方法用于绑定视图
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

/**
 *
 * @param {*} rootVdom 虚拟 dom
 * @param {*} container 根容器
 * @returns
 */
function mountVdom(rootVdom, container) {
  // 虚拟DOM -> 真实DOM
  const domElement = createDOMElement(rootVdom);
  if (!domElement) return;
  // 将真实虚拟dom转换为真实DOM， 挂载到 根容器上
  container.appendChild(domElement);
  // 此时 dom 元素已经挂载完毕
  domElement.componentDidMount?.();
}

/**
 * 创建文本节点
 * @param {*} vdom
 * @returns
 */
function createDOMElementFromTextComponent(vdom) {
  const { props } = vdom;
  return document.createTextNode(props);
}

/**
 * 类组件 -> dom
 * @param {*} vdom
 * @returns dom
 */
function createDOMElementFromClassComponent(vdom) {
  const { type, props, ref } = vdom;
  // 类组件，把属性传递给类组件的构造函数，
  const classInstance = new type(props);
  // 组件将要挂载
  classInstance.componentWillMount?.();
  // 根据类组件的定义创建类组件的实例后
  if (ref) ref.current = classInstance;
  // 让类组件的虚拟DOM的 classInstance
  vdom.classInstance = classInstance;
  // 调用实例上的 render 方法返回要渲染的虚拟 DOM
  const renderVdom = classInstance.render();
  // 让类的实例的 oldRenderVdom 属性指向它调用的renderVdom
  classInstance.oldRenderVdom = renderVdom;
  // 把虚拟DOM 传递给 createDOMElement 返回真实 DOM
  // 此处只是生成得到真实 DOM, 但此时真实 DOM还没有挂载到页面中, 还没挂载到父节点
  const domElement = createDOMElement(renderVdom);
  // 不确定 DOM 元素什么时候插入,因此先暂存在 DOM 元素上,等真正挂载完毕
  if (classInstance.componentDidMount) {
    domElement.componentDidMount = classInstance.componentDidMount;
  }
  return domElement;
}

/**
 * 函数组件 -> dom
 * @param {*} vdom
 * @returns
 */
function createDOMElementFromFunctionComponent(vdom) {
  const { type, props } = vdom;
  // 把属性对象传入函数组件，返回一个 react 元素
  const renderVdom = type(props);
  // 在获取到函数组件的返回的虚拟 DOM 之后,记录一下
  // 让当前的函数组件的虚拟 dom 的 oldRenderVdom
  vdom.oldRenderVdom = renderVdom;
  // 把函数组件返回的 react 元素传递给 createDOMElement, 创建真实 DOM
  return createDOMElement(renderVdom);
}

/**
 * 处理 React.forwardRef 包裹的组件
 * @param {*} vdom
 * @returns
 */
function createReactForwardDOMElement(vdom) {
  // type = {$$typeof, render} render 其实就是分发的函数组件
  const { type, props, ref } = vdom;
  // 把自己接收的属性和 ref 作为参数传递
  const renderVdom = type.render(props, ref);

  vdom.oldRenderVdom = renderVdom;
  return createDOMElement(renderVdom);
}

/**
 * 创建真实DOM,并挂载属性和子节点
 * @param {*} vdom
 * @returns
 */
function createDOMElementFromNativeComponent(vdom) {
  const { type, props, ref } = vdom;

  // 先根据类型创建真实 DOM
  const domElement = document.createElement(type);
  // 如果 ref 有值的话，把真实的 DOM 元素赋给 ref.current
  if (ref) ref.current = domElement;
  // 根据属性更新 dom
  updateProps(domElement, {}, props);
  // 挂载子节点
  mountChildren(vdom, domElement);

  vdom.domElement = domElement;
  return domElement;
}

/**
 * 挂载子节点
 * @param {*} vdom
 * @param {*} domElement
 */
function mountChildren(vdom, domElement) {
  const { props } = vdom;
  const children = wrapToArray(props?.children);
  children.forEach((childVdom) => {
    // 把每个儿子都从虚拟 DOM 变成真实 DOM, 并插入到父节点里面
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
  Object.keys(newProps).forEach((name) => {
    if (name === 'children') {
      return;
    }

    if (name === 'style') {
      Object.assign(domElement.style, newProps.style);
    } else if (name.startsWith('on')) {
      // 我们在 domElement 添加一个自定义属性 reactEvents 用来存放 React 事件回调
      if (isUndefiend(domElement.reactEvents)) {
        domElement.reactEvents = {};
      }
      // domElement.reactEvents[onClick] => 对应监听函数
      // domElement.reactEvents[onClickCapture] =>
      domElement.reactEvents[name] = newProps[name];
    } else {
      domElement[name] = newProps[name];
    }
  });
}

/**
 * 把虚拟 DOM 变成真实 DOM
 * @param {*} element 虚拟DOM
 * @return 真实 DOM
 */
export function createDOMElement(vdom) {
  if (isUndefiend(vdom)) return null;
  const { type, props } = vdom;

  // 虚拟dom 为文本
  if (type === REACT_TEXT) {
    return createDOMElementFromTextComponent(vdom);
  } else if (type.$$typeof === REACT_FORWARD_REF) {
    // 转发的函数组件
    return createReactForwardDOMElement(vdom);
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

/**
 * 获取虚拟DOM对应的真实DOM
 * @param {*} vdom
 */
export function getDOMElementByVdom(vdom) {
  if (isUndefiend(vdom)) return null;

  let { type } = vdom;

  // 如果虚拟 DOM 的类型 type 是函数
  if (typeof type === 'function') {
    // 如果是类组件的话 (递归处理)
    if (type.isReactComponent) {
      return getDOMElementByVdom(vdom.classInstance.oldRenderVdom);
    } else {
      // 函数组件
      return getDOMElementByVdom(vdom.oldRenderVdom);
    }
  } else {
    // 原生 dom 节点 可以直接获取属性
    return vdom.domElement;
  }
}

const ReactDOM = {
  createRoot,
};

export default ReactDOM;
