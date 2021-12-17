import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faSortDown, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import Modal from './manange_user/Modal';
import DisableUserModal from './manange_user/DisableUserModal';
import ConfirmDisableUser from './manange_user/ConfirmDisableUser';
import { LOAD_NEW_SORT_RULE, LOAD_DISABLE_CODE } from '../actions/actionConstantv2'
import { connect } from 'react-redux'
import { checkAssignment } from '../apis/fetchApi'
import { Link } from "react-router-dom"

function ManageUserTable(props) {
    const [displayList, setDisplayList] = useState(props.displayList);
    const [userDetails, setUserDetails] = useState({ id: 'id', firstName: 'firstName', lastName: 'lastName', dateOfBirth: '22/12/2200', joinDate: '12/22/2200', role: 'ADMIN' });
    const [popUp, setPopUp] = useState(false);
    const [sortBy, setSortBy] = useState(props.sortRule);
    const [keyword, setKeyword] = useState(props.keyword);
    const [displayPage, setDisplayPage] = useState(props.page);
    const [loading, setLoading] = useState(false);
    const [sortToggle, setSortToggle] = useState(true);
    const [disableStaffCode, setDisableStaffCode] = useState('');
    const [cannotDisableUserModal, setCannotDisableUserModal] = useState(false)
    const [confirmDisableUserModal, setConfirmDisableUserModal] = useState(false)

    const history = useHistory('/');
    function formatDate(joinedDate) {
        let date = new Date(joinedDate);
        return date.toLocaleDateString("vi-Vi");
    }
    useEffect(() => {
        if (props.newuser !== undefined && props.newuser !== null) {
            setDisplayList([props.newuser, ...displayList]);
        }
    }, [props.newuser])

    useEffect(() => {
        if (props.newuser !== undefined && props.newuser !== null) {
            setDisplayList([props.newuser, ...props.displayList]);
        } else {
            setDisplayList(props.displayList);
        }
    }, [props.displayList])


    const handleUserDetail = (user) => {
        setUserDetails(user);
        setPopUp(true);
    }


    const sort = (rule) => {
        props.onSortRuleChange(rule);
    }

    const handleCheckAssignment = async (staffCode) => {
        console.log(staffCode);
        const response = checkAssignment(staffCode);
        const checked = (await response).data
        if (checked === true) {
            setConfirmDisableUserModal(true)
            setDisableStaffCode(staffCode);
        } else {
            setCannotDisableUserModal(true)
        }
    }

    return (
        <div className="results-section">
            <div className="user_table">
                <table>
                    <thead>
                        <tr>
                            <th className="col" onClick={() => { sort('id') }}>
                                <p className="col staff_code_col">Staff Code <FontAwesomeIcon size={32} icon={faSortDown}></FontAwesomeIcon></p>
                            </th>
                            <th className="col" onClick={() => { sort('firstName') }}>
                                <p className=" col full_name_col">Full Name <FontAwesomeIcon icon={faSortDown} ></FontAwesomeIcon></p>
                            </th>
                            <th className="col">
                                <p className="col username_col">Username</p>
                            </th>
                            <th className="col" onClick={() => { sort('joinDate') }}>
                                <p className="col joined_day_col">Joined Date <FontAwesomeIcon icon={faSortDown}></FontAwesomeIcon></p>
                            </th>
                            <th className="col" onClick={() => { sort('type') }}>
                                <p className="col type_col">Type <FontAwesomeIcon icon={faSortDown}></FontAwesomeIcon></p>
                            </th>
                        </tr>
                    </thead>
                    {!loading ?
                        <tbody>
                            {
                                displayList.map((item, index) => {
                                    return <tr key={index}>
                                        <td onClick={(e) => { handleUserDetail(item) }} className="col staff_code_col">
                                            <p className="col staff_code_col">{item.id}</p>
                                        </td>
                                        <td onClick={(e) => { handleUserDetail(item) }} className="col full_name_col">
                                            <p className="col full_name_col">{item.firstName + " " + item.lastName}</p>
                                        </td>
                                        <td onClick={(e) => { handleUserDetail(item) }} className="col username_col">
                                            <p className="col username_col">{item.username}</p>
                                        </td>
                                        <td onClick={(e) => { handleUserDetail(item) }} className="col joined_day_col">
                                            <p className="col joined_day_col">{formatDate(item.joinDate)}</p>
                                        </td>
                                        <td onClick={(e) => { handleUserDetail(item) }} className="col type_col">
                                            <p className="col type_col">{item.role.toLowerCase()}</p>
                                        </td>
                                        <td className="btn_col">
                                            <i className="fas fa-pencil-alt"></i>
                                            <Link to={{
                                                pathname: '/admin/user/edit',
                                                state: { user: item }
                                            }}>
                                                <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon>
                                            </Link>
                                        </td>
                                        <td className="btn_col" onClick={(e) => handleCheckAssignment(item.id)} >
                                            <FontAwesomeIcon icon={faTimesCircle} style={{ color: '#E48D98' }}></FontAwesomeIcon>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                        : <h2>Loading</h2>
                    }
                </table>
            </div>
            {
                popUp ? <Modal close={() => setPopUp(false)} details={userDetails} show={popUp} counter={1} /> : <></>
            }
            <DisableUserModal isActive={cannotDisableUserModal} close={() => setCannotDisableUserModal(false)} />
            <ConfirmDisableUser disableStaffCode={disableStaffCode} isActive={confirmDisableUserModal} close={() => setConfirmDisableUserModal(false)} />
        </div >
    )
}


const mapDispatchToProps = (dispatch) => {
    return {
        onSortRuleChange: (rule) => {
            dispatch({ type: LOAD_NEW_SORT_RULE, payload: rule })
        },
        onLoadNewDisableStaffCode: (code) => {
            dispatch({ type: LOAD_DISABLE_CODE, payload: code });
        }
    }
}

const mapStateToProps = (state) => {
    return { newuser: state.userManagementReducer.newUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUserTable)