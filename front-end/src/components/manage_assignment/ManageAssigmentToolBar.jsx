import React, { useState, useEffect } from 'react'
import '../../css/ManageAssigment.css'
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSearch, faCalendarWeek } from '@fortawesome/free-solid-svg-icons'
import ManageAssigmentTable from './ManageAssigmentTable'
import { LOAD_NEW_ASSIGNMENT_STATE_FILTER, LOAD_NEW_ASSIGNMENT_DATE_FILTER } from '../../actions/actionConstantv2'
import { connect } from 'react-redux'
import { searchAndFilterAssignment } from '../../apis/assignmentApi'
import { useHistory } from 'react-router';
import { format } from 'date-fns';
function ManageAssigmentToolBar(props) {
    const [totalPages, setTotalPages] = useState(1);
    const [active, setActive] = useState(1);
    const [displayList, setDisplayList] = useState([]);
    const [filterStates, setFilterStates] = useState(props.filterStates);
    const [filterDate, setFilterDate] = useState(props.filterDate);
    const [sortBy, setSortBy] = useState(props.sortAssignmentRule);
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    console.log(props.filterDate);
    const history = useHistory('/')

    useEffect(() => {
        init();
    }, [])


    useEffect(() => {
    }, filterDate)

    useEffect(() => {
        setFilterDate(props.filterDate);
        setFilterStates(props.filterStates);
        setSortBy(props.sortAssignmentRule);
        setLoading(false);
    }, [props.filterStates, props.filterDate, props.sortAssignmentRule])

    const init = async () => {
        console.log('init');
        console.log(filterDate);
        let filterStateStr = ""
        if (filterStates.includes('ALL') || filterStates.length === 0) {
            filterStateStr = 'ALL';
            console.log('filter all');
        } else {
            filterStateStr = props.filterStates.toLocaleString();
            console.log("filter change")
        }
        console.log(filterStateStr);
        console.log('51: ', keyword);
        let responseObj = (await searchAndFilterAssignment(keyword.toLowerCase(), filterStateStr, filterDate, active, sortBy)).data;
        setDisplayList(responseObj.data);
        setTotalPages(responseObj.totalPages);
        setActive(responseObj.currentPage);
        setLoading(false);
        console.log(responseObj.data);
    }

    const searchAndFilter = async (filterState, filterDate, keyword, pageNum, sortBy) => {
        console.log('filter');
        console.log(filterState)
        setFilterDate(filterDate);
        setLoading(true);
        let filterStateStr = ""
        if (filterState.length > 0) {
            if (filterState.includes('ALL')) {
                filterStateStr = 'ALL';
                console.log('filter all');
            } else {
                filterStateStr = filterState.toLocaleString();
                console.log("filter change")
            }
            console.log(filterStateStr);
            console.log(keyword.toLowerCase());
            let responseObj = (await searchAndFilterAssignment(keyword.toLowerCase(), filterStateStr, filterDate, pageNum, sortBy)).data;
            console.log(responseObj.data);
            setDisplayList(responseObj.data);
            setTotalPages(responseObj.totalPages);
            setActive(responseObj.currentPage);
            console.log(responseObj.data);
        } else {
            setDisplayList([]);
        }
        setLoading(false);
    }

    const handlerPrevious = () => {
        setActive(active - 1);
        pageHandler(active - 1)
    }
    const handlerNext = () => {
        setActive(active + 1);
        pageHandler(active + 1)
    }

    const onClickSearchBtn = () => {
        console.log(keyword);
        init();
    }

    const hanldeChangeDate = (date) => {
        console.log(date);
        let filterStateStr;
        if (filterStates.includes('ALL')) {
            filterStateStr = 'ALL';

        } else {
            filterStateStr = filterStates.toLocaleString();
        }
        let dateStr = '';
        if (date !== undefined && date !== null) {
            dateStr = format(date, 'yyyy-MM-dd')
            props.onFilterDateChange(dateStr);
            searchAndFilter(filterStateStr, dateStr, keyword.toLowerCase(), active, sortBy);
        } else {
            console.log("null date")
            props.onFilterDateChange(null);
            searchAndFilter(filterStateStr, null, keyword.toLowerCase(), active, sortBy);
        }
    }

    const handleChecked = (e) => {
        setLoading(true);
        let checked = e.target.checked;
        let value = e.target.value;
        const allFilterStr = 'ACCEPTED,DECLINED,WAITING_FOR_ACCEPTANCE';
        const allArr = ['ALL'];
        if (checked) {
            if (value === 'ALL') {
                searchAndFilter(allArr, filterDate, keyword.toLowerCase(), 1, sortBy);
                props.onFilterStateChange(["ALL"]);
            } else {
                let currFilterList = props.filterStates;
                currFilterList = currFilterList.filter((state) => state !== 'ALL');
                let newFitlerList = [...currFilterList, value];
                searchAndFilter(newFitlerList, filterDate, keyword.toLowerCase(), 1, sortBy);
                props.onFilterStateChange(newFitlerList);
            }
        } else {
            let currFilterList = filterStates;
            currFilterList = currFilterList.filter((state) => state !== value);
            if (currFilterList.length > 0) {
                searchAndFilter(currFilterList, filterDate, keyword.toLowerCase(), 1, sortBy);
                props.onFilterStateChange(currFilterList);
                setActive(1);
            } else {
                searchAndFilter(currFilterList, filterDate, keyword.toLowerCase(), 1, sortBy);
                props.onFilterStateChange(currFilterList);
                setActive(1);
            }
        }
    }


    const pageHandler = (num) => {
        let filterStateString;
        if (filterStates.includes('ALL')) {
            filterStateString = ["ALL"].toLocaleString();
            props.onFilterStateChange(["ALL"]);
        } else {
            filterStateString = filterStates.toLocaleString();
        }
        console.log(filterStateString);
        setActive(num);
        searchAndFilter(filterStates, filterDate, keyword.toLowerCase(), num, sortBy);
    }

    return (
        <React.Fragment>
            <div className="assignment-toolbar__container">
                <div className="assignment-toolbar__container__left">
                    <div className="assignment-toolbar__container__left__dropdown">
                        <div className="assignment-toolbar__container__left__dropdown__select">
                            <div className="assignment-toolbar__container__left__dropdown__selected">State</div>
                            <div className="dropdown_header_icon">
                                <FontAwesomeIcon icon={faFilter} />
                            </div>
                        </div>
                        <ul className="assignment-toolbar__container__left__dropdown__list">
                            <li className="assignment-toolbar__container__left__dropdown__list__item">
                                <label className="assignment-toolbar__container__left__dropdown__list__item__name">All
                                    <input checked={props.filterStates.includes('ALL')} onClick={(e) => { handleChecked(e) }} type="checkbox" className="category-input" value="ALL" />
                                    <span className="checkmark"></span>
                                </label>
                            </li>
                            <li className="assignment-toolbar__container__left__dropdown__list__item">
                                <label className="assignment-toolbar__container__left__dropdown__list__item__name">Accepted
                                    <input checked={props.filterStates.includes('ACCEPTED')}
                                        onClick={(e) => { handleChecked(e) }}
                                        type="checkbox" className="category-input" value="ACCEPTED" />
                                    <span className="checkmark"></span>
                                </label>
                            </li>
                            <li className="assignment-toolbar__container__left__dropdown__list__item">
                                <label className="assignment-toolbar__container__left__dropdown__list__item__name">Declined
                                    <input
                                        checked={props.filterStates.includes('DECLINED')}
                                        onClick={(e) => { handleChecked(e) }}
                                        type="checkbox" className="category-input" value="DECLINED" />
                                    <span className="checkmark"></span>
                                </label>
                            </li>
                            <li className="assignment-toolbar__container__left__dropdown__list__item">
                                <label className="assignment-toolbar__container__left__dropdown__list__item__name">Waiting For Acceptance
                                    <input
                                        checked={props.filterStates.includes('WAITING_FOR_ACCEPTANCE')}
                                        onClick={(e) => { handleChecked(e) }}
                                        type="checkbox" className="category-input" value="WAITING_FOR_ACCEPTANCE" />
                                    <span className="checkmark"></span>
                                </label>
                            </li>
                        </ul>
                    </div>
                    <DatePicker isDefaultTimeInput={true} wrapperClassName="assignment-date-section" dateFormat='dd/MM/yyyy' selected={
                        Date.parse(filterDate)} onChange={hanldeChangeDate}
                        isClearable={true}
                        onKeyDown={(e) => {
                            e.preventDefault();
                        }}
                        customInput={
                            <Button value={filterDate} />
                        }
                        disableAutoFocus={true}
                        showYearDropdown={true}
                    />
                    <div className="iconCalendar">
                        <FontAwesomeIcon icon={faCalendarWeek} size="lg" />
                    </div>
                </div>
                <div className="assignment-toolbar__container__right">
                    <div className="search_box_container">
                        <form>
                            <input onChange={(e) => { setKeyword(e.target.value) }} maxlength="100"
                                name="keyword" id="search-input" placeholder="Search"
                                value={keyword}
                            />
                        </form>
                        <button className="btn btn-search" onClick={(e) => { onClickSearchBtn(); }}>
                            <FontAwesomeIcon icon={faSearch} size={'1x'} />
                        </button>
                    </div>
                    <div className="assignment-toolbar__container__right__create">
                        <button onClick={(e) => { history.push('/admin/new/assignment') }}>
                            Create new assignment
                        </button>
                    </div>
                </div>
            </div>
            {loading ? <h2>Loading...</h2> :
                <ManageAssigmentTable displayList={displayList} filterState={filterStates} filterDate={filterDate} keyword={keyword} page={active} />
            }
            <div className="pagination">
                <div className="pagination-wrapper">
                    {
                        active > 1 ? <button className="btn btn_previous" onClick={() => handlerPrevious()}><p>Previous</p></button>
                            : <button className="btn btn_previous disable" disabled={true} onClick={() => handlerPrevious()}><p>Previous</p></button>
                    }
                    <ol className="pagination-list">
                        {
                            Array.from(Array(totalPages).keys()).map((item, index) => {
                                index += 1;
                                return (
                                    <li onClick={(e) => { pageHandler(index) }}>
                                        <span>
                                            <div className={`page_number ${active === index ? 'active' : ''}`} id="span-3">
                                                <p>{index}</p>
                                            </div>
                                        </span>
                                    </li>
                                )
                            })
                        }
                    </ol>
                    {
                        active + 1 > totalPages ? <button className="btn btn_next disable" disabled={true} onClick={() => handlerNext()}><p>Next</p></button> :
                            <button className="btn btn_next" onClick={() => handlerNext()}><p>Next</p></button>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}


const Button = ({ onChange, placeholder, value, isSecure, id, onClick }) => (
    <button className="date-button"
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        isSecure={isSecure}
        id={id}
        onClick={onClick}
    >{value}</button>
);

const mapStateToProps = (state) => {
    return {
        filterStates: state.assignmentManagementReducer.currentAssignmentManagement_StateFiler,
        filterDate: state.assignmentManagementReducer.currentAssignmentManagement_AssigneDateFilter,
        sortAssignmentRule: state.assignmentManagementReducer.currentAssignmentManagement_SortRule
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onFilterStateChange: (filterStates) => {
            dispatch({ type: LOAD_NEW_ASSIGNMENT_STATE_FILTER, payload: filterStates })
        },
        onFilterDateChange: (filterDate) => {
            console.log(filterDate);
            dispatch({ type: LOAD_NEW_ASSIGNMENT_DATE_FILTER, payload: filterDate })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageAssigmentToolBar);
