import React, { Component } from 'react'
import { Table, Col, Breadcrumb, Row, Modal, Button, Form } from 'react-bootstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashAlt, faDownload, faUpload } from '@fortawesome/free-solid-svg-icons'
import { fetchData, postData, getExcel, downloadURI, updateData, deleteData, postUpload } from '../../Utils'
import AsyncSelect from 'react-select/lib/Async';
import Dropzone from 'react-dropzone'
import { ENDPOINT, BASE_URL } from '../../config'
import { TOAST } from '../../Resources';
import { addToast } from '../../Utils'
library.add(faSave, faTrashAlt, faDownload, faUpload)

export default class EditMappings extends Component {
    _isMounted = false;

    constructor(props) {
        super(props)
        this.handleCloseModal = this.handleCloseModal.bind(this)
        this.handleCloseModalDrop = this.handleCloseModalDrop.bind(this)
        this.onDragOver = this.onDragOver.bind(this)

        this.handleCloseModalDropEDM = this.handleCloseModalDropEDM.bind(this)
        this.onDragOverEDM = this.onDragOverEDM.bind(this)
    }
    state = {
        mappingTerms: [],
        isLoading: false,
        showModal: false,
        showModalDrop: false,
        showModalEnrich: false,
        showModalDropEDM: false,
        highlightEDM: false,
        highlight: false,
        enrichDetails: [],
        newTerm: {
            nativeTerm: '',
            aatConceptLabel: '',
            aatUid: ''
        },
        isLoadingTerm: false,
        termOptions: []

    }


    /* Excel File : start */
    onDrop = (files) => {
        // POST to a test endpoint for demo purposes
        const mappingId = this.props.match.params.id

        var data = new FormData()
        files.forEach(file => {
            data.append('file', file, file.name)
        });

        postUpload(`${ENDPOINT.MAPPINGS}/${mappingId}/upload`, data, true)
            .then(mappingTerms => this._isMounted && this.setState({ mappingTerms }))
            .catch(() => addToast('Failed to upload', TOAST.ERROR))
        this.handleCloseModalDrop()

    }


    onDragOver(evt) {
        evt.preventDefault()

        if (this.props.disabled) return

        this.setState({ hightlight: true })
    }


    onDragLeave() {
        this.setState({ hightlight: false })
    }


    handleCloseModalDrop() {
        this.setState({ showModalDrop: false });
    }

    handleShowModalDrop() {
        this.setState({ showModalDrop: true });
    }
    /* Excel File : end */


    /* EDM Archive : start */

    onDropEDM = (files) => {
        // POST to a test endpoint for demo purposes
        const mappingId = this.props.match.params.id

        var data = new FormData()
        files.forEach(file => {
            data.append('file', file, file.name)
        });

        postUpload(`${ENDPOINT.MAPPINGS}/${mappingId}/enrich`, data, true)
            .then(enrichDetails => {
                console.log(enrichDetails)
                this.setState({ showModalEnrich: true });
                this.setState({ enrichDetails: enrichDetails });
                //this.enrichDetails = enrichDetails
            })//mappingTerms => this._isMounted && this.setState({ mappingTerms }))
            .catch(() => addToast('Failed to upload', TOAST.ERROR))
        this.handleCloseModalDropEDM()

    }


    onDragOverEDM(evt) {
        evt.preventDefault()

        if (this.props.disabled) return

        this.setState({ hightlightEDM: true })
    }


    onDragLeaveEDM() {
        this.setState({ hightlightEDM: false })
    }


    handleCloseModalDropEDM() {
        this.setState({ showModalDropEDM: false });
    }

    handleShowModalDropEDM() {
        this.setState({ showModalDropEDM: true });
    }
    /* EDM Archive : end */



    handleCloseModal() {
        this.setState({ showModal: false });
    }

    handleShowModal() {
        this.setState({ showModal: true });
    }

