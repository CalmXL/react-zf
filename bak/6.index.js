import React from './react';
import ReactDOM from './react-dom/client'; // React18 写法
// import ReactDOM from './react-dom'; // React17 版本

class Counter extends React.Component {
  state = { number: 0 }; // 可以直接在这里定义状态，而不需要使用构造函数

  handleClick = () => {
    // 如果你在一个事件处理器中多次调用 setState, React 可能会将它们合并成一个单元更新，以提高性能
    this.setState({ number: this.state.number + 1 });
    console.log(this.state);
    this.setState({ number: this.state.number + 1 });
    console.log(this.state);
    // 最后等事件处理器执行完成后才进行实际的更新

    // 在 setTimeout 中是同步更新的，非批量更新的
    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state);
      this.setState({ number: this.state.number + 1 });
      console.log(this.state);
    });
  };

  render() {
    return <button onClick={this.handleClick}>{this.state.number}</button>;
  }
}

// console.log(ReactDOM);

// ReactDOM.render(<Counter />, document.getElementById('root'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Counter />);

/**
 * React 17 的
 * 在事件处理器中，生命周期函数中等 React 能够管理到的地方，setState 都是异步的
 * 在其他地方，React 无法管理的地方，setState 都是同步的
 *
 * React18 不管在什么地方 setState 都是批量的
 */
