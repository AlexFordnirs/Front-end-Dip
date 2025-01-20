import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TranslateTests() {
    const navigate = useNavigate();

    // Режим отображения вкладки: "table" (список тестов) или "add" (форма добавления)
    const [viewMode, setViewMode] = useState("table");

    // Массив тестов, полученных с сервера, для таблицы
    const [translateData, setTranslateData] = useState([]);

    // Поля формы (общие)
    const [testLvl, setTestLvl] = useState("");
    const [translateName, setTranslateName] = useState("");
    const [translateText, setTranslateText] = useState("");

    // Сколько вопросов пользователь хочет
    const [questionCount, setQuestionCount] = useState(3);

    // Массив вопросов:
    // Каждый вопрос: { question: "", query_answer: "", answers: ["", "", "", "", ""] }
    const [questions, setQuestions] = useState([]);

    // --------------------------
    // При изменении questionCount
    // --------------------------
    useEffect(() => {
        // Генерируем (или сокращаем) массив questions до нужной длины
        setQuestions((prev) => {
            // prev — это старый массив (до изменения).
            // Мы хотим получить новый массив длиной questionCount
            const newArr = [...prev];

            if (questionCount > newArr.length) {
                // Добавляем недостающие вопросы
                for (let i = newArr.length; i < questionCount; i++) {
                    newArr.push({
                        question: "",
                        query_answer: "",
                        answers: ["", "", "", "", ""],
                    });
                }
            } else if (questionCount < newArr.length) {
                // Обрезаем «лишние» вопросы
                newArr.splice(questionCount);
            }

            return newArr;
        });
    }, [questionCount]);

    // --------------------------
    // При первом рендере -> показываем таблицу (fetch)
    // --------------------------
    useEffect(() => {
        showTranslateTable();
        // eslint-disable-next-line
    }, []);

    // ===============================
    //    1) Получение списка тестов
    // ===============================
    async function showTranslateTable() {
        setViewMode("table");
        try {
            const response = await fetch(
                "http://51.107.7.88:3001/Translate/?type_name=Translate&level_name=A1",
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
                setTranslateData(data);
            } else if (response.status === 401) {
                // если токен недействителен
                navigate("/admin");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //    2) Перейти в режим "Add"
    // ===============================
    function showTranslateAdd() {
        setViewMode("add");
    }

    // ===============================
    //    3) Добавление нового теста
    // ===============================
    async function addTranslateHandler() {
        try {
            const response = await fetch("http://51.107.7.88:3001/Translate", {
                method: "POST",
                headers: {
                    accept: "text/plain",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: sessionStorage.getItem("adminToken"),
                },
                body: JSON.stringify({
                    type_name: "Translate",
                    level_name: testLvl,
                    name_task: translateName,
                    text: translateText,
                    // Теперь "answer" — это результат map
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
                setTranslateName("");
                setTranslateText("");
                setQuestionCount(0); // например, обнулим количество вопросов
            } else if (response.status === 401) {
                console.log("request has not been completed");
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
            const response = await fetch(`http://51.107.7.88:3001/Translate/${id}`, {
                method: "DELETE",
                headers: {
                    accept: "text/plain",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: sessionStorage.getItem("adminToken"),
                },
            });
            if (response.status === 200) {
                // Обновим таблицу
                showTranslateTable();
            } else if (response.status === 401) {
                navigate("/admin");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // ===============================
    //    5) Handlers для формы
    // ===============================

    // Изменение количества вопросов
    function handleQuestionCountChange(e) {
        const newCount = +e.target.value;
        if (newCount < 0) return; // не даём отрицательных
        setQuestionCount(newCount);
    }

    // Изменение текста самого вопроса
    function handleQuestionChange(index, value) {
        const newQuestions = [...questions];
        newQuestions[index].question = value;
        setQuestions(newQuestions);
    }

    // Изменение поля query_answer (правильный ответ)
    function handleQueryChange(index, value) {
        const newQuestions = [...questions];
        newQuestions[index].query_answer = value;
        setQuestions(newQuestions);
    }

    // Изменение одного из 5 ответов
    function handleAnswerChange(index, answerIndex, value) {
        const newQuestions = [...questions];
        newQuestions[index].answers[answerIndex] = value;
        setQuestions(newQuestions);
    }

    // ===============================
    //    RENDER
    // ===============================
    return (
        <div className="translate-cont" style={{ display: "flex", flexDirection: "column" }}>
            {/* Кнопки "Table" / "Add" */}
            <div className="translate-top-btn">
                <div onClick={showTranslateTable} className="top-btn">
                    Table
                </div>
                <div onClick={showTranslateAdd} className="top-btn">
                    Add
                </div>
            </div>

            {/* ========= TABLE MODE ========= */}
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
                        {translateData.map((item) => (
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

            {/* ========= ADD MODE ========= */}
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
                            value={translateName}
                            onChange={(e) => setTranslateName(e.target.value)}
                            type="text"
                        />
                        <br />

                        <label>Test Text</label>
                        <textarea
                            className="translate-textarea"
                            value={translateText}
                            onChange={(e) => setTranslateText(e.target.value)}
                        />
                        <br />

                        {/* Вводим количество вопросов */}
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
                            <div key={index} className="translate-question-form" style={{ marginTop: "20px" }}>
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
                            onClick={addTranslateHandler}
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

export default TranslateTests;
