import '../user/User.css';
import {NavLink, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import NavBar from "../NavBar/NavBar";

function User() {
    const HistoryRef = useRef(null);
    const [history, setHistory] = useState([])
    const navigate = useNavigate();
    // const SetRef = useRef(null);

    useEffect(()=>{
        fetch(`http://51.107.7.88:3001/user/${sessionStorage.getItem("id")}`, {
            headers: {
                'accept': "text/plain",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "token":sessionStorage.getItem("token")
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("OK");
                    response.json().then((data) => {
                       setHistory(data.user_History)
                    })
                } else if (response.status === 401) {
                    navigate("/login");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    },[])

    // const test = () => {
    //     fetch(`http://51.107.7.88:3001/user/${sessionStorage.getItem("id")}`, {
    //         method: "Post",
    //         headers: {
    //             'accept': "text/plain",
    //             "Content-Type": "application/json",
    //             "Access-Control-Allow-Origin": "*",
    //             "token":sessionStorage.getItem("token")
    //         },
    //         body: JSON.stringify({
    //             name: 'login',
    //             result: '5/6',
    //             level: 'A1',
    //         }),
    //     }).then((response) => {
    //             if (response.status === 200) {
    //                 console.log("OK");
    //                 response.json().then((data) => {
    //                     console.log(data.user_History);
    //                 })
    //             } else if (response.status === 401) {
    //                 console.log("request has not been completed");
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Error:", error);
    //         });
    // }

    function show_user(){
        const user = HistoryRef.current;
        // const set = SetRef.current;
        user.style.display = "flex";
        // set.style.display = "none";
    }

    function show_set(){
        const user = HistoryRef.current;
        // const set = SetRef.current;
        // set.style.display = "flex";
        user.style.display = "none";
    }

    return (
        <div>
            <NavBar/>
            <div className={"user-main-cont"}>

                <div className={"top-menu"}>
                    <div onClick={show_user} className={"menu-btn"}>Історія Тестів</div>
                    {/*<div onClick={show_set} className={"menu-btn"}>Settings</div>*/}
                </div>
                {/*<button onClick={()=>test()}>aaaa</button>*/}
                <div ref={HistoryRef} className={"history-cont"}>
                    <table className={"history-table"}>
                        <thead>
                        <tr>
                            <th>Назва тесту</th>
                            <th>Рівень тесту</th>
                            <th>Результат</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.map((item, i)=>{
                            return <tr key={i}>
                                <td>{item.name}</td>
                                <td>{item.level}</td>
                                <td>{item.result}</td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>

                {/*<div ref={SetRef} className={"settings-cont"}>*/}
                {/*    <form className={"set-form"}>*/}
                {/*        <br/>*/}
                {/*        <lable>Login</lable>*/}
                {/*        <input className={"set-input"} type={"text"}/>*/}
                {/*        <button className={"edit-btn"} ref={LoginEdit}>Edit</button>*/}
                {/*        <button className={"save-btn"} ref={LoginSave}>Save</button>*/}
                {/*        <br/>*/}
                {/*        <lable>Email</lable>*/}
                {/*        <input className={"set-input"} type={"text"}/>*/}
                {/*        <button className={"edit-btn"} ref={EmailEdit}>Edit</button>*/}
                {/*        <button className={"save-btn"} ref={EmailSave}>Save</button>*/}
                {/*        <br/>*/}
                {/*        <lable>Password</lable>*/}
                {/*        <input className={"set-input"} type={"text"}/>*/}
                {/*        <button className={"edit-btn"} ref={PassEdit}>Edit</button>*/}
                {/*        <button className={"save-btn"} ref={PassSave}>Save</button>*/}
                {/*    </form>*/}
                {/*</div>*/}

            </div>
        </div>
    );
}
export default User;