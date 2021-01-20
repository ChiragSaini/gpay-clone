import React, { useReducer, createContext } from "react";
import userReducer from "./userReducer";
import axios from "axios";

const initialState = JSON.parse(localStorage.getItem('user')) || {};


export const GPayContext = createContext(initialState);

export const Provider = ({ children }) => {
    const [user, dispatch] = useReducer(userReducer, initialState);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post("http://localhost:3001/user/login", {
                email,
                password
            });
            dispatch({ type: "LOGIN", payload: data.user })
        } catch (error) {
            console.log(error)
        }
    }

    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post("http://localhost:3001/user/register", {
                name,
                email,
                password
            });
            return data;
        } catch (error) {
            console.log(error)
        }
    }

    const refreshUser = async () => {
        try {
            const { data } = await axios.get("http://localhost:3001/user/profileData", {
                headers: {
                    "auth-token": user.token
                }
            })
            dispatch({ type: "REFRESH_USER", payload: data.user })
        } catch (error) {

        }
    }

    const logout = async () => {
        dispatch({ type: "LOGOUT" })
    }

    return (
        <GPayContext.Provider value={{
            login,
            register,
            logout,
            refreshUser,
            user
        }}>
            {children}
        </GPayContext.Provider>
    )
}