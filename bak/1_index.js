// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
// 	<App />
// );

import React from './react';
import ReactDOM from './react-dom/client';

/**
 * 创建虚拟 DOM 的方法 createElement
 */
const elem = React.createElement(
	'div',
	{
		style: { color: 'pink' },
		className: 'container',
	},
	'hello',
	React.createElement(
		'span',
		{
			style: {
				color: 'orange',
			},
		},
		'world'
	)
);

let jsxElement = (
	<div style={{ color: 'pink' }} className='container'>
		hello
		<span style={{ color: 'orange' }}>world</span>
	</div>
)

// console.log(JSON.stringify(removePrivateProps(elem, ['key', 'ref']), null, 2));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(elem);
