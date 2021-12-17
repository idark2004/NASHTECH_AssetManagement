import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ManageUserTable from '../ManageUserTable'
import { useState, useEffect } from 'react'
import { sortAndFilterUser } from './util/manage_user_util'
import { useHistory } from 'react-router'
import { connect } from 'react-redux'
import { LOAD_NEW_FILTER_RULE } from '../../actions/actionConstantv2'
function ManageUserToolbar_Table(props) {
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [filterUserList, setFilterUserList] = useState([]); // the table will use this list
    const [typeList, setTypeList] = useState(props.filterRule); // This list of type will be used for filtered
    const [active, setActive] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const history = useHistory('/');
    const [currentSortRule, setCurrentSortRule] = useState(props.sortRule);
    const [filterAll, setFilterAll] = useState(true);
    const hanleOnClickSearchButton = (num) => {
        let userList = [];
        console.log('search keyword ' + keyword)
        filterAndSortCallBack(currentSortRule.toLocaleString(), props.filterRule.toLocaleString(), keyword, num);
        setLoading(true);
    }
    useEffect(() => {
        let searchStr = keyword.toLowerCase();
        filterAndSortCallBack(currentSortRule, typeList.toLocaleString(), searchStr, active);
    }, [])


    useEffect(() => {
        setTypeList(props.filterRule);
    }, [props.filterRule])


    useEffect(() => {
        console.log(props.sortRule);
        filterAndSortCallBack(props.sortRule, typeList.toLocaleString(), keyword, active);
        setCurrentSortRule(props.sortRule);
    }, [props.sortRule])

    const changeTypeFilter = (e) => {
        let checked = e.target.checked;
        let value = e.target.value;
        let newFilter;
        if (checked) {
            console.log(checked);
            if (value === 'ALL') {
                props.onChangeFilter(['ALL']);
                filterAndSortCallBack(currentSortRule, typeList.toLocaleString(), keyword, active);
            } else {
                newFilter = [...typeList.filter(type => type !== 'ALL'), value.toLocaleString()];
                filterAndSortCallBack(currentSortRule, newFilter.toLocaleString(), keyword, active);
                props.onChangeFilter(newFilter);
            }
        } else {
            newFilter = typeList.filter(type => type !== value);
            if (newFilter.length === 0) {
                props.onChangeFilter([]);
                setFilterUserList([]);
            }
            else {
                filterAndSortCallBack(currentSortRule, newFilter.toLocaleString(), keyword, active);
                props.onChangeFilter(newFilter);
            }
        }
    }


    const filterAndSortCallBack = async (sortBy, roles, keyword, page) => {
        let promise = sortAndFilterUser(sortBy, roles, keyword, page);
        let responseObj = (await promise).data;
        setFilterUserList(responseObj.data);
        setTotalPages(responseObj.totalPage);
        setLoading(false);
    }
    const pageHandler = (num) => {
        console.log('Toolbar page: ' + num);
        setLoading(true);
        filterAndSortCallBack(currentSortRule, typeList.toLocaleString(), keyword, num);
        setActive(num);
    }

    const handlerPrevious = () => {
        pageHandler(active > 1 ? active - 1 : active)
        setActive(active > 1 ? active - 1 : active)
    }
    const handlerNext = () => {
        pageHandler(active > totalPages - 1 ? active : active + 1);
        setActive(active > totalPages ? active : active + 1);
    }
    return (
        <div className="user-list-toolbar-wrapper">
            <div className="user-list-toolbar">
                <div className="filter_component filter-section">
                    <div id="role-filter-section">
                        <div className="dropdown-toggle">
                            <div className="dropdown-header">
                                <div className="dropdown-title">Type</div>
                                <div className="dropdown-icon">
                                    <FontAwesomeIcon icon={faFilter} />
                                </div>
                            </div>
                            <div className="dropdown-content">
                                <ul>
                                    <li><input checked={props.filterRule.includes('ALL') && filterAll} onChange={(e) => { changeTypeFilter(e) }} value="ALL" type="checkbox" name="role" id="role" /><span> All</span></li>
                                    <li><input checked={props.filterRule.includes('ADMIN')} onChange={(e) => { changeTypeFilter(e) }} value="ADMIN" type="checkbox" name="role" id="role" /><span> Admin</span></li>
                                    <li><input checked={props.filterRule.includes('STAFF')} onChange={(e) => { changeTypeFilter(e) }} value="STAFF" type="checkbox" name="role" id="role" /><span> Staff</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="search-bar_create-btn_component search_bar-create_btn-wrapper">
                    <div id="search-section">

                        <input maxLength="70" onChange={(e) => { e.preventDefault(); setKeyword(e.target.value) }} name="keyword" id="search-query" placeholder="Search" />
                        <button onClick={(e) => hanleOnClickSearchButton(1)}><FontAwesomeIcon icon={faSearch} /></button>
                    </div>
                    <div id="create-btn-section">
                        <button className="btn" onClick={() => {
                            history.push("/admin/user/new");
                            window.location.reload();
                        }}>
                            <p className="btn_create_text"> Create new user</p>
                        </button>
                    </div>
                </div>
            </div>
            {!loading ?
                <ManageUserTable page={active} newUser={props.newUser} keyword={keyword}
                    filterRule={typeList} displayList={filterUserList} sortRule={props.sortRule} /> : <h2>Loading</h2>}
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
        </div>
    )
}

const mapStateToPropsVerTwo = (state) => {
    console.log(state);
    return {
        sortRule: state.userManagementReducer.currentManageUser_SortRule,
        filterRule: state.userManagementReducer.currentManageUser_FilterRoles,
        newUser: state.userManagementReducer.newUser
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onChangeFilter: (filterList) => {
            console.log(filterList);
            dispatch({ type: LOAD_NEW_FILTER_RULE, payload: filterList });
        }
    }
}

export default connect(mapStateToPropsVerTwo, mapDispatchToProps)(ManageUserToolbar_Table);
