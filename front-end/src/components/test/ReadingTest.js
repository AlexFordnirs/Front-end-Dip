import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

function ReadingTest() {
    const navigate = useNavigate();
    const params = useParams();
    const [test, setTest] = useState(null);
    const [choice, setChoice] = useState([]);
    const [modalOpen, setModalOpen] = useState(false); // состояние для модального окна
    const [modalMessage, setModalMessage] = useState(""); // сообщение модального окна

    useEffect(() => {
        fetch(`http://51.107.7.88:3001/Reading/${params.id}`, {
            headers: {
                "accept": "text/plain",
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error("Ошибка при загрузке данных");
                }
            })
            .then((data) => {
                setTest(data);
                setChoice(new Array(data.questions.length).fill("")); // инициализация выбора
            })
            .catch((error) => {
                console.error("Ошибка:", error);
            });
    }, [params.id]);

    const handleChoiceChange = (index, value) => {
        const updatedChoice = [...choice];
        updatedChoice[index] = value;
        setChoice(updatedChoice);
    };

    const handleSubmit = () => {
        const correctAnswers = test.questions.filter((q, index) => q.query_answer === choice[index]).length;

        fetch(`http://51.107.7.88:3001/user/${sessionStorage.getItem("id")}`, {
            method: "POST",
            headers: {
                "accept": "text/plain",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                token: sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
                name: test.name_task,
                result: `${correctAnswers}/${choice.length}`,
                level: test.level_name,
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    navigate("/user");
                } else if (response.status === 401) {
                    // Если не авторизован, показываем всплывающее окно
                    setModalMessage(`Your result: ${correctAnswers}/${choice.length}. Please log in to save your results.`);
                    setModalOpen(true);
                } else {
                    throw new Error("Ошибка при отправке данных");
                }
            })
            .catch((error) => {
                console.error("Ошибка:", error);
                setModalMessage("Failed to submit results. Please try again.");
                setModalOpen(true);
            });
    };

    return (
        <div>
            <NavBar />
            <div className="test-main-cont">
                {test ? (
                    <div className="test-test-cont">
                        <div className="test-name">{test.name_task}</div>
                        <div className="test-instructions">{test.instructions}</div>
                        <div className="test-text">{test.text}</div>
                        <div className="answers-cont">
                            {test.questions.map((question, index) => (
                                <div key={question._id} className="answer-row">
                                    <FormControl>
                                        <FormLabel>{question.question}</FormLabel>
                                        <RadioGroup
                                            row
                                            name={`question-${index}`}
                                            onChange={(e) => handleChoiceChange(index, e.target.value)}
                                        >
                                            {question.options.map((option, idx) => (
                                                <FormControlLabel
                                                    key={idx}
                                                    value={option}
                                                    control={<Radio />}
                                                    label={option}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            ))}
                        </div>
                        <button className="check-btn" onClick={handleSubmit}>
                            CHECK
                        </button>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>

            {/* Модальное окно */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <h2 id="modal-title">Result</h2>
                    <p id="modal-description">{modalMessage}</p>
                    <button onClick={() => setModalOpen(false)}>Close</button>
                </Box>
            </Modal>
        </div>
    );
}

export default ReadingTest;