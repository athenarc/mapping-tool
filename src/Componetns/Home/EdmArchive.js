import React, { useEffect, useState } from 'react'
import { fetchData, addToast } from '../../Utils'
import { TOAST } from '../../Resources'
import { Table, Breadcrumb, Button, Container } from 'react-bootstrap'

const archiveSchema = {
    title: "",
    description: ""
}

export default function EdmArchive(props) {

    const archiveId = props.match.params.id
    const [archive, setArchive] = useState(archiveSchema)
    console.log(archive)

    
    // useEffect(() => {
    //     fetchData(".../" + archiveId)
    //     .then(archive => {
    //         setArchive(archive)
    //     }).catch(ex => {
    //         console.log(ex)
    //         addToast("Failed to load archive", TOAST.ERROR)
    //     })
    // }, [archiveId])

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
            
        </React.Fragment> 
        </div>
    )

}
