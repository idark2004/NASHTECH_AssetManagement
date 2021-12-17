import { React, useState } from 'react';
import axios from 'axios';
import AssetWarningModal from "./AssetWarningModal";

const AssetRemoveModal = (props) => {

    const baseUrl = "https://assetmanagementrookies03.azurewebsites.net/api/v1";
    const endPoint = "/asset/";

    const [message, setMessage] = useState("");

    const closeModal = () => {
        props.handleClose();
    }

    const handleDelete = () => {
        const url = baseUrl + endPoint + props.AssetRemove.assetCode;
        const params = { locationId: localStorage.getItem("locationId") };
        let config = {
            headers: { Authorization: localStorage.getItem("jwt") },
        };
        console.log(url);
        console.log(params);
        console.log(config);
        axios.delete(url, { params }, config)
            .then(res => {
                console.log(res.data);
                if (res.data.status === "OK") {
                    alert("Deleted Asset successfully");
                    window.location.reload();
                    props.handleClose();
                }
                else if (res.data.status === "NOT_ACCEPTABLE") {
                    setMessage(res.data.message);
                }
            })
            .catch(err => {
                if (err.response.status == 404) {
                    alert("Deleted Asset unsuccessfully");
                    window.location.reload();
                    props.handleClose();
                }
            })
            .then(() => { });
    }

    return (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}>
            {
                props.AssetRemove.hasAssignmentHistory !== true && <div className="asset-modal-wrapper">
                    <div className="asset-modal-wrapper-header">
                        <h3>Are you sure?</h3>
                    </div>
                    <div className="asset-modal-wrapper-message">
                        <p style={{ color: "black" }}>Do you want to delete this asset?</p>
                    </div>
                    <div className="asset-modal-wrapper-submit">
                        <input type="button"
                            value="Delete"
                            onClick={handleDelete} />
                        <input type="button"
                            value="Cancel"
                            style={{ backgroundColor: "white", color: "black", border: "0.5px solid #8d8d8d" }}
                            onClick={props.handleClose} />
                    </div>
                </div>
            }
            {props.AssetRemove.hasAssignmentHistory && <AssetWarningModal asset={props.AssetRemove} message={message} handleClose={closeModal} />}
        </div>
    )
}

export default AssetRemoveModal;
