import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Container } from "react-bootstrap";
import { GPayContext } from "../../context";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const { login } = useContext(GPayContext)
    const loginFn = async (e) => {
        e.preventDefault();
        login(formData.email, formData.password);
    }
    return (
        <Container className="d-flex flex-column justify-content-center w-50">
            <h1 className="display-4 text-center">Login</h1>
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })} />
                </Form.Group>
                <Button variant="primary" onClick={loginFn}>
                    Login
                </Button>
            </Form>
        </Container>
    )
}

export default LoginPage
