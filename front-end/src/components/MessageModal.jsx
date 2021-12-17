import { ReactChild, useEffect } from 'react'
import PropTypes from 'prop-types'

import Button from './Button'

const MessageModal = (props) => {

    const handleCancel = () => {
        props.hide();
        props.onClose();
    }

    return (
        <div >
            <div className="message__modal__content__form">
                <p style={{ color: "black" }}>Your password has been changed successfully!</p>
                <div className="message__modal__content__close">
                    <input type="button"
                        value="Cancel"
                        onClick={handleCancel} />
                </div>
            </div>
        </div>
    )
}

MessageModal.propTypes = {
    isShowing: PropTypes.bool,
    hide: PropTypes.func
}

export default MessageModal
