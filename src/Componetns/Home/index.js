import React, { useState, useEffect, Fragment } from 'react'
import { Card, Button, Modal, Form } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import * as Resourses from '../../Resources'
import backgroundImage from '../../assets/background.jpg';
import backgroundThematic from '../../assets/backgroundThematic.jpg';
import backgroundSpatial from '../../assets/backgroundSpatial.jpg';
import backgroundTemporal from '../../assets/backgroundTemporal.jpg';
import { isAbsolute } from 'path';
import Dropzone from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashAlt, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { fetchData, addToast, postData, postUpload } from '../../Utils';
import { ENDPOINT } from '../../config'
import { TOAST } from '../../Resources';

function Home(props) {

    //const [isAuth, setIsAuth] = useState(false)
    const { edmArchives, loadEdmArchives } = props
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [highlight, setHighlight] = useState(true)
    const [isMounted, setIsMounted] = useState(false)
    const [showModalDropEDM, setShowModalDropEDM] = useState(false)

    useEffect(() => {
        
    }, [])


    const extractTerms = (archiveId) => {
        const url = `${ENDPOINT.EDM_ARCHIVES}/${archiveId}/extract_terms`
        postData(url, true, true)
        .then(data => {
            ;
        })
        .catch(() => addToast('Something went wrong', TOAST.ERROR)) 
    }


    const handleShowModalDropEDM = () => {
        setShowModalDropEDM(true)
    }
    const handleCloseModalDropEDM = () => {
        setShowModalDropEDM(false)
    }

    const onDropEDM = (files) => {
        var data = new FormData()
        files.forEach(file => {
            data.append('file', file, file.name)
        });

        postUpload(`${ENDPOINT.EDM_ARCHIVES_UPLOAD}`, data, true)
            .then( (data) => {
                extractTerms(data.id)
                props.loadEdmArchives() 
            })
            .catch(() => addToast('Failed to upload', TOAST.ERROR))
        handleCloseModalDropEDM()

    }

    const onDragOverEDM = (evt) => {
        evt.preventDefault()

        if (props.disabled) return

        this.setState({ hightlightEDM: true })
    }

    const onDragLeaveEDM = () => {
        this.setState({ hightlightEDM: false })
    }


    const edmArchivesCards = edmArchives.map(edmArchive => {
        console.log(edmArchive)
        return <Button key={edmArchive.id} variant="outline-info" block onClick={() => props.history.push(`/edmarchives/${edmArchive.id}`)}>{edmArchive.name} ({edmArchive.itemCount} items)<FontAwesomeIcon icon="caret-right" /> </Button>
    })

    const homeCards = () => (
        <div style={styles.container}>

            <Card style={styles.backMappings}>
                <Card.Body>
                    <Card.Title className="text-center">My Mappings</Card.Title>
                    <Button variant="outline-primary" block onClick={() => props.history.push('/mappings')}>Thematic Mappings <FontAwesomeIcon icon="caret-right" /> </Button>
                    <Button variant="outline-primary" block onClick={() => props.history.push('/spatial')}>Spatial Mappings <FontAwesomeIcon icon="caret-right" /> </Button>
                    <Button variant="outline-primary" block >Temporal Mappings <FontAwesomeIcon icon="caret-right" /> </Button>
                </Card.Body>
            </Card>

            <Card style={styles.backEDMUploads}>
                <Card.Body>
                    <Card.Title className="text-left">
                        My EDM Uploads &nbsp;
                        <Button variant="primary" className="pull-right" onClick={() => handleShowModalDropEDM()}><FontAwesomeIcon icon="upload" size={'sm'} /> EDM</Button>
                    </Card.Title>
                    {edmArchivesCards}
                    
                </Card.Body>
            </Card>


            <div className="containerImg" />

            <Modal show={showModalDropEDM} onHide={handleCloseModalDropEDM}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload a new EDM Archive</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Dropzone className={`Dropzone ${highlight ? 'Highlight' : ''}`}
                        onDrop={onDropEDM}
                        onDragOver={onDragOverEDM}
                        onDragLeave={onDragLeaveEDM}
                        style={{ cursor: props.disabled ? 'default' : 'pointer' }} >
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
                    <Button variant="secondary" onClick={handleCloseModalDropEDM}>
                        Close
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
    return (
        <Fragment>
            {
                !props.isLoading && props.isAuth
                    ? <Redirect to='/' />
                    : homeCards()
            }
        </Fragment>
    )
}

const styles = {
    container: {
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(235, 235, 224)',
    },
    containerImg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100vh',
        opacity: 0.6,
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        zIndex: 2,
    },
    backMappings: {
        width: '20rem', height: '30rem', margin: '12px',
        boxShadow: '5px 5px 5px 0px rgba(0,0,0,0.75)',
    },
    backEDMUploads: {
        width: '40rem', height: '30rem', margin: '12px',
        boxShadow: '5px 5px 5px 0px rgba(0,0,0,0.75)',
        zIndex: 2,
    },
    link: {
        fontSize: 12,
        padding: 0
    }
}

export default Home