    handleNewTermName(nativeTerm) {
        this.setState({
            newTerm: {
                ...this.state.newTerm,
                nativeTerm
            }
        })
    }
    handleNewSubjectName(term) {
        this.setState({
            newTerm: {
                ...this.state.newTerm,
                aatConceptLabel: term.label,
                aatUid: term.aatUid
            }
        })
    }

    handleSaveNew() {
        const mappingId = this.props.match.params.id
        const url = `${ENDPOINT.MAPPINGS}/${mappingId}/terms`
        postData(url, this.state.newTerm)
            .then(term => {
                this.setState({
                    mappingTerms: [
                        ...this.state.mappingTerms,
                        term
                    ]
                })
            }).catch(() => addToast('Failed to Save term', TOAST.ERROR))
    }

    handleChangeTerm(delta, index) {
        this.setState({
            mappingTerms: this.state.mappingTerms.map((m, i) => {
                if (i === index) {
                    return {
                        ...m,
                        nativeTerm: delta.target.value
                    }
                }
                return m
            })
        })

    }



    handleRemoveTerm(termId) {
        const mappingId = this.props.match.params.id
        const url = `${ENDPOINT.MAPPINGS}/${mappingId}/terms/${termId}`
        deleteData(url)
            .then(() => {
                const index = this.state.mappingTerms.findIndex(x => x.id === termId)
                this.setState({
                    mappingTerms: [
                        ...this.state.mappingTerms.slice(0, index),
                        ...this.state.mappingTerms.slice(index + 1)
                    ]
                })
            }).catch(() => addToast('Failed to delete term', TOAST.ERROR))

    }
    handleUpdateTerm(termId) {
        const mappingId = this.props.match.params.id
        const term = this.state.mappingTerms.find(x => x.id === termId)
        const url = `${ENDPOINT.MAPPINGS}/${mappingId}/terms/${termId}`
        updateData(url, term).catch(() => addToast('Failed to update term', TOAST.ERROR))

    }

