import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FillInBlanks() {
    const navigate = useNavigate();

    // Режим отображения: table | add
    const [viewMode, setViewMode] = useState("table");

    // Список тестов, полученных с сервера
    const [fillData, setFillData] = useState([]);

    // Общие поля формы
    const [testLvl, setTestLvl] = useState("");
    const [fillName, setFillName] = useState("");
    const [fillText, setFillText] = useState("");

    // Количество «пропусков» (вопросов)
    const [questionCount, setQuestionCount] = useState(3);

    // Массив «вопросов» (blanks), каждый:
    //  {
    //    question: "",       (или "blank"?)
    //    query_answer: "",   (правильный ответ)
    //    answers: ["", "", "", "", ""] (варианты)
    //  }
    const [questions, setQuestions] = useState([]);

    // --------------------------
    // При первом рендере -> грузим таблицу
    // --------------------------
    useEffect(() => {
        showFillTable();
        // eslint-disable-next-line
    }, []);

    // --------------------------
    // Слежка за questionCount
    // --------------------------
    useEffect(() => {
        setQuestions((prev) => {
            const newArr = [...prev];
            if (questionCount > newArr.length) {
                for (let i = newArr.length; i < questionCount; i++) {
                    newArr.push({
                        question: "",
                        query_answer: "",
                        answers: ["", "", "", "", ""],
                    });
                }
            } else if (questionCount < newArr.length) {
                newArr.splice(questionCount);
            }
            return newArr;
        });
    }, [questionCount]);

    // ===============================
    //    1) Показ таблицы
    // ===============================
    async function showFillTable() {
        setViewMode("table");
        try {
            const response = await fetch(
                "http://51.107.7.88:3001/test/?type_name=FillInBlanks&level_name=B1",
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
                setFillData(data);
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
    function showFillAdd() {
        setViewMode("add");
    }

    // ===============================
    //    3) Добавление нового теста
    // ===============================
    async function addFillHandler() {
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
                    type_name: "FillInBlanks", // или как у вас на бэкенде
                    level_name: testLvl,
                    name_task: fillName,
                    text: fillText,
                    answer: questions.map((q) => ({
                        question: q.question,         // сам пропуск/вопрос
                        query_answer: q.query_answer, // правильный ответ
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
                setFillName("");
                setFillText("");
                setQuestionCount(0); // обнулим
            } else if (response.status === 401) {
                console.log("Request not completed (401).");
                navigate("/admin");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //    4) Удаление
    // ===============================
    async function deleteFillHandler(id) {
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
                showFillTable();
            } else if (response.status === 401) {
                console.log("request has not been completed");
                navigate("/admin");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //    Handlers для формы
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

    function handleAnswerChange(index, ansIndex, value) {
        const newQuestions = [...questions];
        newQuestions[index].answers[ansIndex] = value;
        setQuestions(newQuestions);
    }

    // ===============================
    //    RENDER
    // ===============================
    return (
        <div className="translate-cont" style={{ display: "flex", flexDirection: "column" }}>
            <div className="translate-top-btn">
                <div onClick={showFillTable} className="top-btn">
                    Table
                </div>
                <div onClick={showFillAdd} className="top-btn">
                    Add
                </div>
            </div>

            {viewMode === "table" && (
                <div className="translate-table-cont" style={{ display: "flex" }}>
                    <table className="translate-table">
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
                        {fillData.map((item) => (
                            <tr key={item._id}>
                                <td>{item._id}</td>
                                <td>{item.name_task}</td>
                                <td>{item.type_name}</td>
                                <td>{item.level_name}</td>
                                <td>
                                    <div className="users-delete" onClick={() => deleteFillHandler(item._id)}>
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
                <div className="translate-add-cont" style={{ display: "flex" }}>
                    <form
                        className="translate-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <label>Test Lvl</label>
                        <input
                            className="translate-name"
                            value={testLvl}
                            onChange={(e) => setTestLvl(e.target.value)}
                            type="text"
                        />
                        <br />

                        <label>Test Name</label>
                        <input
                            className="translate-name"
                            value={fillName}
                            onChange={(e) => setFillName(e.target.value)}
                            type="text"
                        />
                        <br />

                        <label>Test Text</label>
                        <textarea
                            className="translate-textarea"
                            value={fillText}
                            onChange={(e) => setFillText(e.target.value)}
                        />
                        <br />

                        {/* Количество «бланков» (вопросов) */}
                        <label>Number of blanks:</label>
                        <input
                            type="number"
                            min={0}
                            value={questionCount}
                            onChange={handleQuestionCountChange}
                            style={{ width: "80px" }}
                        />
                        <br />

                        {questions.map((q, index) => (
                            <div key={index} className="translate-question-form" style={{ marginTop: "20px" }}>
                                <label>Blank {index + 1}</label>
                                <input
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                    className="writing-question"
                                    type="text"
                                />

                                <label>Correct Answer</label>
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
                            onClick={addFillHandler}
                            className="translate-submit-btn"
                            type="button"
                            style={{ marginTop: "30px" }}
                        />
                    </form>
                </div>
            )}
        </div>
    );
}

export default FillInBlanks;
