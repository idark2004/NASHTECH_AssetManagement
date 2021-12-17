import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ReturnPopup = props => {
    const [message, setMessage] = useState(props.message);
    
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

    const logoutBtnStyle = {
        zIndex: 9999,
        cursor: "pointer",
        background: "red",
        width: "25px",
        height: "25px",
        lineHeight: "20px",
        fontSize: "15px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        justifyContent: "space-around",
        padding: "0.5rem auto",
        borderRadius: "0.5rem",
        width: "5rem",
        marginLeft: '20px'
    }
    const logoutBtnStyleWhite = {
        zIndex: 9999,
        cursor: "pointer",
        background: "white",
        width: "25px",
        height: "25px",
        lineHeight: "20px",
        fontSize: "15px",
        color: "black",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        justifyContent: "space-around",
        padding: "0.5rem auto",
        borderRadius: "0.5rem",
        width: "5rem",
        marginLeft: '20px',
        border: "0.5px solid #8d8d8d"
    }
    const boxHeader = {
        background: "#EAEAEA",
        padding: 10,
        borderBottom: "1px solid black",
        textAlign: "left"
    }
    const boxTitle = {
        margin: "0px 20px",
        padding: "1rem 0"
    }
    const boxBody = {
        margin: "0px 0px",
        padding: "1.4rem"
    }

    const boxFooter = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingRight: "20px",
        paddingBottom: "20px",
        margin: "0 10px"
    }


    return (
        <div className="popup-box" style={popupBoxStyle}>
            <div className="box" style={boxStyle}>
                <div className="box-header" style={boxHeader}>
                    <h3 style={{ color: "red" }}>Are you sure?</h3>
                </div>                
                <div className="box-body" style={boxBody}>
                    <p>{message}</p>
                </div>                
                <div style={boxFooter}>
                    <span style={logoutBtnStyle} onClick={props.action}>Yes</span>
                    <span style={logoutBtnStyleWhite} onClick={props.close}>No</span>
                </div>
            </div>
        </div>
    );
};

export default ReturnPopup;