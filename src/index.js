import React from './react';
import ReactDOM from './react-dom/client';

/**
 * React.forwardRef 允许你将 ref 从父组件传递子组件
 */

function ChildComponent(props, forwardRef) {
  return <input ref={forwardRef} />;
}

// 可以把函数组件传递给 forwardRef, 它会返回新组建,可以接收 ref
// 在你需要再子组件内部访问 dom 节点时使用
// forwardRef 可以接收一个函数的渲染函数,返回一个新组件, 该函数可以接收 ref
const ForwardComponent = React.forwardRef(ChildComponent);
console.log(ForwardComponent);
/**
 * $$typeof: Symbol(react.forward_ref)
 * render: ƒ ChildComponent(props, forwardRef)
 */

class ParentComponent extends React.Component {
  // Warning: Function components cannot be given refs. 不能给函数组件传递 refs
  // Attempts to access this ref will fail. 尝试访问此 ref 将会失败
  // Did you mean to use React.forwardRef()? 你是否意味使用 forwardRef
  inputRef = React.createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  };

  render() {
    return (
      <div>
        <ForwardComponent ref={this.inputRef} />
        <button onClick={this.handleClick}>focus</button>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ParentComponent />);
