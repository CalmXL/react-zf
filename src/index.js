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
 * 2. 更新 updating
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
    console.log('counter 2. componentWillMount');
  }

  componentDidMount() {
    console.log('counter 4. componentDidMount');
  }

  handleClick = () => {
    this.setState({
      number: this.state.number + 1,
    });
  };

  render() {
    console.log('counter 3. render');

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
