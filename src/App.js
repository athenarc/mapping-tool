import React, { Component } from 'react';
import './App.css';
import { Navbar, Container, Modal } from 'react-bootstrap'
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import Mappings from './Componetns/Mappings'
import EditMappings from './Componetns/Mappings/EditMappings'
import NotFound from './Componetns/NotFount'


class App extends Component {

  constructor(props) {
    super(props);
    this.updateMappings = this.updateMappings.bind(this);
  }



  state = {
    mappings: [],
    isLoadingMappings: false,
  }

  updateMappings(mapping) {
    this.setState({
      mappings: [
        ...this.state.mappings,
        mapping
      ]
    })
  }

  componentDidMount() {
    this.setState({ isLoadingMappings: true })
    fetch('https://app-share3d.imsi.athenarc.gr:8080/mappings')
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw Error('Failed to fetch data')
      })
      .then(mappings => this.setState({ mappings, isLoadingMappings: false }))
      .catch(ex => {
        this.setState({ isLoadingMappings: false })
        console.log(ex)
      })
  }

  render() {

    return (
      <React.Fragment>
        <Navbar bg="light">
          <Navbar.Brand href="#home">Europeana Archaeology Mapping Tool</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as: <a href="#login">N/A</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
        <Container className="mt-3">

          <BrowserRouter basename={`${process.env.PUBLIC_URL}`}>
            <Switch>
              <Route exact path="/" component={() => <Redirect to='/mappings' />} />
              <Route exact path="/mappings" {...this.props} component={(props) => <Mappings {...props} mappings={this.state.mappings} updateMappings={this.updateMappings} />} />
              <Route path="/mappings/:id" {...this.props} component={(props) => <EditMappings {...props} mappings={this.state.mappings} />} />
              <Route component={() => <NotFound />} />
            </Switch>
          </BrowserRouter>
        </Container>
      </React.Fragment>

    );
  }

}

export default App;
