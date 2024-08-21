import React from './react';
import ReactDOM from './react-dom/client';

/**
 * 函数组件就是一个函数, 可以返回一个虚拟 DOM
 * @params props 代表传递给此组件的属性对象
 */

function FuncComponent(props) {
  return (
    <div>
      hello {props.name} {props.age}
    </div>
  );
}

// JSX 写法
// const element = <FuncComponent name="xl" age={18} />;

// 普通的JS 写法
// 其实 最终在 JSX 在 webpack 打包边界的时候回使用 babel 转义成普通的 js
// babel 负责把 name="xl" age={18} 转成 props 对象并传递给 props
// const element2 = React.createElement(FuncComponent, { name: 'xh', age: 21 });

// * 类组件
/**
 * 定义一个了类组件继承自父类 React.Component
 * 定义的一个类组件必须编写一个名为 render 的函数，负责返回要渲染的虚拟DOM
 */
class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    // 内部会把收到的属性对象，放在自己的实例上，以后可以通过 this.props 访问
  }

  render() {
    return (
      <div>
        hello {this.props.name} {this.props.age}
      </div>
    );
  }
}
// babel 会把属性收集起来编程一个 props 属性对象，并传递给类组件的构造函数
const element = <ClassComponent name="xulei" age={18} />;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(element);
