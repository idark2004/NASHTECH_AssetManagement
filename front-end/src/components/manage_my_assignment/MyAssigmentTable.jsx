import React, { useState, useEffect } from 'react'
import { faCheck, faRedoAlt, faSortDown, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DetailModal from './DetailModal';
import api from '../../apis/apiFetch'
import axios from 'axios'
import ResponseModal from './ResponseModal';
import PopupError from '../PopupError';
import moment from "moment";


function ManageAssigmentTable() {
    const [displayList, setDisplayList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [currDetails, setCurrentDetails] = useState();
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [sortCode, setSortCode] = useState(true);
    const [sortName, setSortName] = useState(true);
    const [sortCategory, setSortCategory] = useState(true);
    const [sortDate, setSortDate] = useState(true);
    const [sortState, setSortState] = useState(true);

    useEffect(() => {
        let id = localStorage.getItem("userId");
        setLoading(true);
        async function getAssignmentList() {
            await api.list('assignment/user/' + id)
                // await axios.get('http://localhost:8080/api/v1/assignment/user/' + id,
                //     { headers: { Authorization: localStorage.getItem('jwt') } })
                .then(response => {
                    setDisplayList(response.sort((a, b) => (a.assetCode > b.assetCode) ? 1 :
                        (a.assetCode < b.assetCode) ? -1 : 0))
                })
                .catch(error => console.log(error));
        }
        getAssignmentList();
        setLoading(false);
    }, []);

    const sort = (rule) => {
        let responseObj = {
            data: displayList
        }
        let sortedList = sortResponse(rule, responseObj);
        console.log(sortedList);
        setDisplayList(() => [...sortedList]);
    }

    const sortResponse = (rule, responseObj) => {
        console.log(rule)
        switch (rule) {
            case "category": {
                setSortCategory(!sortCategory);
                let sortData = displayList.sort((a, b) =>
                    (a.categoryName > b.categoryName) ? 1 :
                        (a.categoryName < b.categoryName) ? -1 : 0);
                if (!sortCategory) {
                    sortData = sortData.reverse();
                }
                return sortData;
            }
            case "assetName": {
                setSortName(!sortName);
                let sortData = displayList.sort((a, b) =>
                    (a.assetName > b.assetName) ? 1 :
                        (a.assetName < b.assetName) ? -1 : 0);
                if (!sortName) {
                    sortData = sortData.reverse();
                }
                return sortData;
            }
            case "assetCode": {
                setSortCode(!sortCode);
                let sortData = displayList.sort((a, b) =>
                    (a.assetCode > b.assetCode) ? 1 :
                        (a.assetCode < b.assetCode) ? -1 : 0);
                if (!sortCode) {
                    sortData = sortData.reverse();
                }
                return sortData;
            }
            case "date": {
                setSortDate(!sortDate);
                let sortData = displayList.sort((a, b) =>
                    (a.assignedDate > b.assignedDate) ? 1 :
                        (a.assignedDate < b.assignedDate) ? -1 : 0);
                if (!sortDate) {
                    sortData = sortData.reverse();
                }
                return sortData;
            }
            case "state": {
                setSortState(!sortState);
                let sortData = displayList.sort((a, b) =>
                    (a.state > b.state) ? 1 :
                        (a.state < b.state) ? -1 : 0);
                if (!sortState) {
                    sortData = sortData.reverse();
                }
                return sortData;
            }

        }
    }

    const handleDetail = (index) => {
        console.log('go detail');
        setPopUp(true);
        setCurrentDetails(displayList[index]);
    }

    const ellipsis = {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    }

    const [responseModalActive, setResponseModalActive] = useState(false);
    const [itemResponse, setItemResponse] = useState();
    const [responseType, setResponseType] = useState("ACCEPTED")

    const handleOpenModal = (item, type) => {
        setResponseType(type)
        setItemResponse(item)
        setResponseModalActive(true);
    }

    const refreshTable = (assign) => {
        let newList;
        if (assign.state === "DECLINED") {
            newList = displayList.filter((item) => item.id !== assign.id);
        } else {
            newList = displayList.map((item) => {
                if (item.id == assign.id) {
                    item.state = assign.state;
                }
                return item;
            })
        }
        setDisplayList(newList)
    }

    return (
        <div className="assign_table_section">
            {responseModalActive && <ResponseModal
                setIsError={setIsError}
                setErrorMessage={setErrorMessage}
                item={itemResponse}
                type={responseType}
                handleClose={() => setResponseModalActive(!responseModalActive)}
                handleRefresh={(assign) => refreshTable(assign)}
            />}
            {isError ? <PopupError close={(e) => { 
                setIsError(!isError);
                window.location.reload()                
            }} message={errorMessage}></PopupError> : <></>}
            <div className="assign_table_wrapper" >
                {!loading ? <table style={{ maxWidth: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{
                                width: '7%',
                                whiteSpace: 'nowrap'
                            }} onClick={(e) => sort('assetCode')}>
                                <p className="col" >Asset Code
                                    <FontAwesomeIcon icon={faSortDown} style={{ marginLeft: 4 }} />
                                </p>
                            </th>
                            <th style={{
                                width: '15%',
                                whiteSpace: 'nowrap'
                            }} onClick={(e) => sort('assetName')}>
                                <p className="col" >Asset Name
                                    <FontAwesomeIcon icon={faSortDown} style={{ marginLeft: 4 }} />
                                </p>
                            </th>
                            <th style={{
                                width: '15%',
                                whiteSpace: 'nowrap'
                            }} onClick={(e) => sort('category')}>
                                <p className="col">Category
                                    <FontAwesomeIcon icon={faSortDown} style={{ marginLeft: 4 }} />
                                </p>
                            </th>
                            <th style={{
                                width: '7%',
                                whiteSpace: 'nowrap'
                            }} onClick={(e) => sort('date')}>
                                <p className="col">Assign Date
                                    <FontAwesomeIcon icon={faSortDown} style={{ marginLeft: 4 }} />
                                </p>
                            </th>
                            <th style={{
                                width: '20%',
                                whiteSpace: 'nowrap'
                            }} onClick={(e) => sort('state')}>
                                <p className="col">State
                                    <FontAwesomeIcon icon={faSortDown} style={{ marginLeft: 4 }} /></p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (displayList !== null && displayList !== undefined) &&
                            displayList.map((assignment, index) => {
                                return <tr key={assignment.id}>
                                    <td
                                        style={{
                                            maxWidth: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onClick={(e) => { handleDetail(index) }}>
                                        <p className="col" style={ellipsis}>{assignment.assetCode}</p>
                                    </td>
                                    <td
                                        style={{
                                            maxWidth: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onClick={(e) => { handleDetail(index) }}>
                                        <p className="col" style={ellipsis}>{assignment.assetName}</p>
                                    </td>
                                    <td
                                        style={{
                                            maxWidth: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onClick={(e) => { handleDetail(index) }}>
                                        <p className="col" style={ellipsis}>{assignment.categoryName}</p>
                                    </td>
                                    <td
                                        style={{
                                            maxWidth: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onClick={(e) => { handleDetail(index) }}>
                                        <p className="col" style={ellipsis}>{moment(Date.parse(assignment.assignedDate)).format("DD/MM/YYYY")}</p>
                                    </td>
                                    <td
                                        style={{
                                            maxWidth: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onClick={(e) => { handleDetail(index) }}>
                                        <p className="col" style={ellipsis}>{
                                            assignment.state.toString().replaceAll("_", " ").toLowerCase()
                                        }</p>
                                    </td>
                                    <td style={{ width: "1%" }}>
                                        <button
                                            id="edit_btn"
                                            onClick={() => handleOpenModal(assignment, 'ACCEPTED')}
                                            className={assignment.state !== 'ACCEPTED' ? "btn" : "btn disable"}
                                            disabled={assignment.state === 'ACCEPTED'}>
                                            <FontAwesomeIcon
                                                icon={faCheck} />
                                        </button>
                                    </td>
                                    <td style={{ width: "1%" }}>
                                        <button
                                            id="remove_btn"
                                            onClick={() => handleOpenModal(assignment, 'DECLINED')}
                                            className={assignment.state !== 'ACCEPTED' ? "btn" : "btn disable"}
                                            disabled={assignment.state === 'ACCEPTED'}>
                                            <FontAwesomeIcon
                                                icon={faTimes} />
                                        </button>
                                    </td>
                                    <td style={{ width: "1%" }}>
                                        <button
                                            id="recycle_btn"
                                            onClick={() => handleOpenModal(assignment, 'REQUEST')}
                                            className={assignment.state !== 'ACCEPTED' || assignment.requested ? "btn disable" : "btn"}
                                            disabled={assignment.state !== 'ACCEPTED' || assignment.requested}>
                                            <FontAwesomeIcon
                                                icon={faRedoAlt} />
                                        </button>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                    : <h2>Loading</h2>}
            </div>
         
            {
                popUp ? <DetailModal details={currDetails} show={popUp} close={() => {
                    setPopUp(false);
                }} /> : <></>
            }
        </div >
    )
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         onSortRuleChange: (rule) => {
//             dispatch({ type: LOAD_NEW_ASSIGNMENT_SORT_RULE, payload: rule });
//         },
//     }
// }

// const mapStateToProps = (state) => {
//     return {
//         newAssignment: state.newAssignment,
//         sortAssignmentRule: state.sortAssignmentRule,
//     };
// }
// connect(mapStateToProps, mapDispatchToProps)
export default (ManageAssigmentTable);
