import React from 'react'
import { Route, Redirect } from 'react-router-dom'
export default function PrivateRoute({ component: Component, ...rest }) {
    return <Route {...rest} render={(props) => (
        !rest.isAuth && !rest.isLoading
            ? <Redirect to='/login' />
            : <Component {...props} />
    )} />
}