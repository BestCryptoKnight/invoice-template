import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';

import createStore from './store';
import createRoutes from './routes';

const store = createStore()
const routes = createRoutes(store)
const MOUNT_NODE = document.getElementById('react-app')

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../style/theme.css';

import 'babel-polyfill';

ReactDOM.render(
    <div>
        <Provider store={store}>
            <div>
                <Router history={browserHistory}>
                    {routes}
                </Router>
            </div>
        </Provider>
    </div>,
    document.getElementById('react-app')
);