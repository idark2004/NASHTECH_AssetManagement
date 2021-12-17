import React from 'react'
import * as constants from '../../utils/constants/url';
import axios from 'axios';

const AssignmentRemoveModal = (props) => {

    const handleDelete = () => {
        const url = constants.API_URL_VER1 + constants.EP_ASSIGNMENT + props.AssignmentRemove.id;
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
                    props.handleRemoveItem();
                    props.handleClose();
                }
                else if (res.data.status === "BAD_REQUEST") {
                    alert("Deleted Assignment unsuccessfully");
                    window.location.reload();
                    props.handleClose();
                }
            })
            .catch(err => {
                if (err.response.status == 404) {
                    alert("Deleted Assignment unsuccessfully");
                    window.location.reload();
                    props.handleClose();
                }
            })
            .then(() => { });
    }

    return (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}>
            <div className="assignment-modal-wrapper">
                <div className="assignment-modal-wrapper-header">
                    <h3>Are you sure?</h3>
                </div>
                <div className="assignment-modal-wrapper-message">
                    <p style={{ color: "black" }}>Do you want to delete this assignment?</p>
                </div>
                <div className="assignment-modal-wrapper-submit">
                    <input type="button"
                        value="Delete"
                        onClick={handleDelete} />
                    <input type="button"
                        value="Cancel"
                        style={{ backgroundColor: "white", color: "black", border: "0.5px solid #8d8d8d" }}
                        onClick={props.handleClose} />
                </div>
            </div>
        </div>
    )
}

export default AssignmentRemoveModal
