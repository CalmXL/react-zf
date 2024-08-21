import React from './react';
import ReactDOM from './react-dom/client';

class ClassComponent extends React.Component {
  parentBubble() {
    console.log('react 父节点在冒泡阶段执行');
  }

  childBubble() {
    console.log('react 子节点在冒泡阶段执行');
  }

  parentCapture() {
    console.log('react 父节点在捕获阶段执行');
  }

  childCapture() {
    console.log('react 子节点在捕获阶段执行');
  }

  render() {
    return (
      <div
        id="parent"
        onClick={this.parentBubble}
        onClickCapture={this.parentCapture}>
        <button
          id="child"
          onClick={this.childBubble}
          onClickCapture={this.childCapture}>
          click
        </button>
      </div>
    );
  }
}

const element = <ClassComponent />;
console.log(element);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(element);

setTimeout(() => {
  document.getElementById('root').addEventListener(
    'click',
    () => {
      console.log('Native root捕获');
    },
    true
  );
  document.getElementById('root').addEventListener(
    'click',
    () => {
      console.log('Native root冒泡');
    },
    false
  );
  document.getElementById('parent').addEventListener(
    'click',
    () => {
      console.log('Native父亲捕获');
    },
    true
  );
  document.getElementById('parent').addEventListener(
    'click',
    () => {
      console.log('Native父亲冒泡');
    },
    false
  );
  document.getElementById('child').addEventListener(
    'click',
    () => {
      console.log('Native儿子捕获');
    },
    true
  );
  document.getElementById('child').addEventListener(
    'click',
    () => {
      console.log('Native儿子冒泡');
    },
    false
  );
}, 2000);

/**
 * * 执行顺序:
 * & React捕获 -> 原生捕获 -> 原生冒泡 -> React 冒泡
 */
// parent Bubble, 父节点在捕获阶段执行
// child bubble 子节点在捕获阶段执行
// Native parentCapture 原生父亲捕获
// Native childCapture 原生儿子捕获
// Native childBubble 原生儿子冒泡
// Native parentBubble 原生父亲冒泡
// child bubble 子节点在冒泡阶段执行
// parent Bubble, 父节点在冒泡阶段执行
