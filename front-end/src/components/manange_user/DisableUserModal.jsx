import React from 'react'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-regular-svg-icons'

const DisableUserModal = props => {
    return (
        <div>
            <div className={`disable-user__modal ${props.isActive ? 'active' : ''}`}>
                <div className="disable-user__modal__content">
                    <div className="disable-user__modal__content__header">
                        Cannot disable user
                        <FontAwesomeIcon className="disable-user__modal__content__header__close" onClick={() => props.close()} icon={faWindowClose}></FontAwesomeIcon>
                    </div>
                    <div className="disable-user__modal__content__form">
                        <p>There are valid assignments belonging to this user. Please close all assignments before disabling user.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

DisableUserModal.propTypes = {
    isActive: PropTypes.bool,
    close: PropTypes.func
}

export default DisableUserModal
