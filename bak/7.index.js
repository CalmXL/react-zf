import React from './react';
import ReactDOM from './react-dom/client';

class RefComponent extends React.Component {
  /**
   * createRef 会返回一个对象， 类似于 { current: null }
   * 我们可以把此对象作为属性给 DOM 元素，然后当次 DOM 元素变成真实的 DOM 元素之后，这个真实的 DOM 元素会
   * 赋值给 current
   * ref 允许我们可以直接访问 DOM 元素
   */
  inputRef = React.createRef();

  handleClick = () => {
    // 通过此方法可以获得输入框的真实 DOM 元素，并让它获得焦点
    this.inputRef.current.focus();
  };

  render() {
    return (
      <div>
        <input
          ref={this.inputRef}
          type="text"
          placeholder="点击按钮让我获得焦点"
        />
        <button onClick={this.handleClick}>让输入框获得焦点</button>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RefComponent />);
