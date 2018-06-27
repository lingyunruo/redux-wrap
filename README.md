## 说明

> 整合action和reducers，使每个项目只需要一个model.js文件就可以书写逻辑

## 用法

#### start({root<docEle>, component<ReactElement>, models<Object|Array>})
> 入口，创建store，renderdom，初始化store，

- root: dom节点，根节点
- component: react组件
- models: 数据model

#### connect(component<React Component>)
> 用法基本和react-redux的相同，只不过不需要传递mapstate和mapdispatch，默认全部传递

例子：
```javascript

import React from 'react';
import Home from '../container';

import {start} from '../../common/stores';

import model from '../model';

start({
	root: document.getElementById('root'),
	component: <Home />,
	model: [model]
});

```



models例子：
```javascript
export default {
	name: 'testPage',
	data: {
		name: 'lingyun',
		age: '18'
	},
	sync: {
		changeName: (state, payload) => {
			return {
				name: payload.name
			};
		}
	},
	async: {
		changeAge: (dispatch, getState, payload) => {
			setTimeout(() => {
				dispatch({
					type: 'changeName',
					payload: {
						name: payload.name
					}
				});
			}, 2000);
		}
	}
};

```
