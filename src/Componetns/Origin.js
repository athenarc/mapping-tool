import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import { fetchData, addToast, postData, requestAccess, getUser } from '../Utils';
import { ENDPOINT } from '../config'

import Mappings from './Mappings'
import EditMappings from './Mappings/EditMappings'
import Spatial from './Spatial'
import EditSpatial from './Spatial/EditSpatial'
import NotFound from './NotFound'
import Home from './Home'
import Login from './Login/Login'
import Register from './Login/Register'
import * as Resourses from '../Resources'

import PrivateRoute from './lib/PrivateRoute';
import EdmArchive from './Home/EdmArchive';

export default function Origin(props) {
  const { isLoading, isAuth, register, login } = props

  const [mappings, setMappings] = useState([])
  const [edmArchives, setEdmArchives] = useState([])
  const [spatials, setSpatial] = useState([])
  const [isLoadingMappings, setIsLoadingMappings] = useState(false)
  const [isLoadingSpatial, setIsLoadingSpatial] = useState(false)
  const [languages, setLanguages] = useState([])
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false)


  useEffect(() => {
    loadLanguages()
    loadMappings()
    loadEdmArchives()
  }, [])


  const loadEdmArchives = () => {
    fetchData(ENDPOINT.EDM_ARCHIVES)
      .then(edmarchives => {
        console.log(edmarchives)
        setEdmArchives(edmarchives)
      })
      .catch(() => {
        addToast('Failed to load mappings', Resourses.TOAST.ERROR)
      })
  }

  const loadMappings = () => {
    setIsLoadingMappings(true)
    fetchData(ENDPOINT.MAPPINGS)
      .then(mappings => {
        console.log(mappings);
        setMappings(mappings)
        setIsLoadingMappings(false)
      })
      .catch(() => {
        addToast('Failed to load mappings', Resourses.TOAST.ERROR)
        setIsLoadingMappings(false)
      })
  }


  const handleRemoveMapping = (mappingId) => {
    setMappings(mappings.filter(x => x.id !== mappingId))
  }

  const loadLanguages = () => {
    setIsLoadingLanguages(true)
    fetchData(ENDPOINT.LANGUAGES)
      .then(languages => {
        setLanguages(languages)
        setIsLoadingLanguages(false)
      })
      .catch(() => {
        addToast('Failed to load languages', Resourses.TOAST.ERROR)
        setIsLoadingLanguages(false)
      })
  }

  const updateMappings = (mapping) => {
    setMappings([...mappings, mapping])
  }



  return (
    <div>
      <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>
        <Switch>
          <Route exact path="/" component={() => <Redirect to='/home' />} />
          <PrivateRoute exact path="/mappings" permissions={[isAuth]} isLoading={isLoading} {...props} component={(props) => <Mappings {...props} mappings={mappings.filter(x => x.type === 'subject')} updateMappings={updateMappings} languages={languages} />} />
          <PrivateRoute path="/mappings/:id" {...props} permissions={[isAuth]} isLoading={isLoading} component={(props) => <EditMappings {...props} mappings={mappings.filter(x => x.type === 'subject')} languages={languages} handleRemoveMapping={handleRemoveMapping} />} />
          <PrivateRoute exact path="/spatial" permissions={[isAuth]} isLoading={isLoading} {...props} component={(props) => <Spatial {...props} mappings={mappings.filter(x => x.type === 'spatial')} updateMappings={updateMappings} languages={languages} />} />
          <PrivateRoute path="/spatial/:id" {...props} permissions={[isAuth]} isLoading={isLoading} component={(props) => <EditSpatial {...props} mappings={mappings.filter(x => x.type === 'spatial')} languages={languages} handleRemoveMapping={handleRemoveMapping} />} />
          <Route path="/login" {...props} component={(props) => <Login  {...props} login={login} isAuth={isAuth} isLoading={isLoading} />} />
          <Route path="/register" {...props} component={(props) => <Register  {...props} register={register} isAuth={isAuth} isLoading={isLoading} />} />
          <PrivateRoute path="/home" {...props} permissions={[isAuth]} isLoading={isLoading} component={(props) => <Home  {...props} edmArchives={edmArchives} loadEdmArchives={loadEdmArchives} />} />
          <PrivateRoute path="/edmarchives/:id" {...props} permissions={[isAuth]} isLoading={isLoading} component={(props) => <EdmArchive  {...props} />} />
          <Route component={() => <NotFound />} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}