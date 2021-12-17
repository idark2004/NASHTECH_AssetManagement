import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { disableUser } from '../../apis/fetchApi'
import { connect } from 'react-redux'
const ConfirmDisableUser = props => {
    const [fail, setFail] = useState(false);
    const handleConfirmDisable = async (staffCode) => {
        let promise = disableUser(staffCode);
        let result = (await promise).data;
        if (result === 'SUCCESS') {
            window.location.reload();
        } else {
            setFail(true);
        }
    }
    return (
        <div>
            <div className={`confirm-disable-user__modal ${props.isActive ? 'active' : ''}`}>
                <div className="confirm-disable-user__modal__content">
                    <div className="confirm-disable-user__modal__content__header">
                        Are you sure?
                    </div>
                    <div className="confirm-disable-user__modal__content__form">
                        <p>Do you want disable this user?</p>
                        <button onClick={() => handleConfirmDisable(props.disableStaffCode)}>Disable</button>
                        <button className="cancel" onClick={() => props.close()}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


ConfirmDisableUser.propTypes = {
    isActive: PropTypes.bool,
    close: PropTypes.func,
}
export default ConfirmDisableUser;
