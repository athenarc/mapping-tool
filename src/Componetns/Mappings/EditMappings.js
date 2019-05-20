import React, { Component } from 'react'
import { Table, Col, Breadcrumb, Row, Modal, Button, Form } from 'react-bootstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashAlt, faDownload } from '@fortawesome/free-solid-svg-icons'
import { fetchData, postData, getExcel, downloadURI } from '../../Utils'
import AsyncSelect from 'react-select/lib/Async';

library.add(faSave, faTrashAlt, faDownload)


// DELETE /mappings/{id}/terms/{termId}
// PUT /mappings/{id}/terms/{termId}
// POST /mappings/{id}/terms

export default class EditMappings extends Component {
    _isMounted = false;

    constructor(props) {
        super(props)
        this.handleCloseModal = this.handleCloseModal.bind(this)
    }
    state = {
        mappingTerms: [],
        isLoading: false,
        showModal: false,
        newTerm: {
            nativeTerm: '',
            aatConceptLabel: '',
            aatUid: ''
        },
        isLoadingTerm: false,
        termOptions: []

    }


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
        const url = `https://app-share3d.imsi.athenarc.gr:8080/mappings/${mappingId}/terms`
        postData(url, this.state.newTerm)
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                throw Error(`Failed to create new term. Status: ${res.status}`)
            }).then(term => {
                this.setState({
                    mappingTerms: [
                        ...this.state.mappingTerms,
                        term
                    ]
                })
            }).catch(ex => console.log(ex))
    }

    handleChangeTerm(delta, index) {
        this.setState({
            mappingTerms: this.state.mappingTerms.map((m, i) => {
                if (i === index) {
                    return {
                        ...m,
                        term: delta.target.value
                    }
                }
                return m
            })
        })

    }



    handleRemoveTerm(termId) {
        const mappingId = this.props.match.params.id
        const url = `https://app-share3d.imsi.athenarc.gr:8080/mappings/${mappingId}/terms/${termId}`
        postData(url, [], 'DELETE')
            .then(res => {
                if (res.ok) {
                    const index = this.state.mappingTerms.findIndex(x => x.id === termId)
                    this.setState({
                        mappingTerms: [
                            ...this.state.mappingTerms.slice(0, index),
                            ...this.state.mappingTerms.slice(index + 1)
                        ]
                    })
                }
                throw Error(`Failed: ${res.status}`)
            }).catch(ex => console.log(ex))

    }
    handleUpdateTerm(termId) {
        const mappingId = this.props.match.params.id
        const term = this.state.mappingTerms.find(x => x.id === termId)
        const url = `https://app-share3d.imsi.athenarc.gr:8080/mappings/${mappingId}/terms/${termId}`
        postData(url, term, 'PUT')
            .then(res => {
                if (res.ok) {
                    console.log('Saved')
                }
                throw Error(`Failed: ${res.status}`)
            }).catch(ex => console.log(ex))

    }

    componentDidMount() {
        this._isMounted = true;
        const mappingId = this.props.match.params.id
        const url = `https://app-share3d.imsi.athenarc.gr:8080/mappings/${mappingId}/terms`
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
        const url = `https://app-share3d.imsi.athenarc.gr:8080/mappings/${mapping.id}/export`
        // getExcel(url, null, `${mapping.label} terms`)
        //window.open(url, '_blank');
        postData(url, "", 'POST')
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `export-${mapping.id}.xls`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch((error) => {
                error.json().then((json) => {

                })
            })
    }


    render() {

        const promiseOptions = inputValue =>
            fetch(`https://app-share3d.imsi.athenarc.gr:8080/subjects/search?q=${inputValue}`, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).then(res => res.json())
                .then(data => {
                    return data
                })


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
                    loadOptions={promiseOptions} />
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
                            <th><Button variant="success" onClick={() => this.handleShowModal()}>Create</Button></th>
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
                                <AsyncSelect defaultValue={defaultValue} onChange={(e) => this.handleNewSubjectName(e)} loadOptions={promiseOptions} />
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
            </React.Fragment >

        )
    }
}
