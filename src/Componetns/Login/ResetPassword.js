import React, { useState, Fragment } from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import backgroundImage from '../../assets/background.jpg';

function ResetPassword(props) {

    const [email, setEmail] = useState('')

    const resetPasswordForm = () => (
        <div style={styles.container}>
            <Card style={{ width: '25rem' }}>
                <Card.Body>
                    <Card.Title className="text-center">Login</Card.Title>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                    </Form.Group>
                    
                    <Button variant="primary" onClick={() => props.resetPassword(email)}>Reset</Button>
                    <hr />
                    <Form.Text className="text-muted">
                        Back to login <Button variant="link" style={styles.link} onClick={() => props.history.push('/login')}>Login</Button>
                    </Form.Text>
                </Card.Body>
            </Card>
        </div>
    )
    return (
        <Fragment>
            {
                !props.isLoading && props.isAuth
                    ? <Redirect to='/' />
                    : resetPasswordForm()
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

export default ResetPassword
