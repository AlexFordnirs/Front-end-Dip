import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UsersPanel() {
    const navigate = useNavigate();

    // Режим отображения: "table" или "add"
    const [viewMode, setViewMode] = useState("table");

    // Список пользователей, загружаемых с сервера
    const [userData, setUserData] = useState([]);

    // Поля для добавления нового пользователя
    const [userLogin, setUserLogin] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    // --------------------------
    // useEffect: при первом рендере -> показать таблицу
    // --------------------------
    useEffect(() => {
        showUsersTable();
        // eslint-disable-next-line
    }, []);

    // ===============================
    //    1) Показ таблицы (Fetch)
    // ===============================
    async function showUsersTable() {
        setViewMode("table");
        try {
            const response = await fetch("http://51.107.7.88:3001/user", {
                headers: {
                    accept: "text/plain",
                    "Content-Type": "application/json",
                    token: sessionStorage.getItem("adminToken"),
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                setUserData(data);
            } else if (response.status === 401) {
                navigate("/admin");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //    2) Перейти в режим "add"
    // ===============================
    function showUsersAdd() {
        setViewMode("add");
    }

    // ===============================
    //    3) Добавление нового пользователя
    // ===============================
    async function addUserHandler() {
        try {
            // Допустим, что POST на "/user" создаёт нового пользователя,
            // и в body мы передаём { login, email, password }.
            // Проверьте, совпадает ли это с вашим бэкендом.
            const response = await fetch("http://51.107.7.88:3001/user", {
                method: "POST",
                headers: {
                    accept: "text/plain",
                    "Content-Type": "application/json",
                    token: sessionStorage.getItem("adminToken"),
                },
                body: JSON.stringify({
                    login: userLogin,
                    email: userEmail,
                    password: userPassword,
                }),
            });
            if (response.status === 201) {
                console.log("User created!");
                // Сбрасываем форму
                setUserLogin("");
                setUserEmail("");
                setUserPassword("");
                // И возвращаемся к таблице
                showUsersTable();
            } else if (response.status === 401) {
                navigate("/admin");
            } else {
                console.log("Request has not been completed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //    4) Удаление пользователя
    // ===============================
    async function deleteUserHandler(id) {
        try {
            // Допустим, что DELETE "/user/:id" удаляет пользователя по его Id.
            // Проверьте, совпадает ли с вашим бэкендом.
            const response = await fetch(`http://51.107.7.88:3001/user/${id}`, {
                method: "DELETE",
                headers: {
                    accept: "text/plain",
                    "Content-Type": "application/json",
                    token: sessionStorage.getItem("adminToken"),
                },
            });
            if (response.status === 200) {
                console.log("User deleted!");
                showUsersTable();
            } else if (response.status === 401) {
                navigate("/admin");
            } else {
                console.log("Request has not been completed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //    RENDER
    // ===============================
    return (
        <div className="users-cont" style={{ display: "flex", flexDirection: "column" }}>
            <div className="users-top-btn">
                <div onClick={showUsersTable} className="top-btn">
                    Table
                </div>
                <div onClick={showUsersAdd} className="top-btn">
                    Add
                </div>
            </div>

            {/* Режим TABLE */}
            {viewMode === "table" && (
                <div className="users-table-cont" style={{ display: "flex" }}>
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>User Id</th>
                            <th>User Login</th>
                            <th>User Email</th>
                            <th>Delete Btn</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userData.map((item) => (
                            <tr key={item._id}>
                                <td>{item._id}</td>
                                <td>{item.login}</td>
                                <td>{item.email}</td>
                                <td>
                                    <div className="users-delete" onClick={() => deleteUserHandler(item._id)}>
                                        Delete
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Режим ADD */}
            {viewMode === "add" && (
                <div className="users-add-cont" style={{ display: "flex" }}>
                    <form
                        className="users-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <label>Login</label>
                        <input
                            className="users-name"
                            type="text"
                            value={userLogin}
                            onChange={(e) => setUserLogin(e.target.value)}
                        />
                        <br />

                        <label>Email</label>
                        <input
                            className="users-name"
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                        <br />

                        <label>Password</label>
                        <input
                            className="users-name"
                            type="password"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                        />
                        <br />

                        <input
                            value="Submit"
                            onClick={addUserHandler}
                            className="users-submit-btn"
                            type="button"
                        />
                    </form>
                </div>
            )}
        </div>
    );
}

export default UsersPanel;
