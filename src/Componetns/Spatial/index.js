import React, { useState } from 'react'
import { Table, Breadcrumb, Button } from 'react-bootstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashAlt, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { postData, addToast } from '../../Utils'
import * as Resources from '../../Resources'
import NewSpatial from './NewSpatial';
import { ENDPOINT } from '../../config'
library.add(faSave, faTrashAlt, faCaretRight)

const Spatial = (props) => {

    const [showModal, setShowModal] = useState(false)
    const { history, mappings, languages } = props

    const onSave = (newSpatial) => {
        setShowModal(false)
        postData(ENDPOINT.SPATIAL_MAPPINGS, newSpatial, true)
            .then(mapping => props.updateMappings(mapping))
            .catch(() => addToast('Failed to create spatial mapping', Resources.TOAST.ERROR))
    }

    const mappingsTable = () => (
        <Table>
            <thead>
                <tr>
                    <th>Label</th>
                    <th>Description</th>
                    <th>Language</th>
                    <th>Vocabulary Name</th>
                    <th>Provider Name</th>
                    <th><Button variant="success" onClick={() => setShowModal(true)}>Create</Button></th>
                </tr>
            </thead>
            <tbody>
                {result}
            </tbody>
        </Table>
    )

    const result = mappings.map(mapping => {
        return <tr key={mapping.id}>
            <td>{mapping.label}</td>
            <td>{mapping.description}</td>
            <td>{mapping.language}</td>
            <td>{mapping.vocabularyName}</td>
            <td>{mapping.providerName}</td>
            <td><Button onClick={() => history.push(`/spatial/${mapping.id}`)}><FontAwesomeIcon icon="caret-right" /></Button></td>
        </tr>
    })

    return (
        <React.Fragment>
            <Breadcrumb>
                <Breadcrumb.Item onClick={() => props.history.push('/home')}>Home</Breadcrumb.Item>
                <Breadcrumb.Item onClick={() => props.history.push('/spatial')}>Spatial</Breadcrumb.Item>
            </Breadcrumb>
            {mappingsTable()}
            <NewSpatial onSave={onSave} onClose={() => setShowModal(false)} open={showModal} />

        </React.Fragment>
    )

}

export default Spatial
