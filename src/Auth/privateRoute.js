import React from 'react'
import { Route, Redirect } from 'react-router-dom'
export default function PrivateRoute({ component: Component, ...rest }) {
    return <Route {...rest} render={(props) => (
        rest.permissions.includes(false) && !rest.isLoading
            ? <Redirect to={`/${rest.redirectTo || 'login'}`} />
            : <Component {...props} />
    )} />
}