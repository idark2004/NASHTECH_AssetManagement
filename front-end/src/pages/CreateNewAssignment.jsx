import React, { useState } from 'react'
import Header from '../components/Header'
import MenuBar from '../components/Menu'
import SelectUserPopup from '../components/SelectUserPopup'
import SelectAssetPopup from '../components/SelectAssetPopup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarWeek, faSearch } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { connect } from 'react-redux'
import { useHistory } from "react-router-dom";
import moment from 'moment'
import PopupError from '../components/PopupError'
const CreateNewAssignment = (props) => {
    const emptyAssetState = {
        assetCode: '0',
        assetName: '',
    }
    const emptyUserState = {
        staffCode: '0',
    }
    const [userPopup, setUserPopup] = useState(false)
    const [assetPopup, setAssetPopup] = useState(false)
    const [assetData, setAssetData] = useState(emptyAssetState)
    const [userData, setUserData] = useState(emptyUserState)
    const [selectDate, setSelectDate] = useState(new Date());
    const [note, setNote] = useState('');
    const history = useHistory('/')
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    if (window.localStorage.getItem('jwt') === undefined || document.cookie.indexOf('id=') < 0) {
        history.push('/login')
    }
    const handleCreateAssignmentAsync = async () => {
        let dateStr = format(selectDate, 'yyyy-MM-dd');
        let apiUrl = "https://assetmanagementrookies03.azurewebsites.net/api/v1/assignment/new"
        let data = {
            assigneeId: userData.staffCode,
            assignerId: localStorage.getItem("userId"),
            assetId: assetData.assetCode,
            assignedDate: dateStr,
            note: note
        }
        console.log(data);
        axios.post(apiUrl, data, {
            headers: { Authorization: localStorage.getItem('jwt') }
        }).then((response) => {
            console.log(response);
            props.onCreateSuccess(response.data);
            if (response.status === 200 || response.status === 201) {
                history.push('/admin/assignment');
            }
        }).catch((error) => {
            console.log(error.response.data);
            let message = error.response.data.message
            setErrorMessage(message);
            setIsError(true);
        })
    }

    const handleCreateAssignment = () => {
        let isValidDate = moment(selectDate, 'DD/MM/YYYY', true).isValid()
        if (isValidDate) {
            console.log('validate');
            if (selectDate.getDay >= new Date().getDay) {
                handleCreateAssignmentAsync();
            } else {

            }
        } else {

        }
    }

    console.log(assetData.assetCode);
    console.log(assetData.assetCode !== emptyAssetState.assetCode);
    console.log(assetData.assetCode !== emptyAssetState.assetCode && userData !== null && selectDate !== null)

    return (
        <div>
            <Header />
            <div className="container">
                <div className="create-new-assignment">
                    <MenuBar />
                    <div className="create-new-assignment__content">
                        <div className="create-new-assignment__content__header">
                            <h2>Create New Assignment</h2>
                        </div>
                        <div className="create-new-assignment__content__form">
                            <div className="holdpopup">
                                <div className="create-new-assignment__content__form__row">
                                    <label className="create-new-assignment__content__form__row__label" htmlFor="user">User</label>
                                    <div className="create-new-assignment__content__form__row__input">
                                        <input readOnly={true} value={userData !== null && userData !== undefined ? userData.fullName : ""} id="user" className="input" type="text" onClick={() => {
                                            setUserPopup(true)
                                            setAssetPopup(false)
                                        }} autoComplete={false} />
                                        <FontAwesomeIcon icon={faSearch} size="lg" onClick={() => {
                                            setUserPopup(true)
                                            setAssetPopup(false)
                                        }} />
                                        {userPopup ? <SelectUserPopup currentSelectData={userData} data={(item) => {
                                            console.log(item);
                                            setUserData(item);

                                        }} isActive={userPopup} toggle={() => setUserPopup(false)} /> : null}
                                    </div>
                                </div>
                            </div>
                            <div className="holdpopup">
                                <div className="create-new-assignment__content__form__row">
                                    <label className="create-new-assignment__content__form__row__label" htmlFor="asset">Asset</label>
                                    <form className="create-new-assignment__content__form__row__input">
                                        <input readOnly={true} autoComplete="off" value={assetData !== null && assetData !== undefined ? assetData.assetName : ""} id="asset" className="input" type="text" onClick={() => {
                                            setAssetPopup(true)
                                            setUserPopup(false)
                                        }}
                                        />
                                        <FontAwesomeIcon icon={faSearch} size="lg" onClick={() => {
                                            setAssetPopup(true)
                                            setUserPopup(false)

                                        }} />
                                        {assetPopup ? <SelectAssetPopup currentSelectData={assetData} data={(item) => { console.log(item); setAssetData(item) }} isActive={assetPopup} toggle={() => setAssetPopup(false)} /> : null}
                                    </form>
                                </div>
                            </div>
                            <div className="create-new-assignment__content__form__row">
                                <label className="create-new-assignment__content__form__row__label" htmlFor="assignedDate">Assigned Date</label>
                                <div className="create-new-assignment__content__form__row__input">
                                    <DatePicker isDefaultTimeInput={true} dateFormat='dd/MM/yyyy' selected={
                                        selectDate} onChange={(date) => { setSelectDate(date) }}
                                        customInput={
                                            <input readOnly id="assignedDate" onInput={(e) => { setSelectDate(Date.parse(e.target.value)) }} value={selectDate} onInput={(e) => {
                                                let isValidDate = moment(selectDate, 'DD/MM/YYYY', true).isValid()
                                                console.log(isValidDate);
                                                if (isValidDate) {
                                                    if (selectDate.getDate > new Date().getDay) {
                                                        setSelectDate(Date.parse(e.target.value))
                                                    } else {
                                                        setSelectDate(new Date());
                                                    }
                                                } else {
                                                    setSelectDate(new Date());
                                                }
                                            }} className="input" type="text" />
                                        }
                                        minDate={new Date()}
                                        showYearDropdown={true}
                                    />
                                    <FontAwesomeIcon icon={faCalendarWeek} size="lg" />
                                </div>
                            </div>
                            <div><p></p></div>
                            <div className="create-new-assignment__content__form__row">
                                <label className="create-new-assignment__content__form__row__label" htmlFor="text">Note</label>
                                <form className="create-new-assignment__content__form__row__text">
                                    <textarea maxlength="400" id="text" type="text" onChange={e => setNote(e.target.value)} />
                                </form>
                            </div>
                            <div className="create-new-assignment__content__form__button">
                                <button
                                    onClick={() => { handleCreateAssignment() }}
                                    disabled={assetData.assetCode !== emptyAssetState.assetCode && userData.staffCode !== emptyUserState.staffCode && selectDate !== null ? false : true}
                                    id={assetData.assetCode !== emptyAssetState.assetCode && userData.staffCode !== emptyUserState.staffCode && selectDate !== null ? "save" : "save_disable"}
                                    autoFocus={assetData.assetCode !== emptyAssetState.assetCode && userData !== emptyUserState.staffCode && selectDate !== null ? true : false}
                                >Save</button>
                                <button id="cancel" onClick={() => history.push("/admin/assignment")}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isError ? <PopupError close={(e) => { setIsError(!isError) }} message={errorMessage}></PopupError> : <></>}
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        onCreateSuccess: (newAssignment) => {
            console.log(newAssignment);
            dispatch({
                type: 'LOAD_NEW_CREATE_ASSIGNMENT',
                payload: newAssignment
            })
        }
    }
}
export default connect(null, mapDispatchToProps)(CreateNewAssignment);
