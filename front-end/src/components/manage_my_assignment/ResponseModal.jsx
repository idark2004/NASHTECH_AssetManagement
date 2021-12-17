import { React, useState } from 'react';
import axios from 'axios';

const ResponseModal = (props) => {
    const baseUrl = "https://assetmanagementrookies03.azurewebsites.net/api/v1";
    const localUrl = "http://localhost:8080/api/v1"
    const endPoint = "/assignment/";
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const handleResponse = () => {
        const url = baseUrl + endPoint + `${props.item.id}`;
        const params = { state: props.type }
        const config = {
            headers: { Authorization: localStorage.getItem("jwt") },
        }
        axios.put(url, null, { params }, config)
            .then(res => {
                console.log(res)
                if (res.data.status === "OK") {
                    const newItem = props.item;
                    newItem.state = props.type;
                    props.handleRefresh(newItem);
                } else {
                    alert(res.data.message);
                    window.location.reload();
                }
            })
            .catch(err => {
                console.log(err.response)
                alert("Response failed");
            })
            .then(() => { props.handleClose() });
    }

    const handleRequest = () => {
        // console.log("Create Request");
        // console.log(props.item);
        const url = baseUrl + '/request';
        const config = {
            headers: { 'Authorization': localStorage.getItem("jwt") },
        }
        let returnRequest = {
            assignmentId: props.item.id,
            username: props.item.assignee,
            locationId: localStorage.getItem('locationId'),
        }
        axios.post(url, returnRequest, config)
            .then(res => {
                const newItem = props.item;
                newItem.requested = !props.item.requested;
                props.handleRefresh(newItem);
            })
            .catch(err => {
                props.setErrorMessage(err.response.data.message)
                props.setIsError(true)
            })
            .then(() => { props.handleClose() });
    }

    return (
        <div className='my-assignment' style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}>
            <div className="my-assignment-modal-wrapper">
                <div className="my-assignment-modal-wrapper-header">
                    <h3>Are you sure?</h3>
                </div>
                <div className="my-assignment-modal-wrapper-message">
                    <p style={{ color: "black" }}>
                        {props.type === "ACCEPTED" && "Do you want to accept this assignment?"}
                        {props.type === "DECLINED" && "Do you want to decline this assignment?"}
                        {props.type === "REQUEST" && "Do you want to create a returning request for this asset?"}
                    </p>
                </div>
                <div className="my-assignment-modal-wrapper-submit">
                    {props.type === "ACCEPTED" &&
                        <input type="button"
                            value="Accept"
                            onClick={handleResponse} />
                    }
                    {props.type === "DECLINED" &&
                        <input type="button"
                            value="Decline"
                            onClick={handleResponse} />
                    }
                    {props.type === "REQUEST" &&
                        <input type="button"
                            value="Yes"
                            onClick={handleRequest} />
                    }
                    <input type="button"
                        value={props.type !== "REQUEST" ? "Cancel" : "No"}
                        style={{ backgroundColor: "white", color: "black", border: "0.5px solid #8d8d8d" }}
                        onClick={props.handleClose} />
                </div>
            </div>
        </div>

    )
}

export default ResponseModal