    componentDidMount() {
        this._isMounted = true;
        const mappingId = this.props.match.params.id
        const url = `${ENDPOINT.MAPPINGS}/${mappingId}/terms`
        fetchData(url)
            .then(mappingTerms => this._isMounted && this.setState({ mappingTerms }))
            .catch(ex => console.log(ex))
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    handleEditConceptLabel(editTerm, index) {
        this.setState({
            mappingTerms: [
                ...this.state.mappingTerms.map((term, i) => {
                    if (index === i) {
                        return {
                            ...term,
                            aatConceptLabel: editTerm.label,
                            aatUid: editTerm.aatUid
                        }
                    }
                    return term
                })
            ]
        })

    }

    downloadExcel() {
        const mapping = this.props.mappings.find(x => x.id == this.props.match.params.id)
        if (!mapping) return addToast('Mapping not found', TOAST.ERROR)
        const url = `${ENDPOINT.MAPPINGS}/${mapping.id}/export`
        getExcel(url, "", 'mapping').catch(() => addToast('Failed to download excel', TOAST.ERROR))
    }

    promiseOptions = (inputValue) => {
        return postData(`${BASE_URL}/subjects/search?q=${inputValue}`, {}, true)
            .then(data => data)
            .catch(() => addToast('Something went wrong', TOAST.ERROR))
    }

    render() {


        const result = this.state.mappingTerms.map((term, index) => {

            const defaultValue = {
                label: term.aatConceptLabel,
                id: term.id
            }
            return <tr key={term.id}>
                <td><Form.Control
                    value={term.nativeTerm}
                    onChange={(e) => this.handleChangeTerm(e, index)} />
                </td>
                <td><AsyncSelect
                    defaultValue={defaultValue}
                    onChange={(e) => this.handleEditConceptLabel(e, index)}
                    loadOptions={this.promiseOptions} />
                </td>
                <td>
                    <Button
                        variant="success"
                        className="mx-1"
                        disabled={!term.aatConceptLabel || !term.nativeTerm}
                        onClick={() => this.handleUpdateTerm(term.id)}>
                        <FontAwesomeIcon icon="save" />
                    </Button>
                    <Button
                        variant="danger"
                        className="mx-1"
                        onClick={() => this.handleRemoveTerm(term.id)}>
                        <FontAwesomeIcon icon="trash-alt" />
                    </Button>
                </td>
            </tr>
        })

        const onSave = () => {
            this.handleCloseModal()
            this.handleSaveNew()
        }

        const mapping = this.props.mappings.find(x => x.id == this.props.match.params.id)

        const defaultValue = this.state.newTerm.aatConceptLabel
            ? {
                label: this.state.newTerm.aatConceptLabel,
                id: this.state.newTerm.aatUid
            }
            : null

        return (
            <React.Fragment >
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => this.props.history.push('/mappings')}>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>{mapping && mapping.label}</Breadcrumb.Item>
                    <Button size={'sm'} onClick={() => this.downloadExcel()} className="ml-3"><FontAwesomeIcon icon="download" size={'sm'} /></Button>
                </Breadcrumb>
                <Table>
                    <thead>
                        <tr>
                            <th>Term</th>
                            <th>AAT Subject</th>
                            <th>
                                <Button variant="success" onClick={() => this.handleShowModal()}>Create</Button> &nbsp;
                                <Button variant="primary" onClick={() => this.handleShowModalDrop()}><FontAwesomeIcon icon="upload" size={'sm'} /></Button> &nbsp;
                                <Button variant="primary" onClick={() => this.handleShowModalDropEDM()}><FontAwesomeIcon icon="upload" size={'sm'} /> EDM</Button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {result}
                    </tbody>
                </Table>

                <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new term</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group as={Row} controlId="term">
                            <Form.Label column sm="2">
                                Term
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control onChange={(e) => this.handleNewTermName(e.target.value)} value={this.state.newTerm.nativeTerm} placeholder='Add Term' />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="subject">
                            <Form.Label column sm="2">
                                AAT Subject
                            </Form.Label>
                            <Col sm="10">
                                <AsyncSelect defaultValue={defaultValue} onChange={(e) => this.handleNewSubjectName(e)} loadOptions={this.promiseOptions} />
                            </Col>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModal}>
                            Close
                    </Button>
                        <Button variant="primary"
                            disabled={!this.state.newTerm.aatConceptLabel || !this.state.newTerm.nativeTerm}
                            onClick={onSave}>
                            Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showModalDrop} onHide={this.handleCloseModalDrop}>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Excel</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Dropzone className={`Dropzone ${this.state.highlight ? 'Highlight' : ''}`}
                            onDrop={this.onDrop}
                            onDragOver={this.onDragOver}
                            onDragLeave={this.onDragLeave}
                            style={{ cursor: this.props.disabled ? 'default' : 'pointer' }} >
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModalDrop}>
                            Close
                    </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={this.state.showModalDropEDM} onHide={this.handleCloseModalDropEDM}>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload EDM Archive</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Dropzone className={`Dropzone ${this.state.highlight ? 'Highlight' : ''}`}
                            onDrop={this.onDropEDM}
                            onDragOver={this.onDragOverEDM}
                            onDragLeave={this.onDragLeaveEDM}
                            style={{ cursor: this.props.disabled ? 'default' : 'pointer' }} >
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p>Drag 'n' drop an EDM archive (zip file containing EDM xml files) here, or click to select files</p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModalDropEDM}>
                            Close
                    </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={this.state.showModalEnrich} onHide={this.handleCloseModalEnrich}>
                    <Modal.Header closeButton>
                        <Modal.Title>Enrich Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Archive file name: {this.state.enrichDetails.edmArchiveName} <br />
                        EDM file count: {this.state.enrichDetails.edmFileCount} <br />
                        Enriched files: {this.state.enrichDetails.enrichedFileCount} <br />
                        Message: {this.state.enrichDetails.message} <br />
                        Download Enriched File: <a href={this.state.enrichDetails.enrichedArchiveUrl}>Click here to download</a>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModalEnrich}>
                            Close
                    </Button>
                    </Modal.Footer>
                </Modal>

            </React.Fragment >

        )
    }
}
