import "./AdminLogin.css"
import { NavLink, useNavigate } from "react-router-dom";
import {useRef, useState} from "react";
import NavBar from "../NavBar/NavBar";

function AdminLogin(){
    const navigate = useNavigate();
    const AdminloginRef = useRef(null);
    const AdminPasswordRef = useRef(null);

    function AdminLogin(){

        const login = AdminloginRef.current.value;
        const password = AdminPasswordRef.current.value;

        console.log(login);
        console.log(password);

        fetch("http://51.107.7.88:3001/AdminAuth", {
            method: "Post",
            headers: {
                'accept': "text/plain",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",

            },
            body: JSON.stringify({
                login: login,
                password: password
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("OK");
                    response.json().then((data) => {
                        sessionStorage.setItem('adminToken', data)
                        navigate("/adminSite");
                    })
                } else if (response.status === 401) {
                    console.log("request has not been completed");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    return(
        <div>
            <NavBar/>

            <div className={"admin-main-cont"}>
                <form className={"admin-form-cont"}>
                    <label>Admin Login</label>
                    <input ref={AdminloginRef} type={"email"}/>
                    <label>Admin Password</label>
                    <input ref={AdminPasswordRef} type={"password"}/>
                    <input onClick={AdminLogin} value={"Submit"} className={"admin-submit-btn"} type={"button"}/>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;