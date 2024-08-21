

import React from 'react';
import ReactDOM from 'react-dom/client';

const names = ['A', 'B', 'C'];
const title = 'China'

let ul = (
	<ul>
		{
			names.forEach(element => {
				return (
					<li>{element}</li>
				)
			})
		}
	</ul>
)

// 如果想在 jsx 中使用变量可以使用表达式
// 还可以做为函数的参数, 函数的返回值
// 还可以进行循环迭代
let jsxElement = (
	<div style={{ color: 'pink' }} className='container'>
		hello {title}
		<span style={{ color: 'orange' }}>world</span>
	</div>
)

let jsxElement2 = jsxElement;




function functionComponent() {
	return <div></div>
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(jsxElement);
