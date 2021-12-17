import React, { useState, useEffect, useReducer } from 'react'
import { faPencilAlt, faRedoAlt, faSortDown, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../css/ManageAssigment.css'
import { connect } from 'react-redux'
import { LOAD_NEW_ASSIGNMENT_SORT_RULE } from '../../actions/actionConstantv2'
import { searchAndFilterAssignment } from '../../apis/assignmentApi'
import DetailsModal from './DetailModal'
import AssignmentRemoveModal from './AssignmentRemoveModal'
import moment from "moment";
import { useHistory } from 'react-router-dom'
import api from "../../apis/apiFetch";
import ReturnPopup from './CreateReturnPopup'
import PopupError from '../PopupError'

function ManageAssigmentTable(props) {
    const [page, setPage] = useState(props.page);
    const [keyword, setKeyword] = useState(props.keyword);
    const [filterState, setFilterState] = useState(props.filterState);
    const [filterDate, setFilterDate] = useState(props.filterDate);
    const [displayList, setDisplayList] = useState(props.displayList);
    const [sortAssignmentRule, setSortAssignmentRule] = useState(props.sortAssignmentRule)
    const [loading, setLoading] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [currDetails, setCurrentDetails] = useState(null);
    const [removeAssignment, setRemoveAssignment] = useState(false);
    const [assignmentRemove, setAssignmentRemove] = useState();
    const [createReturnPopup, setCreateReturnPopup] = useState(false)
    const [confirmCreate,setConfirmCreate] = useState()
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const history = useHistory()

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const handleCreateReturn = (item) => { 
        setConfirmCreate(item)       
        setCreateReturnPopup(true)        
    }

    const actionCreate = () =>{
        const requestBody = {
            assignmentId : confirmCreate.id,
            username : localStorage.getItem('userName'),
            locationId: localStorage.getItem('locationId')
        }
        api.create('request',requestBody).then(res =>{
            window.location.reload()
        }).catch(err =>{                
            setCreateReturnPopup(false)        
            setErrorMessage(err.response.data.message)
            setIsError(true)
        })
    }
    const closeCreateModal = () => {
        setCreateReturnPopup(false);
    }

    const handleEdit = (assignment) => {
        api.list(`user/${assignment.assignee}`).then(res => {
            console.log(res);
            history.push({
                pathname: `/admin/assignment/edit/${assignment.id}`,
                state: {
                    userId: res,
                    assignment: assignment
                }
            })
            window.localStorage.setItem("currentEditAssignment", JSON.stringify(assignment));
            window.localStorage.setItem("currentEditAssignmentAssigneeId", res)
        })
    }
    useEffect(() => {
        if (displayList !== undefined) {
            setFilterDate(props.filterDate);
        }
    }, [displayList])

    useEffect(() => {
        setSortAssignmentRule(props.sortRule);
    }, [props.sortRule])

    useEffect(() => {
        setFilterState(props.filterState);
    }, [props.filterState])

    useEffect(() => {
        setFilterDate(props.filterDate);
    }, [props.filterDate])

    useEffect(() => {
        if (props.newAssignment !== undefined && props.newAssignment !== null) {
            setDisplayList([props.newAssignment, ...props.displayList]);
        } else {
            setDisplayList(props.displayList);
        }
    }, [props.displayList])



    useEffect(() => {
        console.log('new assignment create');
        console.log(props.newAssignment);
        if (props.newAssignment !== undefined && props.newAssignment !== null) {
            setDisplayList([props.newAssignment, ...props.displayList]);
        } else {
            setDisplayList(props.displayList);
        }
    }, [props.newAssignment])

    useEffect(() => {
    }, [])

    const callApi = async (sortRule) => {
        let responseObj;
        console.log(keyword)
        console.log(filterState);
        console.log(sortRule);
        setLoading(true);
        let filterRule;
        if (filterState.includes('ALL')) {
            filterRule = ['ALL']
        } else {
            filterRule = filterState;
        }
        responseObj = (await searchAndFilterAssignment(keyword, filterRule.toLocaleString(), filterDate, page, sortRule)).data;
        if (props.newAssignment !== undefined && props.newAssignment !== null) {
            let newList = [props.newAssignment, ...responseObj.data];
            setDisplayList(newList);
        } else {
            setDisplayList(responseObj.data);
        }
        setLoading(false);
    }

    const sort = (rule) => {
        props.onSortRuleChange(rule);
        setSortAssignmentRule(rule);
        callApi(rule);
    }


    const handleDetail = (index) => {
        console.log('go detail');
        setPopUp(true);
        setCurrentDetails(displayList[index]);
    }

    const openRemoveModal = (item) => {
        setAssignmentRemove(item);
        setRemoveAssignment(!removeAssignment);
    }

    const closeRemoveModal = () => {
        setRemoveAssignment(!removeAssignment);
    }

    const refreshList = (removeItem) => {
        const newList = displayList.filter((item) => item.id !== removeItem.id);
        setDisplayList(newList);
    }

    return (
        <div className="assign_table_section">
            {
                removeAssignment ? <AssignmentRemoveModal
                    AssignmentRemove={assignmentRemove}
                    handleClose={closeRemoveModal}
                    handleRemoveItem={() => refreshList(assignmentRemove)} /> : null
            }
            {
                createReturnPopup ? <ReturnPopup                
                action={actionCreate}
                close={closeCreateModal}
                message ='Do you want to create a returning request for this asset?'
                 /> : null
            }
            <div className="assign_table_wrapper">
                {!loading ? <table>
                    <thead>
                        <tr>
                            <th onClick={(e) => sort('id')} style={{ width: "5%" }}>
                                <p >No
                                    <FontAwesomeIcon size={32} icon={faSortDown} />
                                </p>
                            </th>
                            <th onClick={(e) => sort('assetCode')} style={{ width: "12%" }}>
                                <p >Asset Code
                                    <FontAwesomeIcon icon={faSortDown} />
                                </p>
                            </th>
                            <th onClick={(e) => sort('assetName')} style={{ width: "20%" }}>
                                <p >Asset Name
                                    <FontAwesomeIcon icon={faSortDown} />
                                </p>
                            </th>
                            <th onClick={(e) => sort('assignee')} style={{ width: "13%" }}>
                                <p>Assigned to <FontAwesomeIcon icon={faSortDown} />
                                </p>
                            </th>
                            <th onClick={(e) => sort('assigner')} style={{ width: "13%" }}>
                                <p>Assigned by <FontAwesomeIcon icon={faSortDown} />
                                </p>
                            </th>
                            <th onClick={(e) => sort('assignedDate')} style={{ width: "15%" }}>
                                <p >Assigned Date
                                    <FontAwesomeIcon icon={faSortDown} />
                                </p>
                            </th>
                            <th onClick={(e) => sort('state')} style={{ width: "20%" }}>
                                <p>State
                                    <FontAwesomeIcon icon={faSortDown} /></p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            displayList.map((assignment, index) => {
                                return <tr>
                                    <td onClick={(e) => { handleDetail(index) }} >
                                        <p>
                                            {assignment.id}
                                        </p>
                                    </td>
                                    <td onClick={(e) => { handleDetail(index) }}>
                                        <p>
                                            {assignment.assetCode}
                                        </p>
                                    </td>
                                    <td onClick={(e) => { handleDetail(index) }}>
                                        <p>{
                                            assignment.assetName
                                        }</p>
                                    </td>
                                    <td>
                                        <p onClick={(e) => { handleDetail(index) }}>{
                                            assignment.assignee
                                        }</p>
                                    </td>
                                    <td onClick={(e) => { handleDetail(index) }}>
                                        <p>{
                                            assignment.assigner
                                        }</p>
                                    </td>
                                    <td onClick={(e) => { handleDetail(index) }}>
                                        <p>{
                                            moment(Date.parse(assignment.assignedDate)).format("DD/MM/YYYY")
                                            // assignment.assignedDate
                                        }</p>
                                    </td>
                                    <td onClick={(e) => { handleDetail(index) }}>
                                        <p>{
                                            assignment.state.toString()[0].toUpperCase() +
                                            assignment.state.toString().replaceAll("_", " ").toLowerCase().substring(1)
                                        }</p>
                                    </td>
                                    <td style={{ width: "3%" }}>
                                        <button
                                            id="edit_btn"
                                            onClick={() => handleEdit(assignment)}
                                            className={assignment.state === 'WAITING_FOR_ACCEPTANCE' ? "btn" : "btn disable"}
                                            disabled={assignment.state !== 'WAITING_FOR_ACCEPTANCE'}>

                                            <FontAwesomeIcon
                                                icon={faPencilAlt} />

                                        </button>
                                    </td>
                                    <td style={{ width: "3%" }}>
                                        <button
                                            id="remove_btn"
                                            onClick={() => openRemoveModal(assignment)}
                                            className={assignment.state !== 'ACCEPTED' ? "btn" : "btn disable"}
                                            disabled={assignment.state === 'ACCEPTED'}>
                                            <FontAwesomeIcon
                                                icon={faTimesCircle} />
                                        </button>
                                    </td>
                                    <td style={{ width: "3%" }}>
                                        <button
                                            id="recycle_btn"
                                            onClick={() => handleCreateReturn(assignment)}
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
            {isError ? <PopupError close={(e) => { 
                setIsError(!isError);
                window.location.reload()                
            }} message={errorMessage}></PopupError> : <></>}
            {popUp ? <DetailsModal details={currDetails} show={popUp} close={() => {
                setPopUp(false);                
            }} /> : <></>}
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSortRuleChange: (rule) => {
            dispatch({ type: LOAD_NEW_ASSIGNMENT_SORT_RULE, payload: rule });
        },
    }
}

const mapStateToProps = (state) => {
    return {
        newAssignment: state.assignmentManagementReducer.currentAssignmentManagement_NewAssignment,
        sortAssignmentRule: state.assignmentManagementReducer.sortAssignmentRule,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageAssigmentTable);
