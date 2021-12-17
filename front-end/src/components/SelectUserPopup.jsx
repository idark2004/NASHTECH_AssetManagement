import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSortDown, faBackward, faForward } from '@fortawesome/free-solid-svg-icons'
import ReactPaginate from 'react-paginate';
import axios from 'axios'
const SelectUserPopup = props => {

    const [userData, setuserData] = useState([])
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [sortBy, setSortBy] = useState('id')
    const [keyword, setKeyword] = useState('')
    const [loadings, setLoadings] = useState('')
    const [checked, setChecked] = useState(false);
    const [selectedAssignee, setSelectedAssignee] = useState(null);

    const filterAndSortCallBack = async (sortBy, roles, keyword, page) => {
        let url = "https://assetmanagementrookies03.azurewebsites.net/api/v1/user/popup"
        setLoadings(true);
        let pageNum = page - 1;
        let promise = axios.get(url, {
            headers: {
                Authorization: localStorage.getItem('jwt')
            },
            params: {
                keyword: keyword.toLowerCase(),
                sortBy: sortBy,
                pageNum: pageNum,
                locationId: localStorage.getItem('locationId')
            }
        })
        let responseObj = (await promise).data;
        let responseUserList = responseObj.data;
        if (sortBy === 'firstName') {
            let sortData = responseUserList.sort((a, b) => {
                if (a.firstName.trim() + a.lastName.trim() > b.firstName.trim() + b.lastName.trim()) {
                    return 1;
                } else if (a.firstName.trim() + a.firstName.trim() < b.firstName.trim() + b.lastName.trim()) {
                    return -1;
                } else {
                    return 0;
                }
            })
            setuserData(sortData);
            setSelectedAssignee({
                staffCode: sortData[0].id,
                fullName: sortData[0].firstName + " " + sortData[0].lastName,
                type: sortData[0].role
            });
            setTotalPage(responseObj.totalPage);
            setLoadings(false);
            return;
        }
        console.log(responseObj);
        setuserData(responseObj.data)
        setTotalPage(responseObj.totalPage);
        setLoadings(false);
    }

    useEffect(() => {
        filterAndSortCallBack("id", "ALL", "", 1);
    }, [])

    let convertData = [];
    const userHeader = ["Staff Code", "Full Name", "Type"]

    userData.map((item) => convertData.push({
        staffCode: item.id,
        fullName: item.firstName + " " + item.lastName,
        type: item.role
    }))


    const handlerPrevious = () => {
        setLoadings(true);
        setPageIndex(pageIndex > 1 ? pageIndex - 1 : 1);
        filterAndSortCallBack(sortBy, 'ALL', keyword, pageIndex);
    }

    const handlerNext = () => {
        setLoadings(true);
        setPageIndex(pageIndex < totalPage ? pageIndex + 1 : pageIndex);
        filterAndSortCallBack(sortBy, 'ALL', keyword, pageIndex);
    }

    const sort = (rule) => {
        setLoadings(true);
        filterAndSortCallBack(rule, 'ALL', keyword, pageIndex);
        setSortBy(rule);
    }

    const searchUser = () => {
        setLoadings(true);
        filterAndSortCallBack(sortBy, 'ALL', keyword, 1);
        setPageIndex(1);
    }

    const getItem = (index) => {
        const selectedItem = convertData.find(item => item.staffCode === index)
        props.data(selectedItem);
    }

    return (
        <div className={`select-popup ${props.isActive ? 'active' : ''}`}>
            <div className="select-popup__header">
                <h2>Select User</h2>
                <div className="select-popup__header__searchbox">
                    <form className="select-popup__header__searchbox" autoComplete="off" onSubmit={e => e.preventDefault()}>
                        <input onChange={e => setKeyword(e.target.value)} value={keyword} maxlength="70" autoComplete={false} className="input" type="text" />
                        <div onClick={(e) => {
                            e.preventDefault();
                            searchUser()
                        }} className="iconSearch"><FontAwesomeIcon icon={faSearch} size="lg" /></div>
                    </form>
                </div>
            </div>
            <div className="select-popup__content">
                <div className="table-wrapper">
                    {loadings ? <h2>Loading</h2> :
                        <table className="select-popup__content__table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th onClick={() => { sort('id') }}><p>Staff Code <FontAwesomeIcon icon={faSortDown} /></p></th>
                                    <th onClick={() => { sort('firstName') }}><p>Full Name <FontAwesomeIcon icon={faSortDown} /></p></th>
                                    <th onClick={() => { sort('roles') }}><p>Type <FontAwesomeIcon icon={faSortDown} /></p></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    convertData.map((item, index) => (
                                        <tr key={index}>
                                            <td><input type="radio" onClick={() => { setSelectedAssignee(item); setChecked(true) }} name="staff" /></td>
                                            <td><p>{item.staffCode}</p></td>
                                            <td><p>{item.fullName}</p></td>
                                            <td className="type"><p>{item.type.toLowerCase()}</p></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    }
                </div>
                <div style={{ marginTop: '2rem', marginLeft: '2rem' }}>
                    <ReactPaginate
                        onPageChange={(event) => {
                            console.log(event.selected);
                            setPageIndex(event.selected + 1);
                            filterAndSortCallBack(sortBy, 'ALL', keyword, event.selected + 1)
                        }}
                        nextLabel={
                            <button className={pageIndex + 1 > totalPage ? "btn btn_next disable" : "btn btn_next"}
                                disabled={pageIndex + 1 > totalPage ? true : false}
                                onClick={() => handlerNext()}><p>Next</p></button>}
                        previousLabel={
                            <button className={pageIndex > 1 ? "btn btn_previous" : "btn btn_previous disable"}
                                disabled={pageIndex > 1 ? false : true}
                                onClick={() => handlerPrevious()}><p>Previous</p></button>}
                        pageRangeDisplayed={5}
                        pageCount={totalPage}
                        initialPage={0}
                        activePage={pageIndex - 1}
                        pageClassName="page_number"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                        className="pagination-list"
                        disabledClassName="disable"
                        hideNavigation={true}
                    />
                </div>
                <div className="select-popup__content__button">
                    <button id={!checked ? "save_disable" : "save"} disabled={!checked ? true : false}
                        onClick={(e) => {
                            console.log(selectedAssignee)
                            props.data(selectedAssignee);
                            props.toggle();
                        }}>Save</button>
                    <button id="cancel" onClick={(e) => {
                        props.toggle();
                    }
                    }>Cancel</button>
                </div>
            </div>
        </div >
    )
}

SelectUserPopup.propTypes = {
    isActive: PropTypes.bool,
    toggle: PropTypes.func,
    data: PropTypes.func
}

export default SelectUserPopup
