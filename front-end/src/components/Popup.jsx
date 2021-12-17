import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import authService from "../services/authService";

const Popup = props => {
    const popupBoxStyle = {
        zIndex: 9999,
        position: "fixed",
        background: "#00000050",
        width: "100%",
        height: "100vh",
        top: 0,
        left: 0,
    }
    const boxStyle = {
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        width: "20%",
        margin: "0 auto",
        marginTop: "15vw",
        background: "#fff",
        border: "1px solid black",
        overflow: "auto",
        borderRadius: "1rem"
    }

    const cancelBtnStyle = {
        zIndex: 9999,
        cursor: "pointer",
        width: "25px",
        height: "25px",
        lineHeight: "20px",
        textAlign: "center",
        border: "1px solid #999",
        fontSize: "15px",
        marginLeft: "10px",
        padding: "0.5rem 1rem",
        borderRadius: "0.5rem",
        color: "#2C272E"
    }

    const logoutBtnStyle = {
        zIndex: 9999,
        cursor: "pointer",
        background: "red",
        width: "25px",
        height: "25px",
        lineHeight: "20px",
        textAlign: "center",
        fontSize: "15px",
        color: "white",
        padding: "0.5rem 1rem",
        borderRadius: "0.5rem"
    }
    const boxHeader = {
        background: "#EAEAEA",
        padding: 10,
        borderBottom: "1px solid black",
        textAlign: "center"
    }
    const boxTitle = {
        margin: "0 auto",
        padding: "1rem 0"
    }
    const boxBody = {
        margin: "0 auto",
        padding: "2rem"
    }
    return (
        <div className="popup-box" style={popupBoxStyle}>
            <div className="box" style={boxStyle}>
                <div className="box-header" style={boxHeader}>
                    <h3 style={{ color: "red" }}>Are you sure?</h3>
                </div>
                <div className="box-title" style={boxTitle}>
                    <h5 style={{ color: "black" }}>Do you want to log out?</h5>
                </div>
                <div className="box-body" style={boxBody}>
                    <span style={logoutBtnStyle} onClick={authService.logout}>Log out</span>
                    <span style={cancelBtnStyle} onClick={props.handleClose}>Cancel</span>
                </div>

            </div>
        </div>
    );
};

export default Popup;