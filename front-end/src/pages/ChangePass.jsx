import React from 'react'
import LoginModal from '../components/Login/LoginModal'
import { useLocation } from "react-router-dom";
import './styles.scss';
import ChangePasswordModal from '../components/ChangePasswordModal';
import Menu from "../components/Menu"
import Header from "../components/Header"

const ChangePass = () => {
    return (
        <div>
            <div>
                <Header />
            </div>
            <div style={{ display: "flex", flexDirection: "row", padding: "3em" }}>
                <div style={{ flexGrow: 2 }}>
                    <Menu />
                </div>
                <div style={{ flexGrow: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ChangePasswordModal />
                </div>
            </div>
        </div>
    )
}

export default ChangePass
