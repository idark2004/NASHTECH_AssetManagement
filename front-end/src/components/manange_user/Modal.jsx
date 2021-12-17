import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-regular-svg-icons'

const DetailsAssignmentModal = (props) => {
    const [data, setData] = useState({})
    const [transformState, setTransformState] = useState("")

    useEffect(() => {
        setData(props.details)
        setTransformState(props.details.state)
    }, [props.details])

    return (
        <div className={`details-asset__modal ${props.show ? 'active' : ''}`}>
            <div className="details-asset__modal__content">
                <div className="details-asset__modal__content__header">
                    Detailed Assignment Information
                    <FontAwesomeIcon className="details-asset__modal__content__header__close" onClick={() => props.close()} icon={faWindowClose}></FontAwesomeIcon>
                </div>
                <div className="details-asset__modal__content__form">
                    <table className="details-asset__modal__content__form__table">
                        <tbody>
                            <tr>
                                <td>Staff Code</td>
                                <td>{data.id}</td>
                            </tr>
                            <tr>
                                <td>Full Name:</td>
                                <td>{data.firstName + " " + data.lastName}</td>
                            </tr>
                            <tr>
                                <td>Username:</td>
                                <td>{data.username}</td>
                            </tr>
                            <tr>
                                <td>Gender:</td>
                                <td>{data.gender}</td>
                            </tr>
                            <tr>
                                <td>Date of birth:</td>
                                <td className="state">{data.dateOfBirth}</td>
                            </tr>
                            <tr>
                                <td>Join Date:</td>
                                <td className="state">{data.joinDate}</td>
                            </tr>
                            <tr>
                                <td>Role</td>
                                <td>{data.role}</td>
                            </tr>
                            <tr>
                                <td>Location</td>
                                <td>{localStorage.getItem('locationName')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default DetailsAssignmentModal
