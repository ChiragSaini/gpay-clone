import React, { useState, useEffect, useContext } from 'react';
import { Container, Jumbotron, Row, Col, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import UserPill from "../UserPill";

import { GPayContext } from "../../context";

const MainPage = () => {
    const [users, setUsers] = useState([])
    const fetchPublicData = async () => {
        const { data } = await axios.get("http://localhost:3001/publicInfo");
        setUsers(data.users);
    }
    const logoutFn = () => {
        logout();
    }
    const { user, logout, refreshUser } = useContext(GPayContext);

    useEffect(() => {
        fetchPublicData();
        refreshUser();
    }, [])

    console.log({ user })

    return (
        <Container>
            <Jumbotron>
                <h3 className="text-center">Welcome to GPAY-Clone</h3>
            </Jumbotron>
            <Row>
                <Col md={5} className="d-flex flex-column align-items-center justify-content-center bg-light">
                    {
                        user.token
                            ?
                            <>
                                <h3>Welcome {user.name}</h3>
                                <h4>Balance: {user.balance}</h4>
                                <Button variant="warning" onClick={logoutFn}>Logout</Button>
                            </>
                            :
                            <>
                                <h4>Login to View you Balance and Info</h4>
                                <div>
                                    <Link to="/login" style={{ margin: 8 }}><Button variant="primary">Login</Button></Link>
                                    <Link to="/register" style={{ margin: 8 }}><Button variant="info">Register</Button></Link>
                                </div>
                            </>
                    }
                </Col>
                <Col md={7}>
                    <h4>Here is the List of all the Users</h4>
                    <div className="d-flex">
                        {
                            users.map((u, idx) => {
                                const active = u.name === user.name;
                                if (active) {
                                    return (
                                        <UserPill key={idx} name={u.name} active={true} />
                                    )
                                }
                                return (
                                    <Link key={idx} to={`/pay/${u.email}`}>
                                        <UserPill name={u.name} active={false} />
                                    </Link>
                                )
                            }

                            )
                        }
                    </div>
                </Col>
            </Row>
            <Row className="mt-4">
                <h4>Here is a list of your transactions</h4>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Receipent Email</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            user.transactions?.map((t, idx) => (
                                <tr style={{ backgroundColor: `${t.typeOfTransaction === "Sent" ?  "#eb347222" : "#00968822"}` }}>
                                    <td>{idx + 1}</td>
                                    <td>{t.typeOfTransaction}</td>
                                    <td>{t.receipentEmail}</td>
                                    <td>{t.amount}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Row>
        </Container>
    )
}

export default MainPage
