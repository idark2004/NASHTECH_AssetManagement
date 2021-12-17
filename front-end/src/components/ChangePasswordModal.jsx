import axios from 'axios';
import { React, useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import InputPassword from './InputPassword';
import './Login/styles.scss';
import MessageModal from './MessageModal';

const ChangePasswordModal = (props) => {
    const history = useHistory();
    const location = useLocation();

    const [isValid, setIsValid] = useState(true);
    const [inValidMessage, setInValidMessage] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [isDisable, setIsDisable] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isNewPassValid, setIsNewPassValid] = useState(true);
    const [isSamePass, setIsSamePass] = useState(false);

    const toggle = () => {
        setIsSuccess(!isSuccess);
    }

    useEffect(() => {
        if (newPassword == "" || oldPassword == "") {
            setIsDisable(true);
        } else {
            setIsDisable(false);
        }
    })

    const handleChange = (event) => {
        if (event.target.name === "newPassword") {
            setNewPassword(event.target.value);
        }
        if (event.target.name === "oldPassword") {
            setOldPassword(event.target.value);
        }
    }

    const handleChangePassword = () => {
        // Reset state 
        setIsNewPassValid(true);
        setIsValid(true);
        setIsSamePass(false);

        if (newPassword.length < 6) {
            setIsNewPassValid(false);
        }
        else if (newPassword === oldPassword) {
            setIsSamePass(true);
        }
        else {
            let url = "https://assetmanagementrookies03.azurewebsites.net/api/v1/user/password";
            const body = {
                userId: localStorage.getItem("userId"),
                oldPass: oldPassword,
                newPass: newPassword
            }
            let config = {
                headers: { "Authorization": localStorage.getItem("jwt") }
            }
            axios.put(url, body, config)
                .then((res) => {
                    const result = res.data.msg;
                    if (result == "success") {
                        toggle();
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
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}>
            <div className="modal-wrapper">
                <div className="modal-wrapper-header">
                    <h4>Change Password</h4>
                </div>
                {
                    !isSuccess ?
                        (
                            <div>
                                <div className="modal-wrapper-form">
                                    <div className="modal-wrapper-form-group">
                                        <div className="modal-wrapper-form-group-label">
                                            <label htmlFor="oldPassword" style={{ color: "black" }}>Old Password</label>
                                        </div>
                                        <InputPassword widthInput="15vw" valueInput={oldPassword} nameInput={"oldPassword"}
                                            onChangeInput={handleChange} isValid={isValid && !isSamePass} />
                                    </div>
                                    {!isValid && <p className="invalid-message" align="center">Password is incorrect</p>}
                                    <div className="modal-wrapper-form-group">
                                        <div className="modal-wrapper-form-group-label">
                                            <label htmlFor="newPassword" style={{ color: "black" }}>New Password</label>
                                        </div>
                                        <InputPassword widthInput="15vw" valueInput={newPassword} nameInput={"newPassword"}
                                            onChangeInput={handleChange} isValid={isNewPassValid && !isSamePass} />
                                    </div>
                                    {!isNewPassValid && <p className="invalid-message" align="center">Password must be in 6 to 80 characters</p>}
                                    {isSamePass && <p className="invalid-message" align="center">New password cannot be the same as your current password</p>}
                                </div>
                                <div className="modal-wrapper-form-submit">
                                    <input type="button"
                                        value="Cancel"
                                        onClick={props.handleClose} />
                                    <input type="button"
                                        value="Save"
                                        onClick={handleChangePassword}
                                        disabled={isDisable}
                                        style={{ backgroundColor: isDisable ? "#D3D3D3" : "red" }} />
                                </div>
                            </div>
                        )
                        : <MessageModal isShowing={isSuccess} hide={toggle} onClose={props.handleClose} />
                }
            </div>
        </div>
    )
}

export default ChangePasswordModal
