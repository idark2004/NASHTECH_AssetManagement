import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

const AssetWarningModal = (props) => {

    return (
        <div className="asset-modal-wrapper">
            <div className="asset-modal-wrapper-header" style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>Cannot Delete Asset</h3>
                <FontAwesomeIcon
                    icon={faWindowClose}
                    style={{ color: "red", fontSize: "1.5rem" }}
                    onClick={props.handleClose}
                />
            </div>
            <div className="asset-modal-wrapper-message">
                <p style={{ color: "black" }}>
                    Cannot delete the asset because it belongs to one or more historical assignments.<br />
                    If the asset is not able to be used anymore,
                    please update its state in&nbsp;
                    <Link
                        to={{
                            pathname: '/admin/asset/edit',
                            state: { asset: props.asset }
                        }}
                        style={{ color: "blue", textDecoration: "underline" }}>
                        Edit Asset page
                    </Link>
                </p>
            </div>
        </div >
    )
}

export default AssetWarningModal
