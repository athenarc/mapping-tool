import React, { useState } from 'react'
import { Table, Breadcrumb, Button } from 'react-bootstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashAlt, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { postData, addToast } from '../../Utils'
import * as Resources from '../../Resources'
import NewTemporal from './NewTemporal';
import { ENDPOINT } from '../../config'
library.add(faSave, faTrashAlt, faCaretRight)

const Temporal = (props) => {

    const [showModal, setShowModal] = useState(false)
    const { history, mappings, languages } = props

    const onSave = (NewTemporal) => {
        setShowModal(false)
        postData(ENDPOINT.TEMPORAL_MAPPINGS, NewTemporal, true)
            .then(mapping => props.updateMappings(mapping))
            .catch(() => addToast('Failed to create temporal mapping', Resources.TOAST.ERROR))
    }

    const mappingsTable = () => (
        <div style={styles.containerCard}>
            <Table>
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>Description</th>
                        <th>Language</th>
    
                        <th><Button variant="success" onClick={() => setShowModal(true)}>Create</Button></th>
                    </tr>
                </thead>
                <tbody>
                    {result}
                </tbody>
            </Table>
        </div>
    )

    const result = mappings.map(mapping => {
        return <tr key={mapping.id}>
            <td>{mapping.label}</td>
            <td>{mapping.description}</td>
            <td>{mapping.language}</td>
 
            <td><Button onClick={() => history.push(`/temporal/${mapping.id}`)}><FontAwesomeIcon icon="caret-right" /></Button></td>
        </tr>
    })

    return (
        <React.Fragment>
            <Breadcrumb style={styles.containerCard}>
                <Breadcrumb.Item onClick={() => props.history.push('/home')}>Home</Breadcrumb.Item>
                <Breadcrumb.Item onClick={() => props.history.push('/temporal')}>Temporal</Breadcrumb.Item>
            </Breadcrumb>
            {mappingsTable()}
            <NewTemporal onSave={onSave} onClose={() => setShowModal(false)} open={showModal} />

        </React.Fragment>
    )

}


const styles = {
    containerCard: {
        backgroundColor: 'white',
        margin: '12px',
        boxShadow: '5px 5px 5px 0px rgba(0,0,0,0.75)',
    }
}

export default Temporal
