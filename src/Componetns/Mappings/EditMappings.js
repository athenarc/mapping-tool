import React, { Component } from 'react'
import { Table, Col, Breadcrumb, Row, Modal, Button, Form } from 'react-bootstrap'
import Select from 'react-select';
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
        this.updateMappingProp = this.updateMappingProp.bind(this)

        this.handleCloseModalDropEDM = this.handleCloseModalDropEDM.bind(this)
        this.handleCloseModalEnrich = this.handleCloseModalEnrich.bind(this)
        this.onDragOverEDM = this.onDragOverEDM.bind(this)
        this.handleCloseModalEdit = this.handleCloseModalEdit.bind(this)
        this.handleCloseModalDelete = this.handleCloseModalDelete.bind(this)
    }
    state = {
        mappingTerms: [],
        editingIndex: 0,
        languages: [],
        isLoading: false,
        showModal: false,
        showModalEdit: false,
        showModalDelete: false,
        showModalDrop: false,
        showModalEnrich: false,
        showModalDropEDM: false,
        highlightEDM: false,
        highlight: false,
        enrichDetails: [],
        newTerm: {
            nativeTerm: '',
            aatConceptLabel: '',
            aatUid: '',
            language: 'en'
        },
        mappingSchema: {
            id: null,
            label: '',
            description: '',
            vocabularyName: '',
            language: '',
            providerName: '',
            "type": 'subject'
        },
        isLoadingTerm: false,
        termOptions: []

    }


    loadMappingMetadata = () => {
        const mappingId = this.props.match.params.id
        fetchData(`${ENDPOINT.MAPPINGS}/${mappingId}`)
            .then(mappingSchema => {
                this.setState({ mappingSchema })
            })
            .catch(() => {
                addToast('Failed to load mapping', TOAST.ERROR)
            })
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

    handleShowModalEdit() {
        this.setState({ showModalEdit: true });
    }

    handleCloseModalEdit() {
        this.setState({ showModalEdit: false });
    }

    handleShowModalDelete() {
        this.setState({ showModalDelete: true });
    }

    handleCloseModalDelete() {
        this.setState({ showModalDelete: false });
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


    /* Enrich details : start */

    handleCloseModalEnrich() {
        this.setState({ showModalEnrich: false });
    }

    handleShowModalEnrich() {
        this.setState({ showModalEnrich: true });
    }

    /* Enrich details : end */



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

    handleNewTermLanguage(language) {
        this.setState({
            newTerm: {
                ...this.state.newTerm,
                language: language
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
            editingIndex: index,
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

        const languagesUrl = `${ENDPOINT.LANGUAGES}`
        fetchData(languagesUrl)
            .then(languages => this.setState({ languages }))
            .catch(ex => console.log(ex))

        this.loadMappingMetadata()
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if (this.state.mappingTerms.length === nextState.mappingTerms.length) {
            const currentStateStr = JSON.stringify(this.state.mappingTerms)
            const nextStateStr = JSON.stringify(nextState.mappingTerms)
            if (currentStateStr !== nextStateStr) {
                // console.log("Update at index ", nextState.editingIndex)
                const mappingId = this.props.match.params.id
                const term = nextState.mappingTerms[nextState.editingIndex]
                const url = `${ENDPOINT.MAPPINGS}/${mappingId}/terms/${term.id}`
                updateData(url, term).catch((ex) => console.log(ex))
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    handleEditConceptLabel(editTerm, index) {
        this.setState({
            editingIndex: index,
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

    handleChangeLanguage(language, index) {
        this.setState({
            editingIndex: index,
            mappingTerms: [
                ...this.state.mappingTerms.map((term, i) => {
                    if (index === i) {
                        return {
                            ...term,
                            language: language
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

    updateMappingProp = (prop, value) => {
        this.setState({
            mappingSchema:
                { ...this.state.mappingSchema, [prop]: value }
        })
    }


    render() {


        const result = this.state.mappingTerms.map((term, index) => {

            const defaultValue = {
                label: term.aatConceptLabel,
                id: term.id
            }
            const languageOptions = this.state.languages.map(v => ({
                label: v.name,
                value: v.iso639_1
            }))

            return <tr key={term.id}>
                <td><Form.Control
                    value={term.nativeTerm}
                    onChange={(e) => this.handleChangeTerm(e, index)} />
                </td>
                <td>
                    <Select options={languageOptions}
                        value={languageOptions.find(x => x.value == term.language)}
                        onChange={(e) => this.handleChangeLanguage(e.value, index)} />
                </td>
                <td><AsyncSelect
                    defaultValue={defaultValue}
                    size="15"
                    onChange={(e) => this.handleEditConceptLabel(e, index)}
                    loadOptions={this.promiseOptions} />
                </td>
                <td>
                    {/* <Button
                        variant="success"
                        className="mx-1"
                        disabled={!term.aatConceptLabel || !term.nativeTerm}
                        onClick={() => this.handleUpdateTerm(term.id)}>
                        <FontAwesomeIcon icon="save" />
                    </Button> */}
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

        const onSaveMappingMetadata = (mappingMetadata) => {
            this.handleCloseModalEdit()
            const mappingId = this.props.match.params.id
            updateData(`${ENDPOINT.MAPPINGS}/${mappingId}`, mappingMetadata, true)
                .then(mappingSchema => this.setState({ mappingSchema }))
                .catch(() => addToast('Failed to create spatial mapping', TOAST.ERROR))
        }


        const onDeleteMapping = () => {
            const mappingId = this.props.match.params.id
            deleteData(`${ENDPOINT.MAPPINGS}/${mappingId}`, true)
                .then(() => {
                    this.handleCloseModalEdit()
                    this.props.history.push('/mappings')
                    this.props.handleRemoveMapping(mappingId)
                })
                .catch(() => addToast('Failed to create spatial mapping', TOAST.ERROR))
        }


        const mapping = this.props.mappings.find(x => x.id == this.props.match.params.id)

        const defaultValue = this.state.newTerm.aatConceptLabel
            ? {
                label: this.state.newTerm.aatConceptLabel,
                id: this.state.newTerm.aatUid
            }
            : null

        const languageOptions = this.state.languages.map(v => ({
            label: v.name,
            value: v.iso639_1
        }))


        const styles = {
            containerCard: {
                backgroundColor: 'white',
                margin: '12px',
                boxShadow: '5px 5px 5px 0px rgba(0,0,0,0.75)',
            }
        }

        return (
            <React.Fragment >
                <Breadcrumb style={styles.containerCard }>
                    <Breadcrumb.Item onClick={() => this.props.history.push('/home')}>Home</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => this.props.history.push('/mappings')}>Thematic</Breadcrumb.Item>
                    <Breadcrumb.Item>{mapping && mapping.label}</Breadcrumb.Item>
                    <Button size={'sm'} onClick={() => this.downloadExcel()} className="ml-3"><FontAwesomeIcon icon="download" size={'sm'} /> Download Mapping</Button>
                    <Button size={'sm'} onClick={() => this.handleShowModalEdit()} variant="success" className="ml-3"><FontAwesomeIcon icon="save" size={'sm'} /> Edit Mapping</Button>
                    <Button size={'sm'} onClick={() => this.handleShowModalDelete()} variant="danger" className="ml-3"><FontAwesomeIcon icon="trash-alt" size={'sm'} /> Delete Mapping</Button>
                </Breadcrumb>
                <div style={styles.containerCard}>
                    <Table>
                        <thead>
                            <tr>
                                <th>Term</th>
                                <th>Language</th>
                                <th>AAT Subject</th>
                                <th>
                                    <Button variant="success" onClick={() => this.handleShowModal()}>Create</Button> &nbsp;
                                    <Button variant="primary" onClick={() => this.handleShowModalDrop()}><FontAwesomeIcon icon="upload" size={'sm'} /></Button> &nbsp;
                                    {/*<Button variant="primary" onClick={() => this.handleShowModalDropEDM()}><FontAwesomeIcon icon="upload" size={'sm'} /> EDM</Button>*/}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {result}
                        </tbody>
                    </Table>
                </div>

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
                        <Form.Group as={Row} controlId="language">
                            <Form.Label column sm="2">
                                Language
                            </Form.Label>
                            <Col sm="10">
                                <Select options={languageOptions}
                                    value={languageOptions.find(x => x.value == this.state.newTerm.language)}
                                    onChange={(e) => this.handleNewTermLanguage(e.value)} />
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
                        <Modal.Title>Enrich an EDM Archive</Modal.Title>
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


                <Modal show={this.state.showModalEdit} onHide={this.handleCloseModalEdit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Mapping</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group as={Row} controlId="label">
                            <Form.Label column sm="2">Label</Form.Label>
                            <Col sm="10">
                                <Form.Control onChange={(e) => this.updateMappingProp('label', e.target.value)} value={this.state.mappingSchema.label} placeholder='Add title' />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="description">
                            <Form.Label column sm="2">Description</Form.Label>
                            <Col sm="10">
                                <Form.Control onChange={(e) => this.updateMappingProp('description', e.target.value)} value={this.state.mappingSchema.description} placeholder='Add description' />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="language">
                            <Form.Label column sm="2">Language</Form.Label>
                            <Col sm="10">
                                <Form.Control onChange={(e) => this.updateMappingProp('language', e.target.value)} value={this.state.mappingSchema.language} placeholder='Add description' />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="Vocabulary Name">
                            <Form.Label column sm="2">Vocabulary Name</Form.Label>
                            <Col sm="10">
                                <Form.Control onChange={(e) => this.updateMappingProp('vocabularyName', e.target.value)} value={this.state.mappingSchema.vocabularyName} placeholder='Add the name of your vocabulary' />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="Provider Name">
                            <Form.Label column sm="2">Provider Name</Form.Label>
                            <Col sm="10">
                                <Form.Control onChange={(e) => this.updateMappingProp('providerName', e.target.value)} value={this.state.mappingSchema.providerName} placeholder='Add the name of your institution' />
                            </Col>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModalEdit}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => onSaveMappingMetadata(this.state.mappingSchema)}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={this.state.showModalDelete} onHide={this.handleCloseModalDelete}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Confirm delete this mapping and all of it's contents ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModalDelete}>
                            Close
                    </Button>
                        <Button variant="danger" onClick={() => onDeleteMapping()}>
                            Delete
                    </Button>
                    </Modal.Footer>
                </Modal>

            </React.Fragment>

        )
    }

}
