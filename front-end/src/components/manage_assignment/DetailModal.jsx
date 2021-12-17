import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-regular-svg-icons'
import moment from 'moment'
const DetailsAssignmentModal = (props) => {
    const [data, setData] = useState({})
    const [transformState, setTransformState] = useState("")

    useEffect(() => {
        let transformState = props.details.state.toString()[0].toUpperCase() + props.details.state.toString().replaceAll("_", " ").toLowerCase().substring(1)
        setData(props.details)
        setTransformState(transformState);
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
                                <td>Asset Code</td>
                                <td>{data.assetCode}</td>
                            </tr>
                            <tr>
                                <td>Asset Name</td>
                                <td>{data.assetName}</td>
                            </tr>
                            <tr>
                                <td>Specification</td>
                                <td>{data.specification}</td>
                            </tr>
                            <tr>
                                <td>Assigned To</td>
                                <td>{data.assignee}</td>
                            </tr>
                            <tr>
                                <td>Assigned By</td>
                                <td>{data.assigner}</td>
                            </tr>
                            <tr>
                                <td>Assigned Date</td>
                                <td>{moment(Date.parse(data.assignedDate)).format("DD/MM/YYYY")}</td>
                            </tr>
                            <tr>
                                <td>State</td>
                                <td>{
                                    transformState
                                }
                                </td>
                            </tr>
                            <tr>
                                <td>Note</td>
                                <td>{data.note}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DetailsAssignmentModal
