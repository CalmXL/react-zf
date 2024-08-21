/**
 * 创建 React 元素也就是虚拟DOM的工厂方法
 * @param {*} type DOM 的类型
 * @param {*} config 配置对象
 * @param {*} children 儿子们
 */
function createElement(type, config, children) {
  // 1. 创建 props 对象
  const props = { ...config };

  // 2. 如果参数数量大于三个，说明不止一个儿子
  if (arguments.length > 3) {
    props.children = Array.prototype.slice.call(arguments, 2);
  } else {
    props.children = children;
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
}

const React = {
  createElement,
  Component,
};

export default React;
