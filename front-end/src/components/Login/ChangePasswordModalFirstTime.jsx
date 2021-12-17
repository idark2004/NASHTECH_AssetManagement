import axios from 'axios';
import { React, useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import InputPassword from '../InputPassword';
import './styles.scss';

const ChangePasswordModalFirstTime = () => {
    const history = useHistory();
    const location = useLocation();

    const [isValid, setIsValid] = useState(true);
    const [inValidMessage, setInValidMessage] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isDisable, setIsDisable] = useState(true);

    useEffect(() => {
        if (newPassword == "") {
            setIsDisable(true);
        } else {
            setIsDisable(false);
        }
    })

    const handleChange = (event) => {
        setNewPassword(event.target.value);
    }

    const handleChangePassword = () => {
        if (newPassword.length < 6) {
            setIsValid(false);
            setInValidMessage("Password need to be longer or equal than 6 characters");
        } else {
            let url = "https://assetmanagementrookies03.azurewebsites.net/api/v1/user/password";
            const body = {
                userId: location.state.userId,
                oldPass: "",
                newPass: newPassword
            }
            let config = {
                headers: { "Authorization": localStorage.getItem("jwt") }
            }
            axios.put(url, body, config)
                .then((res) => {
                    const result = res.data.msg;
                    if (result == "success") {
                        history.push("/");
                    }
                })
                .catch((err) => {
                    setIsValid(false);
                    setInValidMessage(err.response.data.msg);
                })
                .then(() => { })
        }
    }

    return (
        <div>
            <div className="modal-wrapper">
                <div className="modal-wrapper-header">
                    <h4>Change Password</h4>
                </div>
                <div className="modal-wrapper-message">
                    <label>This is the first time you login. You have to change the password to continue</label>
                </div>
                <div className="modal-wrapper-form">
                    <div className="modal-wrapper-form-group">
                        <div className="modal-wrapper-form-group-label">
                            <label htmlFor="newPassword">New Password</label>
                        </div>
                        <InputPassword widthInput="15vw" valueInput={newPassword} nameInput={"newPassword"}
                            onChangeInput={handleChange} isValid={isValid} />
                    </div>
                </div>
                {!isValid && <p className="invalid-message" align="center">{inValidMessage}</p>}
                <div className="modal-wrapper-form-submit">
                    <input type="button"
                        value="Save"
                        onClick={handleChangePassword}
                        disabled={isDisable}
                        style={{ backgroundColor: isDisable ? "#D3D3D3" : "red" }} />
                </div>
            </div>
        </div>
    )
}

export default ChangePasswordModalFirstTime
