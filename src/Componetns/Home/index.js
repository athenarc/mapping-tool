import React, { useState, Fragment } from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import backgroundImage from '../../assets/background.jpg';

function Home(props) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const homeCards = () => (
        <div style={styles.container}>
            <Card onClick={() => props.history.push('/mappings')} style={{ width: '20rem', height: '20rem', margin: '12px' }}>
                <Card.Body>
                    <Card.Title className="text-center">Thematic Mappings</Card.Title>
                </Card.Body>
            </Card>

            <Card onClick={() => props.history.push('/spatial')} style={{ width: '20rem', height: '20rem', margin: '12px' }}>
                <Card.Body>
                    <Card.Title className="text-center">Spatial Mappings</Card.Title>
                </Card.Body>
            </Card>

            <Card style={{ width: '20rem', height: '20rem', margin: '12px' }}>
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
    link: {
        fontSize: 12,
        padding: 0
    }
}

export default Home
