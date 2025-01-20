import './Test.css';
import {NavLink, useNavigate, useParams} from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import {useEffect, useState} from "react";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";

function Test() {
    const navigate = useNavigate();
    const params = useParams();
    const [test, setTest] = useState({})
    const [choice, setChoice] = useState('')
    useEffect(() => {
        fetch(`http://51.107.7.88:3001/test/${params.id}`, {
            headers: {
                'accept': "text/plain",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }).then((response) => {
            if (response.status === 200) {
                console.log("OK");
                response.json().then((data) => {
                    console.log(data)
                    setTest(data)
                    let localChoice = []
                    data.answer.map((i) => {
                        localChoice.push('')
                    })
                    setChoice(localChoice)
                })
            }
        })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [])

    function choiceHandler(i, value) {
        let localChoice = choice;
        localChoice[i] = value;
        console.log(localChoice)
        setChoice(localChoice)
    }

    function check() {
        let result = 0
        test.answer?.map((item, i) => {
            if (item.query_answer === choice[i]) {
                result += 1
            }
        })
        fetch(`http://51.107.7.88:3001/user/${sessionStorage.getItem('id')}`, {
            method: "Post",
            headers: {
                'accept': "text/plain",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                'token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                name: test.name_task,
                result: `${result}/${choice.length}`,
                level: test.level_name
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("OK");
                    if(sessionStorage.getItem('token')===null){
                        navigate("/login");
                    }else{
                        navigate("/User");
                    }
                } else if (response.status === 401) {
                    console.log("request has not been completed");
                    if(sessionStorage.getItem('token')===null){
                        navigate("/login");
                    }else{
                        navigate("/User");
                    }
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    return (
        <div>

            <NavBar/>

            <div className={"test-main-cont"}>

                <div className={"test-test-cont"}>
                    <div className={"test-name"}>{test.name_task}</div>
                    <div className={"test-text"}>{test.text}
                    </div>
                    <div className="answers-cont">
                        {test.answer?.map((item, i) => {
                            return <>
                                <div className="answer-row" key={i}>
                                    {/*<div className={"answer-num"}>{item.question}</div>*/}
                                    <FormControl>
                                        <FormLabel id="demo-radio-buttons-group-label">{item.question}</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue="female"
                                            name="radio-buttons-group"
                                            onChange={(e) => choiceHandler(i, e.target.value)}
                                        >
                                            {item.answer_1?.length > 0 &&
                                                <FormControlLabel value={item.answer_1} control={<Radio/>}
                                                                  label={item.answer_1}/>
                                            }
                                            {item.answer_2?.length > 0 &&
                                                <FormControlLabel value={item.answer_2} control={<Radio/>}
                                                                  label={item.answer_2}/>
                                            }
                                            {item.answer_3?.length > 0 &&
                                                <FormControlLabel value={item.answer_3} control={<Radio/>}
                                                                  label={item.answer_3}/>
                                            }
                                            {item.answer_4?.length > 0 &&
                                                <FormControlLabel value={item.answer_4} control={<Radio/>}
                                                                  label={item.answer_4}/>
                                            }
                                            {item.answer_5?.length > 0 &&
                                                <FormControlLabel value={item.answer_5} control={<Radio/>}
                                                                  label={item.answer_5}/>
                                            }
                                        </RadioGroup>
                                    </FormControl>
                                    {/*<form>*/}
                                    {/*    {item.answer_1?.length > 0 &&*/}
                                    {/*        <label><input className={"row"} type="radio"*/}
                                    {/*                      checked={choice[i] === item.answer_1}*/}
                                    {/*                      onClick={() => choiceHandler(i, item.answer_1)}*/}
                                    {/*                 />{item.answer_1}</label>*/}
                                    {/*    }*/}
                                    {/*    {item.answer_2?.length > 0 &&*/}
                                    {/*        <label><input className={"row"} type="radio"*/}
                                    {/*                      checked={choice[i] === item.answer_2}*/}
                                    {/*                      onClick={() => choiceHandler(i, item.answer_2)}*/}
                                    {/*        />{item.answer_2}</label>*/}
                                    {/*    }*/}
                                    {/*    {item.answer_3?.length > 0 &&*/}
                                    {/*        <label><input className={"row"} type="radio"*/}
                                    {/*                      checked={choice[i] == item.answer_3}*/}
                                    {/*                      onClick={() => choiceHandler(i, item.answer_3)}*/}
                                    {/*        />{item.answer_3}</label>*/}
                                    {/*    }*/}
                                    {/*    {item.answer_4?.length > 0 &&*/}
                                    {/*        <label><input className={"row"} type="radio"*/}
                                    {/*                      checked={choice[i] === item.answer_4}*/}
                                    {/*                      onClick={() => choiceHandler(i, item.answer_4)}*/}
                                    {/*        />{item.answer_4}</label>*/}
                                    {/*    }*/}
                                    {/*    {item.answer_5?.length > 0 &&*/}
                                    {/*        <label><input className={"row"} type="radio"*/}
                                    {/*                      checked={choice[i] === item.answer_5}*/}
                                    {/*                      onClick={() => choiceHandler(i, item.answer_5)}*/}
                                    {/*        />{item.answer_5}</label>*/}
                                    {/*    }*/}
                                    {/*</form>*/}
                                </div>
                                <br/>
                            </>
                        })}
                        <button className={"check-btn"} onClick={() => check()}>CHECK</button>
                        {/*<div className="answer-row">*/}
                        {/*    <div className={"answer-num"}>2</div>*/}
                        {/*    <label>*/}
                        {/*        <input className={"row"} type="checkbox" value="Answer"/>Answer*/}
                        {/*        <input className={"row"} type="checkbox" value="Answer"/>Answer*/}
                        {/*        <input className={"row"} type="checkbox" value="Answer"/>Answer*/}
                        {/*        <input className={"row"} type="checkbox" value="Answer"/>Answer*/}
                        {/*        <input className={"row"} type="checkbox" value="Answer"/>Answer*/}
                        {/*        <input className={"row"} type="checkbox" value="Answer"/>Answer*/}
                        {/*        <input className={"row"} type="checkbox" value="Answer"/>Answer*/}
                        {/*        <input className={"row"} type="checkbox" value="Answer"/>Answer*/}
                        {/*    </label>*/}
                        {/*</div>*/}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Test;