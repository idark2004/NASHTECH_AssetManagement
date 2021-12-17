import React from 'react'
import LoginModal from '../components/Login/LoginModal'
import { useLocation } from "react-router-dom";
import './styles.scss';
import ChangePasswordModalFirstTime from '../components/Login/ChangePasswordModalFirstTime';
import Headers from "../components/Header"

const Login = () => {
    const location = useLocation();

    return (
        <div className="login-layout">
            <div className="login-layout-nav">
                <Headers />
            </div>
            <div className="login-layout-modal">
                {
                    (location.state === undefined ||
                        location.state.isFirstTime !== true) ?
                        <LoginModal className="login-modal" /> :
                        <ChangePasswordModalFirstTime />
                }
            </div>

        </div>
    )
}

export default Login
