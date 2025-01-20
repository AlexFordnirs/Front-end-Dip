import React, { useState, useRef } from "react";
import "./Registration.css";
import { NavLink, useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";

function Registration() {
    const navigate = useNavigate();
    const loginRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const repasswordRef = useRef(null);

    function Register() {
        const login = loginRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const rePassword = repasswordRef.current.value;
        const confirmed = false;

        console.log(login);
        console.log(email);
        console.log(password);
        console.log(confirmed);

        if(password!=rePassword){
            alert("Password is wrong");
        }else{
            fetch("http://51.107.7.88:3001/registration", {
                method: "Post",
                headers: {
                    'accept': "text/plain",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: sessionStorage.getItem("token"),
                },
                body: JSON.stringify({
                    login: login,
                    email: email,
                    password: password,
                    confirmed: confirmed,
                }),
            })
                .then((response) => {
                    if (response.status === 200) {
                        console.log("OK");
                        navigate("/login");
                    } else if (response.status === 401) {
                        console.log("request has not been completed");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }

    return (
        <div>
            <NavBar/>

            <div className={"main-cont"}>
                <form className={"form-cont"}>
                    <label>Логін</label>
                    <input ref={loginRef} type={"text"} />
                    <label>E-mail</label>
                    <input ref={emailRef} type={"email"} />
                    <label>Пароль</label>
                    <input ref={passwordRef} type={"password"} />
                    <label>Підтвердити Пароль</label>
                    <input ref={repasswordRef} type={"password"} />
                    <input
                        onClick={Register}
                        className={"submit-btn"}
                        type={"button"}
                        value={"Submit"}
                    />
                    <div className={"register-form"}>
                        <NavLink className={"login-btn"} to={"/login"}>
                            Увійти
                        </NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Registration;
