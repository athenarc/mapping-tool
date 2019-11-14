import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Spinner from './Spinner'

export default function PrivateRoute({ component: Component, isLoading, ...rest }) {
    return <Route {...rest} render={(props) => {
        if (isLoading) return <Spinner isFullScreen={true} />
        return rest.permissions.includes(false)
            ? <Redirect to={`/${rest.redirectTo || 'login'}`} />
            : <Component {...props} />
    }} />
}
