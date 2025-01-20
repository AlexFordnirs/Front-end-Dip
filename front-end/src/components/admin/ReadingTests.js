import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ReadingTests() {
    const navigate = useNavigate();

    // Режим отображения: "table" или "add"
    const [viewMode, setViewMode] = useState("table");

    // Массив полученных тестов с бэкенда
    const [readingData, setReadingData] = useState([]);

    // Общие поля формы
    const [testLvl, setTestLvl] = useState("");
    const [readingName, setReadingName] = useState("");
    const [readingText, setReadingText] = useState("");

    // Сколько вопросов пользователь хочет
    const [questionCount, setQuestionCount] = useState(3);

    // Массив вопросов:
    // Каждый элемент: { question: "", query_answer: "", answers: ["", "", "", "", ""] }
    const [questions, setQuestions] = useState([]);

    // --------------------------
    // useEffect #1
    // При первом рендере — подгружаем список тестов для таблицы
    // --------------------------
    useEffect(() => {
        showReadingTable();
        // eslint-disable-next-line
    }, []);

    // --------------------------
    // useEffect #2
    // Слежение за questionCount, чтобы увеличивать/уменьшать массив questions
    // --------------------------
    useEffect(() => {
        setQuestions((prev) => {
            const newArr = [...prev];

            if (questionCount > newArr.length) {
                // Если новое количество больше — добавляем
                for (let i = newArr.length; i < questionCount; i++) {
                    newArr.push({
                        question: "",
                        query_answer: "",
                        answers: ["", "", "", "", ""],
                    });
                }
            } else if (questionCount < newArr.length) {
                // Если меньше — обрезаем
                newArr.splice(questionCount);
            }

            return newArr;
        });
    }, [questionCount]);

    // ===============================
    //    1) Показ таблицы (fetch)
    // ===============================
    async function showReadingTable() {
        setViewMode("table");
        try {
            const response = await fetch(
                "http://51.107.7.88:3001/Reading/?type_name=Reading&level_name=A1",
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
                setReadingData(data);
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
    function showReadingAdd() {
        setViewMode("add");
    }

    // ===============================
    //    3) Добавление нового теста
    // ===============================
    async function addReadingHandler() {
        try {
            const response = await fetch("http://51.107.7.88:3001/Reading", {
                method: "POST",
                headers: {
                    accept: "text/plain",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: sessionStorage.getItem("adminToken"),
                },
                body: JSON.stringify({
                    type_name: "Read",
                    level_name: testLvl,
                    name_task: readingName,
                    text: readingText,
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
                setReadingName("");
                setReadingText("");
                setQuestionCount(0); // допустим, обнулим, чтобы пользователь сам вводил заново
            } else if (response.status === 401) {
                navigate("/admin");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //    4) Удаление теста
    // ===============================
    async function deleteTestHandler(id) {
        try {
            const response = await fetch(`http://51.107.7.88:3001/Reading/${id}`, {
                method: "DELETE",
                headers: {
                    accept: "text/plain",
                    "Content-Type": "application/json",
                    token: sessionStorage.getItem("adminToken"),
                },
            });
            if (response.status === 200) {
                showReadingTable();
            } else if (response.status === 401) {
                navigate("/admin");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //   Handlers для формы вопросов
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
    //   RENDER
    // ===============================
    return (
        <div className="reading-cont" style={{ display: "flex", flexDirection: "column" }}>
            <div className="reading-top-btn">
                <div onClick={showReadingTable} className="top-btn">
                    Table
                </div>
                <div onClick={showReadingAdd} className="top-btn">
                    Add
                </div>
            </div>

            {/* Режим таблицы */}
            {viewMode === "table" && (
                <div className="reading-table-cont" style={{ display: "flex" }}>
                    <table className="reading-table">
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
                        {readingData.map((item) => (
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

            {/* Режим добавления */}
            {viewMode === "add" && (
                <div className="reading-add-cont" style={{ display: "flex" }}>
                    <form
                        className="reading-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <label>Test Lvl</label>
                        <input
                            className="reading-name"
                            value={testLvl}
                            onChange={(e) => setTestLvl(e.target.value)}
                            type="text"
                        />
                        <br />

                        <label>Test Name</label>
                        <input
                            className="reading-name"
                            value={readingName}
                            onChange={(e) => setReadingName(e.target.value)}
                            type="text"
                        />
                        <br />

                        <label>Test Text</label>
                        <textarea
                            className="reading-textarea"
                            value={readingText}
                            onChange={(e) => setReadingText(e.target.value)}
                        />
                        <br />

                        {/* Ввод количества вопросов */}
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
                            <div key={index} className="reading-question-form" style={{ marginTop: "20px" }}>
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
                                        className="reading-answer"
                                        type="text"
                                    />
                                ))}
                            </div>
                        ))}

                        <input
                            value="Submit"
                            onClick={addReadingHandler}
                            className="reading-submit-btn"
                            type="button"
                            style={{ marginTop: "30px" }}
                        />
                    </form>
                </div>
            )}
        </div>
    );
}

export default ReadingTests;
