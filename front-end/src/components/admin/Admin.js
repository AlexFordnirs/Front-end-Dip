import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import "./Admin.css";


import TranslateTests from "./TranslateTests";
import ReadingTests from "./ReadingTests";
import WritingTests from "./WritingTests";
import MaterialsPanel from "./MaterialsPanel";
import UsersPanel from "./UsersPanel";
import FillInBlanks from "./FillInBlanks";
function Admin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("translate");


    useEffect(() => {
        if (!sessionStorage.getItem("adminToken")) {

            navigate("/admin");
        }
    }, [navigate]);

    return (
        <div>
            <NavBar />

            <div className="main-cont" style={{ display: "flex" }}>
                {}
                <div className="admin-tables-cont">
                    <div
                        onClick={() => setActiveTab("translate")}
                        className={`table-btn ${activeTab === "translate" ? "active-tab" : ""}`}
                    >
                        Translate Tests
                    </div>
                    <div
                        onClick={() => setActiveTab("reading")}
                        className={`table-btn ${activeTab === "reading" ? "active-tab" : ""}`}
                    >
                        Reading Tests
                    </div>
                    <div
                        onClick={() => setActiveTab("writing")}
                        className={`table-btn ${activeTab === "writing" ? "active-tab" : ""}`}
                    >
                        Writing Tests
                    </div>
                    <div
                        onClick={() => setActiveTab("materials")}
                        className={`table-btn ${activeTab === "materials" ? "active-tab" : ""}`}
                    >
                        Materials
                    </div>
                    <div
                        onClick={() => setActiveTab("users")}
                        className={`table-btn ${activeTab === "users" ? "active-tab" : ""}`}
                    >
                        Users
                    </div>

                {}
                <div
                    onClick={() => setActiveTab("fill")}
                    className={`table-btn ${activeTab === "fill" ? "active-tab" : ""}`}
                >
                    Fill in the Blanks
                </div>
            </div>

                {}
                <div style={{ flex: 1, overflowY: "auto" }}>
                    {activeTab === "translate" && <TranslateTests />}
                    {activeTab === "reading" && <ReadingTests />}
                    {activeTab === "writing" && <WritingTests />}
                    {activeTab === "materials" && <MaterialsPanel />}
                    {activeTab === "users" && <UsersPanel />}
                    {activeTab === "fill" && <FillInBlanks />}  {}
                </div>
            </div>
        </div>
    );
}

export default Admin;
