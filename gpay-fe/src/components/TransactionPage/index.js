import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Button, Form, Alert } from "react-bootstrap";
import { GPayContext } from "../../context"

const TransactionPage = () => {
    let { receiverEmail } = useParams();
    const [userState, setUserState] = useState(null);
    const { user } = useContext(GPayContext);
    const [amount, setAmount] = useState(0);
    const [successMessage, setSuccessMessage] = useState(null);
    const checkIfUserExists = async () => {
        const { data } = await axios.get("http://localhost:3001/publicInfo");
        const user = data.users.filter(user => user.email === receiverEmail)[0]
        return user;
    }

    const pay = async (e) => {
        e.preventDefault();
        if (Number.isNaN(amount) || amount <= 0) {
            setAmount(0)
            setSuccessMessage("Invalid Value to Send")
            return;
        }
        const body = {
            email: userState,
            amount: Number(amount)
        }
        try {
            const res = await axios.post("http://localhost:3001/transaction/pay", body, {
                headers: {
                    "auth-token": user.token
                }
            });
            setAmount(0)
            setSuccessMessage(res.data.message);
        } catch (error) {
            setSuccessMessage(error.message)
        }
    }

    useEffect(async () => {
        const user = await checkIfUserExists();
        if (user) {
            setUserState(user.email)
        }
    }, [])
    return (
        <div>
            {
                userState
                    ?
                    <Container className="d-flex flex-column justify-content-center align-items-center mt-5">
                        <h1 className="mt-5 mb-3">This is Transactions Page for {userState}</h1>
                        <Form.Control
                            type="number"
                            placeholder="Enter Amount you want to send"
                            value={amount}
                            className="w-25"
                            onChange={e => setAmount(e.target.value)}
                        />
                        <Button className="m-3" variant="success" onClick={pay}>Pay {userState}</Button>
                    </Container>
                    :
                    <p>No Such user eixsts</p>
            }
            {
                successMessage &&
                <Alert className="mt-3" variant={"success"}>
                    {successMessage}
                </Alert>
            }
        </div>
    )
}

export default TransactionPage
