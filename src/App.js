import React, { useState, useEffect } from 'react';
import './App.css';
import { Navbar, Container, Dropdown, SplitButton } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addToast, postData, requestAccess, getUser } from './Utils';
import { ENDPOINT } from './config'
import * as Resourses from './Resources'
import Origin from './Componetns/Origin';
// import { Spinner } from 'react-bootstrap';

const md5 = require('md5');


function App(props) {

  const [isLoading, setIsLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    postData(ENDPOINT.AUTH.STATUS, [], false, false)
      .then(() => {
        setIsAuth(true)
        setIsLoading(false)
        setUser(getUser())
      })
      .catch(() => {
        setIsAuth(false)
        setIsLoading(false)
      })
  }, [isAuth])


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
        //const notify = () => toast("Invalid credentials");
        addToast('Invalid credentials', Resourses.TOAST.ERROR)
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

  const resetPassword = (form) => {
    const f = {username: form}
    console.log(f)
    postData(ENDPOINT.AUTH.RESETPASSWORD, f, false)
      .then((data) => {
        addToast('Password reset successfully', Resourses.TOAST.SUCCESS)
      })
      /*.catch((e) => {
        addToast('Failed to reset password', Resourses.TOAST.ERROR)
      })*/
  }

  return (
    <React.Fragment>
      <div style={styles.mainContainer}>
        <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
        <Navbar style={styles.navBar} >
          <Navbar.Brand style={styles.navBarBrand}>Europeana Archaeology Mapping Tool</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {/* Signed in as: <Button variant="link" style={{ padding: 0 }}>{user ? user.name : 'N/A'}</Button> */}
              {user && <SplitButton title={user.name} variant={'default'}>
                <Dropdown.Item eventKey="1" onClick={logout}>Logout</Dropdown.Item>
              </SplitButton>}
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
        <Container className="mt-3">
          {
            isLoading
              ? <div>Loading...</div>
              : <Origin
                login={login}
                register={register}
                resetPassword={resetPassword}
                isAuth={isAuth}
                isLoading={isLoading}
              />
          }
        </Container>
      </div>
    </React.Fragment>

  );
}


const styles = {
  navBar: {
    zIndex: 1000,
    backgroundColor: '#898483',
    color: '#ffffff'
  },
  navBarBrand: {
    color: '#ffffff'
  },
  mainContainer: {
    height: '100vh',
    backgroundColor: 'rgb(235, 235, 224)'
  }
}

export default App;
