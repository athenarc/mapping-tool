import React, { useState, useEffect } from 'react';
import './App.css';
import { Navbar, Container, Dropdown, SplitButton } from 'react-bootstrap'
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Mappings from './Componetns/Mappings'
import EditMappings from './Componetns/Mappings/EditMappings'
import NotFound from './Componetns/NotFount'
import Login from './Componetns/Login/Login'
import Register from './Componetns/Login/Register'
import { fetchData, addToast, postData, requestAccess, getUser } from './Utils';
import { ENDPOINT } from './config'
import * as Resourses from './Resources'
import PrivateRoute from './Auth/privateRoute';
const md5 = require('md5');


function App(props) {

  const [isLoading, setIsLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [mappings, setMappings] = useState([])
  const [isLoadingMappings, setIsLoadingMappings] = useState(false)

  useEffect(() => {
    postData(ENDPOINT.AUTH.STATUS, [], false, false)
      .then(() => {
        setIsAuth(true)
        setIsLoading(false)
        loadMappings()
        setUser(getUser())
      })
      .catch(() => {
        setIsAuth(false)
        setIsLoading(false)
      })
  }, [isAuth])

  const loadMappings = () => {
    setIsLoadingMappings(true)
    fetchData(ENDPOINT.MAPPINGS)
      .then(mappings => {
        setMappings(mappings)
        setIsLoadingMappings(false)
      })
      .catch(() => {
        addToast('Failed to load mappings', Resourses.TOAST.ERROR)
        setIsLoadingMappings(false)
      })
  }

  const updateMappings = (mapping) => {
    setMappings([...mappings, mapping])
  }

  const logout = () => {
    postData(ENDPOINT.AUTH.LOGOUT, [], false, false)
      .then(() => setIsAuth(false))
      .catch(() => addToast('Failed to logout', Resourses.TOAST.ERROR))
  }

  const login = (email, password) => {
    const hash = md5(password)
    const credentials = `${email}:${hash}`
    requestAccess(ENDPOINT.AUTH.LOGIN, [], credentials)
      .then(credentials => {
        localStorage.setItem('europeana_mapping_credentials', JSON.stringify(credentials));
        setIsAuth(true)
        setIsLoading(false)
      }).catch(() => {
        setIsAuth(false)
        setIsLoading(false)
        // addToast('Invalid credentials', Resourses.TOAST.ERROR)
      })
  }

  const register = (form) => {
    const hash = md5(form.password)
    form.password = hash
    postData(ENDPOINT.AUTH.SIGNUP, form, true)
      .then(() => {
        addToast('Account created', Resourses.TOAST.SUCCESS)
      })
      .catch(() => {
        addToast('Failed to create account', Resourses.TOAST.ERROR)
      })
  }

  return (
    <React.Fragment>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
      <Navbar bg="light">
        <Navbar.Brand>Europeana Archaeology Mapping Tool</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {/* Signed in as: <Button variant="link" style={{ padding: 0 }}>{user ? user.name : 'N/A'}</Button> */}
            {user && <SplitButton title={user.name} variant={'link'}>
              <Dropdown.Item eventKey="1" onClick={logout}>Logout</Dropdown.Item>
            </SplitButton>}
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
      <Container className="mt-3">

        <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>
          <Switch>
            <Route exact path="/" component={() => <Redirect to='/mappings' />} />
            <PrivateRoute exact path="/mappings" permissions={[isAuth]} isLoading={isLoading} {...props} component={(props) => <Mappings {...props} mappings={mappings} updateMappings={updateMappings} />} />
            <PrivateRoute path="/mappings/:id" {...props} permissions={[isAuth]} isLoading={isLoading} component={(props) => <EditMappings {...props} mappings={mappings} />} />
            <Route path="/login" {...props} component={(props) => <Login  {...props} login={login} isAuth={isAuth} isLoading={isLoading} />} />
            <Route path="/register" {...props} component={(props) => <Register  {...props} register={register} isAuth={isAuth} isLoading={isLoading} />} />
            <Route component={() => <NotFound />} />
          </Switch>
        </BrowserRouter>
      </Container>
    </React.Fragment>

  );
}

export default App;
