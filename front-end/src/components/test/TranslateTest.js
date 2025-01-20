import './TranslateTest.css';
import {useNavigate, useParams} from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import {useEffect, useState} from "react";

function TranslateTest() {
    const navigate = useNavigate();
    const params = useParams();
    const [test, setTest] = useState(null); // Данные теста
    const [answers, setAnswers] = useState({}); // Ответы пользователя
    const [result, setResult] = useState(null); // Результат теста

    useEffect(() => {
        // Запрос на получение данных теста
        fetch(`http://51.107.7.88:3001/Translate/${params.id}`, {
            headers: {
                'accept': "application/json",
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to fetch test data.");
                }
            })
            .then(data => {
                console.log("Test data:", data);
                setTest(data); // Устанавливаем данные теста
                // Инициализация ответов для каждого вопроса
                const initialAnswers = {};
                data.questions.forEach(q => {
                    initialAnswers[q._id] = ""; // Ответ по умолчанию пуст
                });
                setAnswers(initialAnswers);
            })
            .catch(error => {
                console.error("Error fetching test data:", error);
            });
    }, [params.id]);

    const handleInputChange = (id, value) => {
        // Обновляем ответ пользователя
        setAnswers(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = () => {
        if (!test) return;

        let correctAnswers = 0;
        test.questions.forEach(question => {
            // Проверяем ответ пользователя с правильным ответом
            if (answers[question._id]?.trim() === question.query_answer) {
                correctAnswers++;
            }
        });

        const finalResult = `${correctAnswers}/${test.questions.length}`;
        setResult(finalResult);

        if (sessionStorage.getItem('token')) {
            // Если пользователь авторизован, отправляем результат на сервер
            fetch(`http://51.107.7.88:3001/user/${sessionStorage.getItem('id')}`, {
                method: "POST",
                headers: {
                    'accept': "application/json",
                    "Content-Type": "application/json",
                    'token': sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    name: test.name_task,
                    result: finalResult,
                    level: test.level_name,
                }),
            })
                .then(response => {
                    if (response.ok) {
                        console.log("Result submitted successfully.");
                        navigate("/User");
                    } else if (response.status === 401) {
                        console.warn("Unauthorized submission attempt.");
                        setResult("Unauthorized. Please log in to save results.");
                    }
                })
                .catch(error => {
                    console.error("Error submitting result:", error);
                });
        } else {
            // Если пользователь не авторизован
            alert(`Ваш результат: ${finalResult}. Авторизуйтесь, чтобы сохранить результаты.`);
        }
    };

    if (!test) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar />
            <div className="test-main-cont">
                <div className="test-test-cont">
                    <div className="test-name">{test.name_task}</div>
                    <div className="test-instructions">{test.instructions}</div>
                    <div className="questions-cont">
                        {test.questions.map(question => (
                            <div key={question._id} className="question-block">
                                <div className="question-text">{question.text}</div>
                                <input
                                    type="text"
                                    value={answers[question._id]}
                                    onChange={(e) => handleInputChange(question._id, e.target.value)}
                                    className="question-input"
                                    placeholder="Enter your translation"
                                />
                            </div>
                        ))}
                    </div>
                    <button className="check-btn" onClick={handleSubmit}>
                        Submit
                    </button>
                    {result && <div className="result-display">Result: {result}</div>}
                </div>
            </div>
        </div>
    );
}

export default TranslateTest;
