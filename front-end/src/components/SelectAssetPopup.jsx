import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { searchAndFilterAsset } from '../apis/assetApi'
import ReactPaginate from 'react-paginate';
const SelectAssetPopup = props => {
    const [assetList, setAssetList] = useState([])
    const [displayList, setDisplayList] = useState([])
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [sortBy, setSortBy] = useState('id')
    const [keyword, setKeyword] = useState('')
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);

    const getAssetListApi = () => {
        let url = 'https://assetmanagementrookies03.azurewebsites.net/api/v1/asset/available'
        let pathVar = window.localStorage.getItem('locationId');
        const promise = axios.get(url, {
            headers: { Authorization: localStorage.getItem('jwt') },
            params: {
                location: localStorage.getItem('locationId')
            }
        })
        return promise
    }

    const searchAndFilterAssetAsync = async (keyword, pageNum, sortBy) => {
        setLoading(true);
        let promise = searchAndFilterAsset(keyword, 'ALL', 'AVAILABLE', sortBy, pageNum);
        let reponse = (await promise).data;
        setDisplayList(reponse.data);
        setTotalPage(reponse.totalPages);
        setSelectedAsset(reponse.data[0]);
        console.log(reponse.totalPage);
        setLoading(false);
    }

    const handlerPrevious = () => {
        setPageIndex(pageIndex > 1 ? pageIndex - 1 : 1);
        searchAndFilterAssetAsync(keyword, pageIndex > 1 ? pageIndex - 1 : 1, sortBy);
    }

    const handlerNext = () => {
        setLoading(true);
        setPageIndex(pageIndex < totalPage ? pageIndex + 1 : pageIndex);
        searchAndFilterAssetAsync(keyword, pageIndex < totalPage ? pageIndex + 1 : totalPage, sortBy);
    }

    useEffect(() => {
        searchAndFilterAssetAsync(keyword, pageIndex, sortBy);
    }, [])

    const compareValues = (key, order = 'asc') => (a, b) => {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
        let comparison = a[key].localeCompare(b[key]);

        return (
            (order === 'desc') ? (comparison * - 1) : comparison
        )
    }

    const sort = (key) => {
        setSortBy(key);
        searchAndFilterAssetAsync(keyword, pageIndex, key);
    }

    const search = () => {
        console.log('searching');
        searchAndFilterAssetAsync(keyword, 1, sortBy);
        setPageIndex(1);
    }

    const getItem = (item) => {
        console.log(item);
        props.data(item)
    }

    return (
        <div className={`select-popup ${props.isActive ? 'active' : ''}`}>
            <div className="select-popup__header">
                <h2>Select Asset</h2>
                <div className="select-popup__header__searchbox" autoComplete={false}>
                    <form autoComplete="off" className="select-popup__header__searchbox" onSubmit={e => e.preventDefault()}>
                        <input maxlength="100" className="input" type="text" onChange={(e) => setKeyword(e.target.value)} />
                        <div onClick={() => {
                            console.log('onClick');
                            search()
                        }} className="iconSearch"><FontAwesomeIcon icon={faSearch} size="lg" /></div>
                    </form>
                </div>
            </div>
            <div className="select-popup__content">
                <div className="table-wrapper">
                    {loading ? <h2>Loading...</h2> :
                        <table className="select-popup__content__table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th onClick={() => sort("assetCode")}><p>Asset Code <FontAwesomeIcon icon={faSortDown} /></p></th>
                                    <th onClick={() => sort("name")}><p>Asset Name <FontAwesomeIcon icon={faSortDown} /></p></th>
                                    <th onClick={() => sort("category")}><p>Category <FontAwesomeIcon icon={faSortDown} /></p></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    displayList.map((item, index) => (
                                        <tr key={index}>
                                            <td><input type="radio"
                                                onClick={(e) => {
                                                    console.log(item);
                                                    setSelectedAsset(item);
                                                    setChecked(true);
                                                }} name="staff" /></td>
                                            <td><p>{item.assetCode}</p></td>
                                            <td><p>{item.assetName}</p></td>
                                            <td><p>{item.categoryName}</p></td>
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
                            searchAndFilterAssetAsync(keyword, event.selected + 1, sortBy);
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
                    <button id={!checked ? "save_disable" : "save"} disabled={!checked ? true : false} onClick={(e) => {
                        props.toggle();
                        getItem(selectedAsset);
                    }}>Save</button>
                    <button id="cancel" onClick={props.toggle}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

SelectAssetPopup.propTypes = {

    isActive: PropTypes.bool,
    toggle: PropTypes.func,
    data: PropTypes.func,
    selectedAsset: PropTypes.object
}

export default SelectAssetPopup
