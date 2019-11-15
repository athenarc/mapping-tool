import React, { useEffect, useState } from 'react'
import { fetchData, deleteData, addToast, getExcel, getFile, postData } from '../../Utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TOAST } from '../../Resources'
import { ENDPOINT, BASE_URL } from '../../config'
import { Modal, Card, Row, Col, Table, Breadcrumb, Button, Container } from 'react-bootstrap'

const archiveSchema = {
    createdAt: "",
    createdBy: null,
    filename: "",
    filepath: "",
    id: 0,
    itemCount: 0,
    name: "",
    spatialMapping: 0,
    temporalMapping: 0,
    thematicMapping: 0
}

const archiveTermsSchema = {
    subjectTerms: [],
    spatialTerms: [],
    temporalTerms: []
}

export default function EdmArchive(props) {

    const { edmArchives, loadEdmArchives } = props
    const [archiveTerms, setArchiveTerms] = useState(archiveTermsSchema)
    const [mappings, setMappings] = useState([])
    const [showModalMappings, setShowModalMappings] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)
    const archiveId = props.match.params.id
    const [archive, setArchive] = useState(archiveSchema)
    

    useEffect(() => {
        /*
        fetchData(`${ENDPOINT.EDM_ARCHIVES}/${archiveId}`)
         .then(archive => {
             setArchive(archive)
         }).catch(ex => {
             console.log(ex)
             addToast("Failed to load archive", TOAST.ERROR)
         })
         */

        loadArchive()
        getArchiveTerms(archiveId)
    }, [archiveId])


    const getArchiveTerms = (archiveId) => {
        const url = `${ENDPOINT.EDM_ARCHIVES}/${archiveId}/extract_terms`
        postData(url, {}, true, true)
        .then(data => {
            setArchiveTerms(data)
            
        })
        .catch(() => addToast('Something went wrong', TOAST.ERROR)) 
    }


    const loadArchive = () => {
        const url = `${ENDPOINT.EDM_ARCHIVES}/${archiveId}`
        fetchData(url, {}, true, true)
        .then(data => {
            setArchive(data)
        })
        .catch(() => addToast('Something went wrong', TOAST.ERROR))
    }


    const downloadArchive = () => {
        if (!archive) return addToast('Arvhive not found', TOAST.ERROR)
        const url = `${ENDPOINT.EDM_ARCHIVES}/${archiveId}/download`
        getFile(url, {}, archive.filename).catch(() => addToast('Failed to download archive', TOAST.ERROR))
    }
    

    const createNewMapping = (type) => {
        const url = `${ENDPOINT.EDM_ARCHIVES}/${archiveId}/mappings?type=${type}`
        postData(url, {}, true, true)
        .then(data => {
            loadArchive()
        })
        .catch(() => addToast('Something went wrong', TOAST.ERROR))
    }

    const addToExistingMapping = (mappingId) => {
        const url = `${ENDPOINT.EDM_ARCHIVES}/${archiveId}/mappings/${mappingId}`
        postData(url, {}, true, true)
        .then(data => {
            loadArchive()
            handleCloseModalMappings()
        })
        .catch(() => addToast('Something went wrong', TOAST.ERROR))
    }


    const enrichArchive = () => {
        /*const url = `${ENDPOINT.EDM_ARCHIVES}/${archiveId}/enrich`
        postData(url, {}, true, true)
        .then(data => setArchiveTerms(data))
        .catch(() => addToast('Something went wrong', TOAST.ERROR))*/
    }

    const saveExtractedTerms = () => {
        if (!archive) return addToast('Mapping not found', TOAST.ERROR)
        const url = `${ENDPOINT.EDM_ARCHIVES}/${archiveId}/terms`
        getExcel(url, archiveTerms, 'mapping').catch(() => addToast('Failed to download excel', TOAST.ERROR))
    }

    const deleteArchive = () => {
        if (!archive) return addToast('Archive not found', TOAST.ERROR)
        const url = `${ENDPOINT.EDM_ARCHIVES}/${archiveId}`
       
        deleteData(url, true)
        .then(() => {
            handleCloseModalDelete()
            props.history.push('/home')
            props.loadEdmArchives()
        })
        .catch(() => addToast('Failed to delete archive', TOAST.ERROR))

    }
    



    const handleCloseModalMappings = () => {
        setShowModalMappings(false)
    }
    const handleShowModalMappings = () => {
        fetchData(`${ENDPOINT.MAPPINGS}`)
        .then(mappings => {
            setMappings(mappings)
        }).catch(ex => {
            console.log(ex)
            addToast("Failed to load archive", TOAST.ERROR)
        })
        setShowModalMappings(true)
    }

    const handleCloseModalDelete = () => {
        setShowModalDelete(false)
    }
    const handleShowModalDelete = () => {
        setShowModalDelete(true)
    }

    

    const styles = {
        container: {
            height: '100vh',
            width: '100%',
        },
        containerCard: {
            backgroundColor: 'white',
            margin: '12px',
            boxShadow: '5px 5px 5px 0px rgba(0,0,0,0.75)',
        }
    }



    return (
        <div style={styles.container}>
        <React.Fragment>
            <Breadcrumb style={styles.containerCard}>
                <Breadcrumb.Item onClick={() => props.history.push('/home')}>Home</Breadcrumb.Item>
                <Breadcrumb.Item >EDM Archive {archiveId}</Breadcrumb.Item>
            </Breadcrumb>
            
            <Row>
                <Col md="12">
                    <Card style={styles.backMappings}>
                        <Card.Body>
                            <Card.Title className="text-center">Archive details</Card.Title>
                            This archive contains {archive.itemCount} items <br/>
                            Filename: {archive.filename} <br/>
                        </Card.Body>
                        <Card.Footer>
                            <Button size={'sm'} onClick={() => downloadArchive()} className="ml-3"><FontAwesomeIcon icon="download" size={'sm'} /> Download</Button>
                            <Button size={'sm'} onClick={() => enrichArchive()} className="ml-3"><FontAwesomeIcon icon="save" size={'sm'} /> Enrich Archive</Button>
                            <Button variant="danger" size={'sm'} onClick={() => handleShowModalDelete()} className="ml-3"><FontAwesomeIcon icon="delete" size={'sm'} /> Delete Archive</Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
            <br/>

            <Row>
                <Col md="4">
                    <Card style={styles.backMappings}>
                        <Card.Body>
                            <Card.Title className="text-center">Subject</Card.Title>
                            <hr/>
                            <table style={{maxHeight: '200px', overflow:'auto'}}><tbody>
                            {archiveTerms.subjectTerms.map((term,index)=> {
                                return <tr key={index}><td>{term.nativeTerm}</td><td>{term.language}</td></tr>
                            })}
                            </tbody></table>
                        </Card.Body>
                        <Card.Footer>
                            {
                                archive.thematicMapping > 0
                                ? <Button size={'sm'} onClick={() => props.history.push(`/mappings/${archive.thematicMapping}`)} className="ml-3"><FontAwesomeIcon icon="save" size={'sm'} /> Goto mapping</Button>
                                : <div><Button size={'sm'} variant="primary" onClick={() => createNewMapping('subject')} className="ml-3">Create new</Button>&nbsp;<Button size={'sm'} variant="primary" onClick={() => handleShowModalMappings()}>Add to Existing</Button></div>
                            }
                        </Card.Footer>
                    </Card>
                </Col>
                <Col md="4">
                    <Card style={styles.backMappings}>
                        <Card.Body>
                            <Card.Title className="text-center">Spatial</Card.Title>
                            <hr/>
                            <table style={{maxHeight: '200px', overflow:'auto'}}><tbody>
                            {archiveTerms.spatialTerms.map((term,index)=> {
                                return <tr key={index}><td>{term.nativeTerm}</td><td>{term.language}</td></tr>
                            })}
                            </tbody></table>
                        </Card.Body>
                        <Card.Footer>
                        {
                                archive.thematicMapping > 0
                                ? <Button size={'sm'} onClick={() => props.history.push(`/spatial/${archive.spatialMapping}`)} className="ml-3"><FontAwesomeIcon icon="save" size={'sm'} /> Goto mapping</Button>
                                : <div><Button size={'sm'} variant="primary" onClick={() => createNewMapping('spatial')} className="ml-3">Create new</Button>&nbsp;<Button size={'sm'} variant="primary" onClick={() => handleShowModalMappings()}>Add to Existing</Button></div>
                            }
                        </Card.Footer>
                    </Card>
                </Col>
                <Col md="4">
                    <Card style={styles.backMappings}>
                        <Card.Body>
                            <Card.Title className="text-center">Temporal</Card.Title>
                            <hr/>
                            <table style={{maxHeight: '200px', overflow:'auto'}}><tbody>
                            {archiveTerms.temporalTerms.map((term,index)=> {
                                return <tr key={index}><td>{term.nativeTerm}</td><td>{term.language}</td></tr>
                            })}
                            </tbody></table>
                        </Card.Body>
                        <Card.Footer>
                        {
                                archive.thematicMapping > 0
                                ? <Button size={'sm'} onClick={() => props.history.push(`/temporal/${archive.temporalMapping}`)} className="ml-3"><FontAwesomeIcon icon="save" size={'sm'} /> Goto mapping</Button>
                                : <div><Button size={'sm'} variant="primary" onClick={() => createNewMapping('temporald')} className="ml-3">Create new</Button>&nbsp;<Button size={'sm'} variant="primary" onClick={() => handleShowModalMappings()}>Add to Existing</Button></div>
                            }
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>


            <Modal show={showModalMappings} onHide={handleCloseModalMappings}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select Existing Mapping</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <table width="100%" style={{maxHeight: '500px', overflow:'auto'}}><tbody>
                        {mappings.map((mapping,index)=> {
                                return <tr key={index}><td>{mapping.label}</td><td align="right">{mapping.type}</td><td align="right"><Button size={'sm'} onClick={() => addToExistingMapping(mapping.id)} className="ml-3">Add</Button></td></tr>
                        })}
                        </tbody></table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModalMappings}>
                            Close
                    </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={showModalDelete} onHide={handleCloseModalDelete}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Confirm delete this archive and all of it's contents ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModalDelete}>
                            Close
                    </Button>
                        <Button variant="danger" onClick={() => deleteArchive()}>
                            Delete
                    </Button>
                    </Modal.Footer>
                </Modal>


        </React.Fragment> 
        </div>
    )

}
