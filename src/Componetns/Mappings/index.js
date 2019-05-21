import React, { Component } from 'react'
import { Table, Col, Breadcrumb, Row, Modal, Button, Form, Container } from 'react-bootstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashAlt, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { postData } from '../../Utils'
library.add(faSave, faTrashAlt, faCaretRight)

export default class Mappings extends Component {

    state = {
        showModal: false,
        newMapping: {
            label: '',
            description: '',
            vocabularyName: '',
            language: '',
            providerName: ''
        }
    }



    onSave = () => {
        this.handleCloseModal()
        this.handleSaveNewMapping()
    }

    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    handleShowModal = () => {
        this.setState({ showModal: true });
    }


    handleNewMappingLabel(label) {
        this.setState({
            newMapping: {
                ...this.state.newMapping,
                label
            }
        })
    }
    handleNewMappingDescription(description) {
        this.setState({
            newMapping: {
                ...this.state.newMapping,
                description
            }
        })
    }
    handleNewMappingProviderName(providerName) {
        this.setState({
            newMapping: {
                ...this.state.newMapping,
                providerName
            }
        })
    }
    handleNewMappingLanguage(language) {
        this.setState({
            newMapping: {
                ...this.state.newMapping,
                language
            }
        })
    }
    handleNewMappingVocabularyName(vocabularyName) {
        this.setState({
            newMapping: {
                ...this.state.newMapping,
                vocabularyName
            }
        })
    }



    handleSaveNewMapping = () => {
        const url = `https://app-share3d.imsi.athenarc.gr:8080/mappings`
        postData(url, this.state.newMapping)
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                throw Error(`Failed to create new term. Status: ${res.status}`)
            }).then(mapping => {
                this.props.updateMappings(mapping)

            }).catch(ex => console.log(ex))
        this.handleCloseModal()
    }

    render() {

        const {
            history,
            mappings
        } = this.props

        const result = mappings.map(mapping => {
            return <tr key={mapping.id}>
                <td>{mapping.label}</td>
                <td>{mapping.description}</td>
                <td>{mapping.language}</td>
                <td>{mapping.vocabularyName}</td>
                <td>{mapping.providerName}</td>
                <td><Button onClick={() => history.push(`/mappings/${mapping.id}`)}><FontAwesomeIcon icon="caret-right" /></Button></td>
            </tr>
        })

        return (
            <React.Fragment>
                <Breadcrumb>
                    <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                </Breadcrumb>
                <Table>
                    <thead>
                        <tr>
                            <th>Label</th>
                            <th>Description</th>
                            <th>Language</th>
                            <th>Vocabulary Name</th>
                            <th>Provider Name</th>
                            <th><Button variant="success" onClick={() => this.handleShowModal()}>Create</Button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {result}
                    </tbody>
                </Table>

                <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create new Mapping</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group as={Row} controlId="label">
                            <Form.Label column sm="2">
                                Label
                                </Form.Label>
                            <Col sm="10">
                                <Form.Control onChange={(e) => this.handleNewMappingLabel(e.target.value)} value={this.state.newMapping.label} placeholder='Add label' />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="description">
                            <Form.Label column sm="2">
                                Description
                                </Form.Label>
                            <Col sm="10">
                                <Form.Control onChange={(e) => this.handleNewMappingDescription(e.target.value)} value={this.state.newMapping.description} placeholder='Add description' />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="language">
                            <Form.Label column sm="2">
                                Language
                                </Form.Label>
                            <Col sm="10">
                                <Form.Control onChange={(e) => this.handleNewMappingLanguage(e.target.value)} value={this.state.newMapping.language} placeholder='Add description' />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="Vocabulary Name">
                            <Form.Label column sm="2">
                                Vocabulary Name
                                </Form.Label>
                            <Col sm="10">
                                <Form.Control onChange={(e) => this.handleNewMappingVocabularyName(e.target.value)} value={this.state.newMapping.vocabularyName} placeholder='Add description' />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="Provider Name">
                            <Form.Label column sm="2">
                                Provider Name
                                </Form.Label>
                            <Col sm="10">
                                <Form.Control onChange={(e) => this.handleNewMappingProviderName(e.target.value)} value={this.state.newMapping.providerName} placeholder='Add description' />
                            </Col>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.onSave}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>


            </React.Fragment>
        )
    }

}
