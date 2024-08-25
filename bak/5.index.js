import React from './react';
import ReactDOM from './react-dom/client';

function ChildCounter(props) {
  return (
    <button onClick={props.handleClick}>
      {props.title}
      {props.number}
    </button>
  );
}

class Counter extends React.Component {
  constructor(props) {
    super(props);

    // 在组件里定义状态, 状态可以通过组件的 setState 方法进行更新
    // 构造函数是唯一可以给类组件定义状态的地方
    this.state = {
      number: 0,
      title: '计数器',
    };
  }

  handleClick = () => {
    // 组件更新的时候只需要传递变更的属性即可,不需要变更的属性,不需要传递,会保留原来的值
    // this.setState({
    //   number: this.state.number + 1,
    // });

    // setState 参数可以是一个对象,也可以是一个函数,
    this.setState(
      (prevState) => ({
        number: prevState.number + 1,
      }),
      () => {
        console.log('State updated!', this.state.number);
      }
    );
  };

  render() {
    // return (
    //   <button onClick={this.handleClick}>
    //     {this.state.title}
    //     {this.state.number}
    //   </button>
    // );
    return (
      <ChildCounter
        handleClick={this.handleClick}
        title={this.state.title}
        number={this.state.number}
      />
    );
  }
}

const element = <Counter />;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(element);
