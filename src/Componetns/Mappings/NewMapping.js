import React, { useState, useEffect } from 'react'
import { Col, Row, Modal, Button, Form } from 'react-bootstrap'

const MappingSchema = {
    label: '',
    description: '',
    vocabularyName: '',
    language: '',
    providerName: ''
}

function NewMapping({ onClose, onSave, open }) {

    const [newMapping, setNewMapping] = useState(MappingSchema)

    useEffect(() => {
        setNewMapping(MappingSchema)
    }, [open])

    const updateMappingProp = (prop, value) => {
        setNewMapping({ ...newMapping, [prop]: value })
    }

    return (
        <Modal show={open} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create new Mapping</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group as={Row} controlId="label">
                    <Form.Label column sm="2">Label</Form.Label>
                    <Col sm="10">
                        <Form.Control onChange={(e) => updateMappingProp('label', e.target.value)} value={newMapping.label} placeholder='Add label' />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="description">
                    <Form.Label column sm="2">Description</Form.Label>
                    <Col sm="10">
                        <Form.Control onChange={(e) => updateMappingProp('description', e.target.value)} value={newMapping.description} placeholder='Add description' />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="language">
                    <Form.Label column sm="2">Language</Form.Label>
                    <Col sm="10">
                        <Form.Control onChange={(e) => updateMappingProp('language', e.target.value)} value={newMapping.language} placeholder='Add description' />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="Vocabulary Name">
                    <Form.Label column sm="2">Vocabulary Name</Form.Label>
                    <Col sm="10">
                        <Form.Control onChange={(e) => updateMappingProp('vocabularyName', e.target.value)} value={newMapping.vocabularyName} placeholder='Add description' />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="Provider Name">
                    <Form.Label column sm="2">Provider Name</Form.Label>
                    <Col sm="10">
                        <Form.Control onChange={(e) => updateMappingProp('providerName', e.target.value)} value={newMapping.providerName} placeholder='Add description' />
                    </Col>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                        </Button>
                <Button variant="primary" onClick={() => onSave(newMapping)}>
                    Save Changes
                        </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NewMapping
