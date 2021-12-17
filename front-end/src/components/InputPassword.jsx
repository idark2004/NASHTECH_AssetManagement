import { ReactChild, useState } from 'react'
// import { useForm } from "react-hook-form";
// import "./styles.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const eye = <FontAwesomeIcon icon={faEye} className='icon' />;
const eyeslash = <FontAwesomeIcon icon={faEyeSlash} className='icon' />;

const InputPassword = (props) => {
    const [passwordShown, setPasswordShown] = useState(false);
    const [password, setPassword] = useState("");

    const inputStyle = {
        width: props.widthInput,
        borderColor: props.isValid ? "black" : "red"
    }

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    return (
        <div className="pass-wrapper">

            <input
                minLength={6}
                maxLength={80}
                name={props.nameInput}
                type={passwordShown ? "text" : "password"}
                value={props.valueInput}
                onChange={props.onChangeInput}
                style={inputStyle}
            />
            <i onClick={togglePasswordVisiblity}>{passwordShown ? eye : eyeslash}</i>
        </div>
    )
}

export default InputPassword
