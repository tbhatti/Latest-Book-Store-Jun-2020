import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './index.less'
import './node_modules/bootstrap/dist/css/bootstrap.min.css';
import {Route, Router, browserHistory} from 'react-router'

// main routes
import AppRoutes from './routes';

import store from './store';

ReactDOM.render(
	<Provider store={store}>
		<AppRoutes />
	</Provider>,
	document.getElementById('app')
)