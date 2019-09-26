import React, { useState, Fragment } from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import backgroundImage from '../../assets/background.jpg';
import backgroundThematic from '../../assets/backgroundThematic.jpg';
import backgroundSpatial from '../../assets/backgroundSpatial.jpg';
import backgroundTemporal from '../../assets/backgroundTemporal.jpg';

function Home(props) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const homeCards = () => (
        <div style={styles.container}>
            <Card onClick={() => props.history.push('/mappings')} style={styles.backThematic}>
                <Card.Body>
                    <Card.Title className="text-center">Thematic Mappings</Card.Title>
                </Card.Body>
            </Card>

            <Card onClick={() => props.history.push('/spatial')} style={styles.backSpatial}>
                <Card.Body>
                    <Card.Title className="text-center">Spatial Mappings</Card.Title>
                </Card.Body>
            </Card>

            <Card style={styles.backTemporal} >
                <Card.Body>
                    <Card.Title className="text-center">Temporal Mappings</Card.Title>
                </Card.Body>
            </Card>
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

        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    },
    backThematic: {
        width: '20rem', height: '20rem', margin: '12px',
        backgroundImage: `url(${backgroundThematic})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    },
    backSpatial: {
        width: '20rem', height: '20rem', margin: '12px',
        backgroundImage: `url(${backgroundSpatial})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    },
    backTemporal: {
        width: '20rem', height: '20rem', margin: '12px',
        backgroundImage: `url(${backgroundTemporal})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    },
    link: {
        fontSize: 12,
        padding: 0
    }
}

export default Home
