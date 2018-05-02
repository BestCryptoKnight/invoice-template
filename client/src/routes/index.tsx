import * as React from 'react'
import { Route, IndexRoute } from 'react-router'
import {Layout} from "../components/layout/Layout";
import {Dashboard} from '../components/Dashboard/Dashboard';

export default (store) => {
    return (
        <Route path="" component={Layout}>
            <Route path="/" component={Dashboard} />
        </Route>
    )
}
