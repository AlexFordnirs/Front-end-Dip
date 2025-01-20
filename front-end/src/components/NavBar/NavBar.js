import '../NavBar/NavBar.css';
import {NavLink} from "react-router-dom";
import User from "../user/User";

function NavBar(){
    return <>
        <NavLink className={"main-head"} to={"/"}><h2>Grammar</h2></NavLink>
        <nav className={"navbar"}>
            <NavLink className={"navbutton"} to={'/translate'}>Переклад</NavLink>
            <NavLink className={"navbutton"} to={'/reading'}>Читання</NavLink>
            <NavLink className={"navbutton"} to={'/writing'}>Заповніть пропуски</NavLink>
            <NavLink className={"navbutton"} to={'/materials'}>Матеріали</NavLink>
            <NavLink className={"navbutton"} to={"/learnEnglishWithAI"}>Learn English with AI</NavLink>
            <NavLink style={{display:sessionStorage.getItem('token')?'none':'flex'}} className={"navbutton"} to={'/login'}>Увійти</NavLink>
            <NavLink style={{display:sessionStorage.getItem('token')?'flex':'none'}} className={"navbutton"} to={'/user'}>Кабінет</NavLink>
        </nav>
    </>

}

export default NavBar;