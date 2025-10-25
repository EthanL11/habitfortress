import { useNavigate } from "react-router-dom";

function LoginButton(){

    const nav = useNavigate();

    const handleClick = () => {
        nav('/dashboard');
    };

    return(
        <button onClick ={handleClick}> Log in</button>
    );
}
export default LoginButton;