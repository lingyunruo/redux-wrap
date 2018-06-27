
import React from 'react';
import ReactDom from 'react-dom';

import {
	createStore,
	applyMiddleware,
	combineReducers
} from 'redux';

import reduxAsync from './redux-async';

import {
	Provider
} from 'react-redux';


function start({root, component, model}) {

	let models = {};
	let modelType = Object.prototype.toString.call(model);

	if(modelType === '[object Array]') {
		model.map((item) => {
			models[item.name] = item
		});
	}
	else if(modelType === '[object Object]') {
		models = {
			[model.name]: model
		};
	}


	let reducers = {};
	let asyncMethods = {};

	Object.keys(models).map((item) => {
		asyncMethods[item] = models[item].async;

		reducers[item] = (state = models[item].data, action) => {
			let actionType = action.type;
			let ifHasPlaceName = actionType.indexOf('/') >= 0 && actionType.indexOf('@redux') < 0;
			let fieldName = actionType.split('/')[0];
			let methodName = actionType.split('/')[1];

			let syncMethod = null;

			if(ifHasPlaceName) {
				syncMethod = models[fieldName].sync[methodName];
			}
			else {
				syncMethod = (typeof models[item] === 'object' && models[item] !== null)
					? models[item].sync[action.type]
					: null;
			}

			if(syncMethod) {
				return syncMethod(state, action.payload);
			}
			else {
				return state;
			}
		}
	});

	const store = createStore(combineReducers(reducers), applyMiddleware(reduxAsync(asyncMethods)));

	const Wrapper = () => {
		return (
			<Provider store={store}>
				{component}
			</Provider>
		);
	};


	ReactDom.render(<Wrapper/>, root);

}


export default start;
