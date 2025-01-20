import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function WritingTests() {
    const navigate = useNavigate();

    // Режим отображения: "table" (таблица) или "add" (форма добавления)
    const [viewMode, setViewMode] = useState("table");

    // Массив тестов, загруженных с сервера
    const [writingData, setWritingData] = useState([]);

    // Общие поля формы
    const [testLvl, setTestLvl] = useState("");
    const [writingName, setWritingName] = useState("");
    const [writingText, setWritingText] = useState("");

    // Количество вопросов, заданных пользователем
    const [questionCount, setQuestionCount] = useState(3);

    // Массив вопросов (каждый вопрос: { question, query_answer, answers: [...] })
    const [questions, setQuestions] = useState([]);

    // --------------------------
    // 1) useEffect для загрузки таблицы при первом рендере
    // --------------------------
    useEffect(() => {
        showWritingTable();
        // eslint-disable-next-line
    }, []);

    // --------------------------
    // 2) useEffect для синхронизации questionCount <-> questions
    // --------------------------
    useEffect(() => {
        setQuestions((prev) => {
            const newArr = [...prev];
            if (questionCount > newArr.length) {
                // Добавляем недостающие объекты
                for (let i = newArr.length; i < questionCount; i++) {
                    newArr.push({
                        question: "",
                        query_answer: "",
                        answers: ["", "", "", "", ""],
                    });
                }
            } else if (questionCount < newArr.length) {
                // Укорачиваем массив
                newArr.splice(questionCount);
            }
            return newArr;
        });
    }, [questionCount]);

    // ===============================
    //    3) Загрузить таблицу
    // ===============================
    async function showWritingTable() {
        setViewMode("table");
        try {
            const response = await fetch(
                "http://51.107.7.88:3001/test/?type_name=Write&level_name=A2",
                {
                    headers: {
                        accept: "text/plain",
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (response.status === 200) {
                const data = await response.json();
                setWritingData(data);
            } else if (response.status === 401) {
                navigate("/admin");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //    4) Перейти в режим "add"
    // ===============================
    function showWritingAdd() {
        setViewMode("add");
    }

    // ===============================
    //    5) Добавление нового теста
    // ===============================
    async function addWritingHandler() {
        try {
            const response = await fetch("http://51.107.7.88:3001/test", {
                method: "POST",
                headers: {
                    accept: "text/plain",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: sessionStorage.getItem("adminToken"),
                },
                body: JSON.stringify({
                    type_name: "Write",
                    level_name: testLvl,
                    name_task: writingName,
                    text: writingText,
                    answer: questions.map((q) => ({
                        question: q.question,
                        query_answer: q.query_answer,
                        answer_1: q.answers[0],
                        answer_2: q.answers[1],
                        answer_3: q.answers[2],
                        answer_4: q.answers[3],
                        answer_5: q.answers[4],
                    })),
                }),
            });
            if (response.status === 201) {
                console.log("OK");
                // Сбрасываем поля
                setTestLvl("");
                setWritingName("");
                setWritingText("");
                setQuestionCount(0); // или 3 — как удобнее
            } else if (response.status === 401) {
                console.log("request has not been completed");
                navigate("/admin");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //    6) Удаление теста
    // ===============================
    async function deleteTestHandler(id) {
        try {
            const response = await fetch(`http://51.107.7.88:3001/test/${id}`, {
                method: "DELETE",
                headers: {
                    accept: "text/plain",
                    "Content-Type": "application/json",
                    token: sessionStorage.getItem("adminToken"),
                },
            });
            if (response.status === 200) {
                showWritingTable();
            } else if (response.status === 401) {
                navigate("/admin");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //    7) Handlers для формы
    // ===============================
    function handleQuestionCountChange(e) {
        const newCount = +e.target.value;
        if (newCount < 0) return;
        setQuestionCount(newCount);
    }

    function handleQuestionChange(index, value) {
        const newQuestions = [...questions];
        newQuestions[index].question = value;
        setQuestions(newQuestions);
    }

    function handleQueryChange(index, value) {
        const newQuestions = [...questions];
        newQuestions[index].query_answer = value;
        setQuestions(newQuestions);
    }

    function handleAnswerChange(index, answerIndex, value) {
        const newQuestions = [...questions];
        newQuestions[index].answers[answerIndex] = value;
        setQuestions(newQuestions);
    }

    // ===============================
    //    RENDER
    // ===============================
    return (
        <div className="writing-cont" style={{ display: "flex", flexDirection: "column" }}>
            <div className="writing-top-btn">
                <div onClick={showWritingTable} className="top-btn">
                    Table
                </div>
                <div onClick={showWritingAdd} className="top-btn">
                    Add
                </div>
            </div>

            {viewMode === "table" && (
                <div className="writing-table-cont" style={{ display: "flex" }}>
                    <table className="writing-table">
                        <thead>
                        <tr>
                            <th>Test Id</th>
                            <th>Test Name</th>
                            <th>Test Type</th>
                            <th>Test Lvl</th>
                            <th>Delete Btn</th>
                        </tr>
                        </thead>
                        <tbody>
                        {writingData.map((item) => (
                            <tr key={item._id}>
                                <td>{item._id}</td>
                                <td>{item.name_task}</td>
                                <td>{item.type_name}</td>
                                <td>{item.level_name}</td>
                                <td>
                                    <div className="users-delete" onClick={() => deleteTestHandler(item._id)}>
                                        Delete
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {viewMode === "add" && (
                <div className="writing-add-cont" style={{ display: "flex" }}>
                    <form
                        className="writing-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <label>Test Lvl</label>
                        <input
                            className="writing-name"
                            value={testLvl}
                            onChange={(e) => setTestLvl(e.target.value)}
                            type="text"
                        />
                        <br />

                        <label>Test Name</label>
                        <input
                            className="writing-name"
                            value={writingName}
                            onChange={(e) => setWritingName(e.target.value)}
                            type="text"
                        />
                        <br />

                        <label>Test Text</label>
                        <textarea
                            value={writingText}
                            onChange={(e) => setWritingText(e.target.value)}
                            className="writing-textarea"
                        />
                        <br />

                        {/* Количество вопросов */}
                        <label>Number of questions:</label>
                        <input
                            type="number"
                            min={0}
                            value={questionCount}
                            onChange={handleQuestionCountChange}
                            style={{ width: "80px" }}
                        />
                        <br />

                        {questions.map((q, index) => (
                            <div key={index} className="writing-question-form" style={{ marginTop: "20px" }}>
                                <label>Question {index + 1}</label>
                                <input
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                    className="writing-question"
                                    type="text"
                                />
                                <label>Query Answer</label>
                                <input
                                    value={q.query_answer}
                                    onChange={(e) => handleQueryChange(index, e.target.value)}
                                    className="writing-query"
                                    type="text"
                                />

                                <label>Answers</label>
                                {q.answers.map((ans, ansIndex) => (
                                    <input
                                        key={ansIndex}
                                        value={ans}
                                        onChange={(e) => handleAnswerChange(index, ansIndex, e.target.value)}
                                        className="writing-answer"
                                        type="text"
                                    />
                                ))}
                            </div>
                        ))}

                        <input
                            value="Submit"
                            onClick={addWritingHandler}
                            className="writing-submit-btn"
                            type="button"
                            style={{ marginTop: "30px" }}
                        />
                    </form>
                </div>
            )}
        </div>
    );
}

export default WritingTests;
