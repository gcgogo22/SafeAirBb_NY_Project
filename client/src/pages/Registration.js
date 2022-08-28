import React from 'react';
import {Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Registration() {
    const initialValues = {
        username : "",
        password : "",
    };
    let navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required(),
    });

    const onSubmit = (data) => {
        axios.post("http://localhost:8081/auth", data).then(()=>{
            console.log(data);
            navigate("/");
        });
    };
    return (
        <div>
            <Formik
                initialValues = {initialValues}
                onSubmit = {onSubmit}
                validationSchema = {validationSchema}
            >
                <Form className={styles.loginContainer}>
                    <label>Username: </label>
                    <ErrorMessage name = "username" component = "span"/>
                    <Field
                        id = "inputCreatePost"
                        name = "username"
                        placeholder = ""
                    />

                    <label>Password: </label>
                    <ErrorMessage name = "password" component = "span"/>
                    <Field
                        type = "password"
                        id = "inputCreatePost"
                        name = "password"
                        placeholder = "Your password"
                    />

                    <button type = "submit"> REGISTRATION </button>
                </Form>
            </Formik>
        </div>
    )
}

export default  Registration