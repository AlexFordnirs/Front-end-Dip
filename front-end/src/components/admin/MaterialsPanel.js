import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MaterialsPanel() {
    const navigate = useNavigate();

    // Режим отображения: "table" или "add"
    const [viewMode, setViewMode] = useState("table");

    // Список материалов, загруженных с сервера
    const [materialData, setMaterialData] = useState([]);

    // Поля для добавления нового материала
    const [materialName, setMaterialName] = useState("");
    const [materialLink, setMaterialLink] = useState("");
    const [materialIsVideo, setMaterialIsVideo] = useState(false);

    // --------------------------
    // useEffect: при первом рендере -> показать таблицу
    // --------------------------
    useEffect(() => {
        showMaterialsTable();
        // eslint-disable-next-line
    }, []);

    // ===============================
    //    1) Показ таблицы (Fetch)
    // ===============================
    async function showMaterialsTable() {
        setViewMode("table");
        try {
            const response = await fetch("http://51.107.7.88:3001/material", {
                headers: {
                    accept: "text/plain",
                    "Content-Type": "application/json",
                    token: sessionStorage.getItem("adminToken"),
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                setMaterialData(data);
            } else if (response.status === 401) {
                // Токен недействителен
                navigate("/admin");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //    2) Перейти в режим "add"
    // ===============================
    function showMaterialsAdd() {
        setViewMode("add");
    }

    // ===============================
    //    3) Добавление нового материала
    // ===============================
    async function addMaterialHandler() {
        try {
            const response = await fetch("http://51.107.7.88:3001/material", {
                method: "POST",
                headers: {
                    accept: "text/plain",
                    "Content-Type": "application/json",
                    token: sessionStorage.getItem("adminToken"),
                },
                body: JSON.stringify({
                    name: materialName,
                    link: materialLink,
                    type: materialIsVideo, // логическое значение
                }),
            });
            if (response.status === 201) {
                console.log("OK");
                // Сбрасываем поля формы
                setMaterialName("");
                setMaterialLink("");
                setMaterialIsVideo(false);
                // После добавления сразу вернёмся к таблице (или можете оставить в режиме "add")
                showMaterialsTable();
            } else if (response.status === 401) {
                navigate("/admin");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //    4) Удаление материала
    // ===============================
    async function deleteMaterialHandler(id) {
        try {
            const response = await fetch(`http://51.107.7.88:3001/material/${id}`, {
                method: "DELETE",
                headers: {
                    accept: "text/plain",
                    "Content-Type": "application/json",
                    token: sessionStorage.getItem("adminToken"),
                },
            });
            if (response.status === 200) {
                showMaterialsTable();
            } else if (response.status === 401) {
                navigate("/admin");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //    RENDER
    // ===============================
    return (
        <div className="materials-cont" style={{ display: "flex", flexDirection: "column" }}>
            <div className="materials-top-btn">
                <div onClick={showMaterialsTable} className="top-btn">
                    Table
                </div>
                <div onClick={showMaterialsAdd} className="top-btn">
                    Add
                </div>
            </div>

            {/* Режим TABLE */}
            {viewMode === "table" && (
                <div className="materials-table-cont" style={{ display: "flex" }}>
                    <table className="materials-table">
                        <thead>
                        <tr>
                            <th>Material Id</th>
                            <th>Material Name</th>
                            <th>Material is video</th>
                            <th>Material Link</th>
                            <th>Delete Btn</th>
                        </tr>
                        </thead>
                        <tbody>
                        {materialData.map((item) => (
                            <tr key={item._id}>
                                <td>{item._id}</td>
                                <td>{item.name}</td>
                                <td>{item.type.toString()}</td>
                                <td>{item.link}</td>
                                <td>
                                    <div className="users-delete" onClick={() => deleteMaterialHandler(item._id)}>
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
                <div className="materials-add-cont" style={{ display: "flex" }}>
                    <form
                        className="materials-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <label>Name</label>
                        <input
                            className="materials-name"
                            type="text"
                            value={materialName}
                            onChange={(e) => setMaterialName(e.target.value)}
                        />
                        <br />

                        <label>Link</label>
                        <input
                            className="materials-name"
                            type="text"
                            value={materialLink}
                            onChange={(e) => setMaterialLink(e.target.value)}
                        />
                        <br />

                        <label>Is Video?</label>
                        <input
                            type="checkbox"
                            checked={materialIsVideo}
                            onChange={() => setMaterialIsVideo(!materialIsVideo)}
                        />
                        <br />

                        <input
                            value="Submit"
                            onClick={addMaterialHandler}
                            className="materials-submit-btn"
                            type="button"
                        />
                    </form>
                </div>
            )}
        </div>
    );
}

export default MaterialsPanel;
