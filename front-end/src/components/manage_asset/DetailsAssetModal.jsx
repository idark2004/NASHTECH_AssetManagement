import React, { useEffect, useState } from 'react'

import { getHistory } from '../../apis/fetchApi'

import moment from 'moment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-regular-svg-icons'

const DetailsAssetModal = (props) => {

    const [data, setData] = useState({})
    const [history, setHistory] = useState([])
    const [transformState, setTransformState] = useState("")


    const loadHistory = async () => {
        const response = getHistory(props.details.assetCode)
        const historyData = (await response).data
        setHistory(historyData)
    }

    useEffect(() => {
        loadHistory()
        setData(props.details)
        setTransformState(props.details.state)
    }, [props.details])

    return (
        <div className={`details-asset__modal ${props.show ? 'active' : ''}`}>
            <div className="details-asset__modal__content">
                <div className="details-asset__modal__content__header">
                    Detailed Asset Information
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
                                <td>Category</td>
                                <td>{data.categoryName}</td>
                            </tr>
                            <tr>
                                <td>Installed Date</td>
                                <td>{moment(data.installedDate).format('DD/MM/YYYY')}</td>
                            </tr>
                            <tr>
                                <td>State</td>
                                <td className="state">{transformState.split('_').join(' ').toLocaleLowerCase()}</td>
                            </tr>
                            <tr>
                                <td>Location</td>
                                <td>{localStorage.getItem("locationName")}</td>
                            </tr>
                            <tr>
                                <td>Specification</td>
                                <td>{data.specification}</td>
                            </tr>
                            <tr>
                                <td>History</td>
                                <td>
                                    <table className="history-table">
                                        <thead>
                                            <tr>
                                                <th className="history-table__header"><p>Date</p></th>
                                                <th className="history-table__header"><p>Assigned to</p></th>
                                                <th className="history-table__header"><p>Assigned by</p></th>
                                                <th className="history-table__header"><p>Returned Date</p></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                history.map((item, index) => (
                                                    <tr key={index}>
                                                        <td><p>{moment(item.assignedDate).format('DD/MM/YYYY')}</p></td>
                                                        <td><p>{item.assignee}</p></td>
                                                        <td><p>{item.assigner}</p></td>
                                                        <td><p>11/12/2021</p></td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DetailsAssetModal
