import React, { useState, useContext } from 'react';
import { Form, Button, Container } from "react-bootstrap";
import { GPayContext } from "../../context";

const initialState = {
    name:"",
    email: "",
    password: ""
}

const RegisterPage = () => {
    const [formData, setFormData] = useState(initialState)
    const { register, login } = useContext(GPayContext)
    const registerFn = async (e) => {
        e.preventDefault();
        const result = await register(formData.name, formData.email, formData.password);
        if(result.success){
            login(formData.email, formData.password);
            return;
        }
    }
    return (
        <Container className="d-flex flex-column justify-content-center w-50">
            <h1 className="display-4 text-center">Register</h1>
            <Form>
            <Form.Group controlId="formBasicEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </Form.Group>
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
                <Button variant="primary" onClick={registerFn}>
                    Register
                </Button>
            </Form>
        </Container>
    )
}

export default RegisterPage
