import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import styles from "./Login.module.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthState } = useContext(AuthContext);
    let navigate = useNavigate();

    const login = () => {
        const data = { username: username, password: password };
        axios.post("http://localhost:8081/login", data).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            } else {
                localStorage.setItem("accessToken", response.data.token);
                setAuthState({
                    username: response.data.username,
                    status: true,
                });
                navigate("/");
            }
        });
    };
    return (
        <div className={styles.loginContainer}>
            <label>Username:</label>
            <input
                type="text"
                onChange={(event) => {
                    setUsername(event.target.value);
                }}
            />
            <label>Password:</label>
            <input
                type="password"
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
            />

            <button onClick={login}> LOGIN </button>
        </div>
    );
}

export default Login;