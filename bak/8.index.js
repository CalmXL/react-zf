import React from './react';
import ReactDOM from './react-dom/client';

class ChildComponent extends React.Component {
  alertMessage = () => {
    alert(`Hello from ChildComponent`);
  };

  render() {
    return <div>ChildComponent</div>;
  }
}

class ParentComponent extends React.Component {
  childRef = React.createRef();

  handleClick = () => {
    // 通过 this.childRef.current 获取类组件的实例
    this.childRef.current.alertMessage();
  };

  render() {
    return (
      <div>
        <ChildComponent ref={this.childRef} />
        <button onClick={this.handleClick}>调用子组件身上的实例方法</button>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ParentComponent />);
