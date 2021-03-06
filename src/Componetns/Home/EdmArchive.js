import React, { useEffect, useState } from 'react'
import { fetchData, deleteData, addToast, getExcel, getFile, postData } from '../../Utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TOAST } from '../../Resources'
import { ENDPOINT, BASE_URL } from '../../config'
import { Form, Modal, Card, Row, Col, Table, Breadcrumb, Button, Container } from 'react-bootstrap'
import { faTrashAl, faArrowRight, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

const archiveSchema = {
    createdAt: "",
    createdBy: null,
    filename: "",
    filepath: "",
    enrichedFilepath: null,
    enrichedFilename: null,
    id: 0,
    itemCount: 0,
    name: "",
    spatialMapping: 0,
    temporalMapping: 0,
    thematicMapping: 0
}

const archiveTermsSchema = {
    subjectTermEntities: [],
    spatialTermEntities: [],
    temporalTermEntities: []
}

export default function EdmArchive(props) {

    const { edmArchives, loadEdmArchives } = props
    const [archiveTerms, setArchiveTerms] = useState(archiveTermsSchema)
    const [mappings, setMappings] = useState([])
    const [showModalMappings, setShowModalMappings] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)
    const archiveId = props.match.params.id
    const [archive, setArchive] = useState(archiveSchema)
    const [searchSubject, setSearchSubject] = useState('')
    const [searchSpatial, setSearchSpatial] = useState('')
    const [searchTemporal, setSearchTemporal] = useState('')

    const LoadingIndicator = props => {
        const { promiseInProgress } = usePromiseTracker();
        return (
            promiseInProgress && 
            <div
                style={{
                    width: "100%",
                    height: "100",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
            <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
            </div>
        );  
    }

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
        const url = `${ENDPOINT.EDM_ARCHIVES}/${archiveId}/terms`
        fetchData(url, true, true)
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
        if (!archive) return addToast('Archive not found', TOAST.ERROR)
        const url = `${ENDPOINT.EDM_ARCHIVES}/${archiveId}/download`
        getFile(url, {}, archive.filename).catch(() => addToast('Failed to download archive', TOAST.ERROR))
    }
    
    const downloadEnrichedArchive = () => {
        if (!archive) return addToast('Enriched Archive not found', TOAST.ERROR)
        const url = `${ENDPOINT.EDM_ARCHIVES}/${archiveId}/download?type=eEDM`
        getFile(url, {}, archive.enrichedFilename).catch(() => addToast('Failed to download archive', TOAST.ERROR))     
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
        const url = `${ENDPOINT.EDM_ARCHIVES}/${archiveId}/enrich`
        let resStatus = 0
        trackPromise(
            postData(url, {}, true, true)
            .then(data => {
                //console.log(data)
                if(data.success) {
                    setArchive(prevArchive => ({
                        ...prevArchive,
                        enrichedFilename:data.enrichedArchiveName,
                        enrichedFilepath:data.enrichedArchiveName
                    }))
                }
            })
            .then((res) => {
                console.log(res);
             })
            .catch(ex => addToast(ex.message, TOAST.ERROR))
        )
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
    

    const updateSearchSubject = (value) => {
        setSearchSubject(value)
    }
    const updateSearchSpatial = (value) => {
        setSearchSpatial(value)
    }
    const updateSearchTemporal = (value) => {
        setSearchTemporal(value)
    }

    const getFilteredSubjects = () => {
        return archiveTerms.subjectTermEntities.filter(term => {
            return term.nativeTerm.toLowerCase().includes(searchSubject.toLowerCase())
        })
    }
    const getFilteredSpatial = () => {
        return archiveTerms.spatialTermEntities.filter(term => {
            return term.nativeTerm.toLowerCase().includes(searchSpatial.toLowerCase())
        })
    }
    const getFilteredTemporal = () => {
        return archiveTerms.temporalTermEntities.filter(term => {
            return term.nativeTerm.toLowerCase().includes(searchTemporal.toLowerCase())
        })
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
        },
        tableCard: {
            maxHeight: '300px',
            height: '300px',
            overflow: 'auto'
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
                            <Button size={'sm'} onClick={() => downloadArchive()} className="ml-3"><FontAwesomeIcon icon="download" size={'sm'} /> Download Original</Button>
                            <Button size={'sm'} onClick={() => enrichArchive()} className="ml-3"><FontAwesomeIcon icon="save" size={'sm'} /> Enrich Archive</Button>
                            <Button size={'sm'} disabled={archive && !archive.enrichedFilepath} onClick={() => downloadEnrichedArchive()} className="ml-3"><FontAwesomeIcon icon="download" size={'sm'} /> Download Enriched</Button>
                            <Button variant="danger" size={'sm'} onClick={() => handleShowModalDelete()} className="ml-3"><FontAwesomeIcon icon="trash-alt" size={'sm'} /> Delete Archive</Button>
                            <LoadingIndicator/>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
            <br/>

            <Row>
                <Col md="4">
                    <Card style={styles.backMappings}>
                        <Card.Body>
                            <Card.Title className="text-center">Subject ({archiveTerms && archiveTerms.subjectTermEntities && archiveTerms.subjectTermEntities.length})</Card.Title>
                            <Row>
                                <Col sm="1"></Col>
                                <Col sm="10">
                                    <Form.Control onChange={(e) => updateSearchSubject(e.target.value)} value={searchSubject} placeholder='Search subject terms' />
                                </Col> 
                                <Col sm="1"></Col>
                            </Row>
                            <hr/>
                            <div style={styles.tableCard}>
                            <Table>
                                <tbody>  
                                {archiveTerms && getFilteredSubjects().map((term,index)=> {
                                    return <tr key={index}><td>{term.nativeTerm}</td><td>{term.language && term.language}</td><td>{term.count && term.count}</td><td>{term.aatUid && <FontAwesomeIcon icon={faExchangeAlt} size={"sm"}/>}</td></tr>
                                })}
                                </tbody>
                            </Table>
                            </div>
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
                            <Card.Title className="text-center">Spatial ({archiveTerms && archiveTerms.spatialTermEntities && archiveTerms.spatialTermEntities.length})</Card.Title>
                            <Row>
                                <Col sm="1"></Col>
                                <Col sm="10">
                                    <Form.Control onChange={(e) => updateSearchSpatial(e.target.value)} value={searchSpatial} placeholder='Search spatial terms' />
                                </Col>
                                <Col sm="1"></Col>
                            </Row>                           
                            <hr/>
                            <div style={styles.tableCard}>
                            <Table>
                                <tbody>  
                                {archiveTerms && getFilteredSpatial().map((term,index)=> {
                                    return <tr key={index}><td>{term.nativeTerm}</td><td>{term.language && term.language}</td><td>{term.count && term.count}</td><td>{term.aatUid && <FontAwesomeIcon icon={faExchangeAlt} size={"sm"}/>}</td></tr>
                                })}
                                </tbody>
                            </Table>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            {
                                archive.spatialMapping > 0
                                ? <Button size={'sm'} onClick={() => props.history.push(`/spatial/${archive.spatialMapping}`)} className="ml-3"><FontAwesomeIcon icon="save" size={'sm'} /> Goto mapping</Button>
                                : <div><Button size={'sm'} variant="primary" onClick={() => createNewMapping('spatial')} className="ml-3">Create new</Button>&nbsp;<Button size={'sm'} variant="primary" onClick={() => handleShowModalMappings()}>Add to Existing</Button></div>
                            }
                        </Card.Footer>
                    </Card>
                </Col>
                <Col md="4">
                    <Card style={styles.backMappings}>
                        <Card.Body>
                            <Card.Title className="text-center">Temporal ({archiveTerms && archiveTerms.temporalTermEntities && archiveTerms.temporalTermEntities.length})</Card.Title>
                            <Row>
                                <Col sm="1"></Col>
                                <Col sm="10">
                                    <Form.Control onChange={(e) => updateSearchTemporal(e.target.value)} value={searchTemporal} placeholder='Search temporal terms' />
                                </Col> 
                                <Col sm="1"></Col>
                            </Row>                            
                            <hr/>
                            <div style={styles.tableCard}>
                            <Table>
                                <tbody>  
                                    {archiveTerms && getFilteredTemporal().map((term,index)=> {
                                        return <tr key={index}><td>{term.nativeTerm}</td><td>{term.language && term.language}</td><td>{term.count && term.count}</td><td>{term.aatUid && <FontAwesomeIcon icon={faExchangeAlt} size={"sm"}/>}</td></tr>
                                    })}
                                </tbody>
                            </Table>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            {
                                archive.temporalMapping > 0
                                ? <Button size={'sm'} onClick={() => props.history.push(`/temporal/${archive.temporalMapping}`)} className="ml-3"><FontAwesomeIcon icon="save" size={'sm'} /> Goto mapping</Button>
                                : <div><Button size={'sm'} variant="primary" onClick={() => createNewMapping('temporal')} className="ml-3">Create new</Button>&nbsp;<Button size={'sm'} variant="primary" onClick={() => handleShowModalMappings()}>Add to Existing</Button></div>
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
