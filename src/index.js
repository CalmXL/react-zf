import React from './react';
import ReactDOM from './react-dom/client';

/**
 * React 类组件的生命周期:
 * 1. 挂载 mounting 挂载的钩子会在组件创建并插入到 DOM 之后调用
 *    constructor 组件的构造函数,最先被调用, 用于初始化组件状态
 *    ^componentWillMount 将要挂载, React 18 被废弃了
 *    render 计算将要渲染的虚拟 DOM, 不能调用 setState,不可以存在副作用
 *    componentDidMount 组件渲染到真实DOM 之后触发,
 *
 * 2. 更新 updating 当组件的属性或者状态发生改变时,会进入更新生命周期
 *    shouldComponentUpdate 根据组件的props和state的变化,返回一个布尔值来决定 React 是否需要重新渲染组件
 *    如果返回 true 就表示要更新, 如果返回了 false 则表示不更新,此处是性能优化的关键点
 *    componentWillUpdate 组件将要更新
 *    render 重新计算 虚拟 DOM
 *    componentDidUpdate 在更新之后立刻调用
 * 3. 卸载 unmounting
 */

class Counter extends React.Component {
  // 1. setup 初始化 props 和 state
  constructor(props) {
    super(props);
    this.state = { number: 0 };
    console.log('counter 1.constructor');
  }

  componentWillMount() {
    console.log('counter 2.componentWillMount');
  }

  componentDidMount() {
    console.log('counter 4.componentDidMount');
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('counter 5.shouldComponentUpdate');
    return nextState.number % 2 === 0;
  }

  componentWillUpdate() {
    console.log('counter 6.componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('counter 7.componentDidUpdate');
  }

  handleClick = () => {
    this.setState({
      number: this.state.number + 1,
    });
  };

  render() {
    console.log('counter 3.render');

    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Counter />);
