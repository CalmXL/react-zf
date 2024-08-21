/**
 * 创建 DOM 容器
 * @param {*} container
 */
function createRoot(container) {
  return {
    render(reactElement) {
      const domElement = renderElement(reactElement);
      console.log(domElement);

      container.appendChild(domElement);
    },
  };
}

/**
 * 把虚拟 DOM 变成真实 DOM
 * @param {*} element 虚拟DOM
 * @return 真实 DOM
 */
function renderElement(element) {
  // 如果此元素是一个数字或者字符串则创建文本节点
  if (typeof element === 'string' || typeof element === 'number') {
    return document.createTextNode(element);
  }

  const { type, props } = element;

  // 如果元素、虚拟DOM 的类型是一个函数的话
  if (typeof type === 'function') {
    if (type.isReactComponent) {
      // 类组件，把属性传递给类组件的构造函数，调用 render 方法返回要渲染的虚拟 DOM
      const ClassComponent = new type(props).render();
      // 把虚拟DOM 传递给 renderElement 返回真实 DOM
      return renderElement(ClassComponent);
    }
    // 把属性对象传入函数组件，返回一个 react 元素
    const functionElement = type(props);
    // 把函数组件返回的 react 元素传递给 renderElement, 创建真实 DOM
    return renderElement(functionElement);
  }

  // 根据 type 创建真实 DOM
  const domElement = document.createElement(type);

  Object.keys(props).forEach((name) => {
    if (name === 'children') {
      return;
    }

    if (name === 'style') {
      Object.assign(domElement.style, props.style);
    } else {
      domElement[name] = props[name];
    }
  });

  // 格式化 children 为数组
  const children = Array.isArray(props.children)
    ? props.children
    : [props.children];
  // console.log(children);

  children.forEach((child) => {
    // console.log(domElement, renderElement(child));

    // 把每个儿子都从虚拟  DOM 变成真实 DOM, 并插入到父节点里面
    console.log(domElement, renderElement(child));

    domElement.appendChild(renderElement(child));
  });

  return domElement;
}

const ReactDOM = {
  createRoot,
};

export default ReactDOM;
