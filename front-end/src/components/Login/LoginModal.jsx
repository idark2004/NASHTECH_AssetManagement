import axios from 'axios';
import { React, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import InputPassword from '../InputPassword';
import './styles.scss';

const LoginModal = () => {
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [isDisable, setIsDisable] = useState(true);
    const [errMessage, setErrMessage] = useState("");

    useEffect(() => {
        if (username == "" || password == "") {
            setIsDisable(true);
        } else {
            setIsDisable(false);
        }
    })

    const handleChange = (event) => {
        if (event.target.name === "username") {
            setUsername(event.target.value);
        }
        if (event.target.name === "password") {
            setPassword(event.target.value);
        }
    }

    const handleLogin = () => {
        let url = "https://assetmanagementrookies03.azurewebsites.net/api/login";
        const params = {
            "username": username,
            "password": password
        }
        axios.post(url, null, { params })
            .then((response) => {
                let jwtToken = response.headers["authorization"];
                let fullName = response.data.fullName;
                let userName = response.data.username;
                let userId = response.data.id;
                let roleName = response.data.roleName;
                let isFirstTime = response.data.first;
                let locationName = response.data.locationName; //Change later
                let locationId = response.data.locationId;
                localStorage.setItem("fullName", fullName);
                localStorage.setItem("userName", userName);
                localStorage.setItem("role", roleName);
                localStorage.setItem("isFirstTime", isFirstTime);
                localStorage.setItem("locationName", locationName);
                localStorage.setItem("locationId", locationId);
                localStorage.setItem("jwt", jwtToken);
                console.log(userId);
                localStorage.setItem("userId", userId);
                document.cookie = 'id=' + userId;
                if (isFirstTime === true) {
                    history.push({
                        pathname: "/login",
                        state: {
                            isFirstTime: isFirstTime,
                            userId: userId
                        }
                    })
                    return;
                } else {
                    history.push({
                        pathname: "/",
                        state: { role: "ADMIN" }
                    })
                    window.location.reload();
                }
            })
            .catch((err) => {
                setIsValid(false);
                setErrMessage(err.response.data.msg);
            })
            .then(() => { })
    }

    return (
        <div className="modal-wrapper">
            <div className="modal-wrapper-header">
                <h4>Welcome to Online Asset Management</h4>
            </div>
            <div className="modal-wrapper-form">
                <form style={{ width: "100%" }}>
                    <div className="modal-wrapper-form-group">
                        <div className="modal-wrapper-form-group-label">
                            <label htmlFor="name">&nbsp;Username</label>
                            <label className="required-icon">&nbsp;*</label>
                        </div>
                        <input type="text" name="username" maxLength="80"
                            value={username} onChange={handleChange}
                            style={{ borderColor: isValid ? "black" : "red" }} />
                    </div>
                    <div className="modal-wrapper-form-group">
                        <div className="modal-wrapper-form-group-label">
                            <label htmlFor="password">Password</label>
                            <label className="required-icon">&nbsp;*&nbsp;</label>
                        </div>
                        <InputPassword widthInput="15vw" valueInput={password} nameInput={"password"}
                            onChangeInput={handleChange} isValid={isValid} />
                    </div>
                    {
                        !isValid &&
                        <p className="invalid-message" align="center">{errMessage}</p>
                    }
                    <div className="modal-wrapper-form-submit">
                        <input type="button" value="Login"
                            onClick={handleLogin}
                            disabled={isDisable}
                            style={{ backgroundColor: isDisable ? "#D3D3D3" : "red" }} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginModal
