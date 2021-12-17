import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

import authService from '../services/authService'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faArrowDown } from "@fortawesome/free-solid-svg-icons"
import Popup from "../components/Popup"
import logo from "../assets/images/logo-white.png"
import ChangePass from '../pages/ChangePass'
import ChangePasswordModal from './ChangePasswordModal'
import MessageModal from './MessageModal'
import AssetRemoveModal from './manage_asset/AssetRemoveModal'

const Header = () => {
    const history = useHistory();

    let getUser = localStorage.getItem("userId")

    //logout popup
    const [isOpen, setIsOpen] = useState(false);
    const [titleHeader, setTitleHeader] = useState("Online Asset Management");
    const [showSuccessPopUp, setShowSuccessPopUp] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
        document.getElementById("selectList")
            .getElementsByTagName('option')[0].selected = "selected";
    }

    const [changePasswordModalActive, setChangePasswordModalActive] = useState(false)

    useEffect(() => {
        setChangePasswordModalActive(false)
    }, [getUser])

    useEffect(() => {
        handleTitleHeader();
    })

    const showChangePasswordModal = () => {
        setChangePasswordModalActive(true);
        document.getElementById("selectList")
            .getElementsByTagName('option')[0].selected = "selected";
    }

    const showMessagePopUp = () => {
        setShowSuccessPopUp(!showSuccessPopUp);
    }

    const handleSelect = (e) => {
        if (e.target.value == "logout") {
            togglePopup();
        }
        if (e.target.value == "changepass") {
            showChangePasswordModal();
        }
    }

    const handleTitleHeader = () => {
        switch (window.location.pathname) {
            case "/login":
                setTitleHeader("Online Asset Management")
                break;
            case "/":
                setTitleHeader("Home")
                break;
            case "/admin/user":
                setTitleHeader("Manage User")
                break;
            case "/admin/user/new":
                setTitleHeader("Manage User > Create New User")
                break;
            case "/admin/asset":
                setTitleHeader("Manage Asset")
                break;
            case "/admin/assignment":
                setTitleHeader("Manage Assignment")
                break;
            case "/admin/assignment/new":
                setTitleHeader("Manage Assignment > Create New Assignment")
                break;
            case "/admin/assignment/edit":
                setTitleHeader("Manage Assignment > Edit Assignment")
                break;
            case "/admin/request":
                setTitleHeader("Manage Request")
                break;
            default:
                break;
        }
    }

    return (
        <div className="header">
            {
                changePasswordModalActive ? <ChangePasswordModal
                    handleClose={() => setChangePasswordModalActive(!changePasswordModalActive)}
                    handleMessage={showMessagePopUp} />
                    : null
            }
            <div className="container">
                <div className="header__logo">
                    <Link to="/">
                        <img src={logo} alt="" />
                    </Link>
                    <h2 style={{ color: "white", paddingBottom: "2rem" }}>{titleHeader}</h2>
                </div>
                <div className="header__menu">
                    <div className="header__menu__right" style={{ display: 'flex' }}>
                        <div className="header__menu__item header__menu__right__item">
                            {isOpen && <Popup
                                handleClose={togglePopup}
                            />}
                            {
                                localStorage.hasOwnProperty("jwt") &&
                                    localStorage.getItem("jwt") !== "" &&
                                    window.location.pathname !== "/login" ?
                                    (
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div>
                                                <select
                                                    id="selectList"
                                                    onChange={handleSelect}
                                                    defaultValue={0}
                                                    style={{ backgroundColor: "transparent", border: "none", color: "white" }}>
                                                    <option hidden>
                                                        {localStorage.hasOwnProperty("userName") && localStorage.getItem("userName")}
                                                    </option>
                                                    <option value="logout">Log out</option>
                                                    <option value="changepass">Change password</option>
                                                </select>
                                            </div>
                                        </div>
                                    ) : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* {
                changePasswordModalActive ? history.push("/password") : null
            } */}
        </div >
    )
}

export default Header
