import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import "../LearnEnglishWithAI/LearnEnglishWithAI.css";

const LearnEnglishWithAI = () => {
    const [selectedOption, setSelectedOption] = useState(null);

    const [trainingFields, setTrainingFields] = useState({
        topic: "",
        character: "",
        difficulty: "A1",
    });


    const [testFields, setTestFields] = useState({
        topic: "",
        genre: "",
        difficulty: "A1",
        testType: "",
    });


    const [conversationHistory, setConversationHistory] = useState([]);

    const [userMessage, setUserMessage] = useState("");

    const [grammarFeedback, setGrammarFeedback] = useState([]);
    const [taskResponse, setTaskResponse] = useState(null);

    const [userAnswers, setUserAnswers] = useState({});

    const [testResult, setTestResult] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Сбрасываем всё, если меняем вкладку
        setConversationHistory([]);
        setGrammarFeedback([]);
        setTaskResponse(null);
        setUserAnswers({});
        setTestResult(null);
        setUserMessage("");
    }, [selectedOption]);

    // ==================== HANDLERS FOR INPUT FIELDS =====================

    const handleTrainingInputChange = (e) => {
        const { name, value } = e.target;
        setTrainingFields((prev) => ({ ...prev, [name]: value }));
    };

    const handleTestInputChange = (e) => {
        const { name, value } = e.target;
        setTestFields((prev) => ({ ...prev, [name]: value }));
    };

    const handleAnswerChange = (questionId, value) => {
        setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    // ========================= TRAINING LOGIC ===========================

    // Запуск диалога
    const startTraining = async () => {
        const { topic, character, difficulty } = trainingFields;
        if (!topic || !character) {
            alert("Please fill in all training fields!");
            return;
        }
        setLoading(true);
        try {
            // Первый запрос для инициализации диалога.
            const response = await axios.post(
                "http://51.107.7.88:3001/api/ai/continue-dialogue",
                {
                    startInfo: {
                        topic,
                        character,
                        difficulty,
                    },
                    userMessage: "",
                    context: "",
                }
            );


            const { response: aiText, feedback } = response.data;


            setConversationHistory([
                { sender: "AI", message: aiText || "No response from AI yet..." },
            ]);


            setGrammarFeedback(feedback ? [feedback] : []);

        } catch (error) {
            console.error("Error starting conversation:", error);
            alert("Error starting conversation. Check console.");
        } finally {
            setLoading(false);
        }
    };

    // Отправка нового сообщения в диалоге
    const sendMessage = async () => {
        if (!userMessage.trim()) return;

        // Добавляем сообщение пользователя в историю
        setConversationHistory((prev) => [
            ...prev,
            { sender: "User", message: userMessage },
        ]);

        const currentContext = conversationHistory
            .map((entry) => `${entry.sender}: ${entry.message}`)
            .join("\n");

        setLoading(true);
        try {
            const response = await axios.post(
                "http://51.107.7.88:3001/api/ai/continue-dialogue",
                {
                    userMessage,
                    context: currentContext,
                }
            );

            const { response: aiText, feedback } = response.data;

            // Добавляем ответ AI в историю
            setConversationHistory((prev) => [
                ...prev,
                { sender: "AI", message: aiText },
            ]);

            // Добавляем полученный feedback
            if (feedback) {

                setGrammarFeedback((prev) => [...prev, feedback]);
            }

        } catch (error) {
            console.error("Error sending message:", error);
            alert("Error sending message. Check console.");
        } finally {
            setLoading(false);

            setUserMessage("");
        }
    };

    // =========================== TEST LOGIC =============================

    const startTest = async () => {
        const { topic, genre, difficulty, testType } = testFields;
        if (!topic || !genre || !testType) {
            alert("Please fill in all test fields!");
            return;
        }
        setLoading(true);
        try {

            const apiEndpoint =
                testType === "Translate"
                    ? "http://51.107.7.88:3001/api/ai/generate-translate-task"
                    : "http://51.107.7.88:3001/api/ai/generate-reading-task";


            const response = await axios.post(apiEndpoint, {
                level_name: difficulty,
                name_task: `Test: ${testType}`,
                instructions: "Please complete the following questions.",
                topic: topic,
                difficulty: difficulty,
                genre: genre,
            });

            setTaskResponse(response.data);
            setTestResult(null);
            setUserAnswers({});
        } catch (error) {
            console.error("Error starting test:", error);
            alert("Error starting test. Check console.");
        } finally {
            setLoading(false);
        }
    };

    const submitTest = async () => {

        if (!taskResponse || !taskResponse.questions) {
            alert("No task to submit!");
            return;
        }
        const questionIds = taskResponse.questions.map((q) => q._id);
        for (let qId of questionIds) {
            if (!userAnswers[qId]) {
                alert("Please answer all the questions before submitting!");
                return;
            }
        }

        setLoading(true);
        try {

            const response = await axios.post("http://51.107.7.88:3001/api/ai/submit-test", {
                testId: taskResponse._id,
                userAnswers,
            });

            const resultData = response.data;
            setTestResult(resultData);

        } catch (error) {
            console.error("Error submitting test:", error);
            alert("Error submitting test. Check console.");
        } finally {
            setLoading(false);
        }
    };

    const renderTestResult = () => {
        if (!testResult) return null;
        return (
            <div className="test-result-container">
                <h3>Test Results</h3>
                {/* Пример: выводим результат и детали */}
                <p>
                    Your score: {testResult.score} / {testResult.total}
                </p>
                {testResult.details && (
                    <ul>
                        {testResult.details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    // ========================== RENDER UI ===============================

    return (
        <div className="cyberpunk-background">
            <NavBar />
            <div className="cyberpunk-container">
                <h1 className="cyberpunk-title">Learn English with AI</h1>

                <div className="cyberpunk-task-selector">
                    <h2>Select Option:</h2>
                    <div className="task-buttons">
                        <button
                            onClick={() => setSelectedOption("training")}
                            className={`cyberpunk-button ${
                                selectedOption === "training" ? "selected" : ""
                            }`}
                        >
                            Training in Written Communication
                        </button>
                        <button
                            onClick={() => setSelectedOption("tests")}
                            className={`cyberpunk-button ${
                                selectedOption === "tests" ? "selected" : ""
                            }`}
                        >
                            Tests
                        </button>
                    </div>
                </div>

                {/* ========== РЕЖИМ: ТРЕНИРОВКА В ПИСЬМЕННОМ ОБЩЕНИИ =========== */}
                {selectedOption === "training" && (
                    <div className="training-section">
                        <h2>Training Options:</h2>
                        <div className="training-inputs">
                            <input
                                name="topic"
                                value={trainingFields.topic}
                                onChange={handleTrainingInputChange}
                                placeholder="Enter conversation topic"
                            />
                            <input
                                name="character"
                                value={trainingFields.character}
                                onChange={handleTrainingInputChange}
                                placeholder="Enter character type"
                            />
                            <select
                                name="difficulty"
                                value={trainingFields.difficulty}
                                onChange={handleTrainingInputChange}
                            >
                                <option value="A1">A1</option>
                                <option value="A2">A2</option>
                                <option value="B1">B1</option>
                                <option value="B2">B2</option>
                                <option value="C1">C1</option>
                                <option value="C2">C2</option>
                            </select>
                            <button className="start-conversation" onClick={startTraining}>Start Conversation</button>
                        </div>

                        <div className="training-content">
                            {/* Левая часть: окно чата */}
                            <div className="conversation-container">
                                <div className="messages">
                                    {conversationHistory.map((entry, index) => (
                                        <div
                                            key={index}
                                            className={`message ${
                                                entry.sender.toLowerCase() === "user" ? "user" : "ai"
                                            }`}
                                        >
                                            <strong>{entry.sender}: </strong>
                                            <span>{entry.message}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="message-input">
                                    <input
                                        type="text"
                                        value={userMessage}
                                        onChange={(e) => setUserMessage(e.target.value)}
                                        placeholder="Write your message..."
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                sendMessage();
                                            }
                                        }}
                                    />
                                    <button onClick={sendMessage}>Send</button>
                                </div>
                            </div>

                            {/* Правая часть: окно грамматических подсказок/ошибок */}
                            <div className="grammar-feedback-container">
                                <h4>Grammar & Error Feedback</h4>
                                <div className="feedback-messages">
                                    {grammarFeedback.map((feedback, idx) => (
                                        <div key={idx} className="feedback-item">
                                            <p>{feedback}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== РЕЖИМ: ТЕСТЫ =========== */}
                {selectedOption === "tests" && (
                    <div className="test-section">
                        <h2>Test Options:</h2>
                        <div className="test-inputs">
                            <input
                                name="topic"
                                value={testFields.topic}
                                onChange={handleTestInputChange}
                                placeholder="Enter test topic"
                            />
                            <input
                                name="genre"
                                value={testFields.genre}
                                onChange={handleTestInputChange}
                                placeholder="Enter narrative genre"
                            />
                            <select
                                name="difficulty"
                                value={testFields.difficulty}
                                onChange={handleTestInputChange}
                            >
                                <option value="A1">A1</option>
                                <option value="A2">A2</option>
                                <option value="B1">B1</option>
                                <option value="B2">B2</option>
                                <option value="C1">C1</option>
                                <option value="C2">C2</option>
                            </select>
                            <select
                                name="testType"
                                value={testFields.testType}
                                onChange={handleTestInputChange}
                            >
                                <option value="">-- Select Test Type --</option>
                                <option value="Translate">Translate</option>
                                <option value="Reading">Reading</option>
                            </select>
                            <button className="start-test" onClick={startTest}>Start Test</button>
                        </div>

                        {/* Если получили задание — показываем вопросы */}
                        {taskResponse && taskResponse.questions && (
                            <div className="test-response-container">
                                <h3>{taskResponse.name_task || "Your Task"}</h3>
                                <p>{taskResponse.instructions}</p>
                                {/* Если Reading — у нас может быть большой текст */}
                                {taskResponse.type_name === "Reading" && (
                                    <div className="reading-text">
                                        <p>{taskResponse.text}</p>
                                    </div>
                                )}
                                {/* Вопросы */}
                                {taskResponse.questions.map((question) => (
                                    <div key={question._id} className="test-question">
                                        {/* Reading tasks могут иметь question.question */}
                                        {/* Translate tasks могут иметь question.text */}
                                        <p>
                                            {question.question
                                                ? question.question
                                                : question.text /* для Translate */}
                                        </p>

                                        {/* Если есть варианты */}
                                        {question.options ? (
                                            question.options.map((option, index) => (
                                                <label key={index} style={{ display: "block" }}>
                                                    <input
                                                        type="radio"
                                                        name={question._id}
                                                        value={option}
                                                        onChange={(e) =>
                                                            handleAnswerChange(question._id, e.target.value)
                                                        }
                                                        checked={userAnswers[question._id] === option}
                                                    />
                                                    {option}
                                                </label>
                                            ))
                                        ) : (
                                            // Иначе — просто поле ввода
                                            <input
                                                type="text"
                                                placeholder="Your answer"
                                                value={userAnswers[question._id] || ""}
                                                onChange={(e) =>
                                                    handleAnswerChange(question._id, e.target.value)
                                                }
                                            />
                                        )}
                                    </div>
                                ))}
                                <button onClick={submitTest}>Submit Test</button>
                            </div>
                        )}

                        {/* Если есть результат проверки — показываем */}
                        {renderTestResult()}
                    </div>
                )}

                {/* Спиннер загрузки */}
                {loading && <div className="loading-spinner">Loading...</div>}
            </div>
        </div>
    );
};

export default LearnEnglishWithAI;
