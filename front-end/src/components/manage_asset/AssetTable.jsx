import React, { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'

import { getAssetList } from '../../apis/fetchApi'
import DetailsAssetModal from './DetailsAssetModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import AssetRemoveModal from './AssetRemoveModal'
import { connect } from 'react-redux';
import { LOAD_NEW_ASSET_SORT_RULE, LOAD_NEW_ASSET_PAGE_NUMBER, LOAD_NEW_ASSET_DISPLAY_LIST } from '../../actions/actionConstantv2';
import { searchAndFilterAsset, getCategory } from '../../apis/assetApi'
import { sortAsset } from '../manage_asset/asset_util'
const AssetTable = (props) => {
    const [categoryFilter, setCategoryFilter] = useState(props.assetFilterCategoryRule);
    const [stateFilter, setStateFilter] = useState(props.assetFilterStateRule);
    const [removeAsset, setRemoveAsset] = useState(false);
    const [assetRemove, setAssetRemove] = useState();
    const [sortRule, setSortRule] = useState(props.sortAssetRule);
    const [active, setActive] = useState(props.assetPage);
    const [keyword, setKeyword] = useState(props.assetKeyword);
    const [totalPages, setTotalPages] = useState(props.totalPage);
    const [loading, setLoading] = useState(false);
    const [displayList, setDisplayList] = useState(props.displayList);
    const [isActiveModal, setIsActiveModal] = useState(false)
    const [currentItem, setCurrentItem] = useState({});
    console.log(loading);
    const getAssets = async () => {
        let promise = getAssetList();
        let finalResult = [];
        const data = (await promise).data;
        if (props.newAsset !== null && props.newAsset !== undefined) {
            finalResult = [props.newAsset, ...data.data];
        } else {
            finalResult = data.data;
        }
        console.log('sort result: ', finalResult);
        setDisplayList(finalResult);
        console.log("----", finalResult);

        setDisplayList(finalResult)
        setTotalPages(data.totalPages);
    }

    useEffect(() => {
        let finalResult
        if (props.newAsset !== undefined && props.newAsset !== null) {
            finalResult = [props.newAsset, ...props.displayList];
        } else {
            finalResult = props.displayList;
        }
        setDisplayList(finalResult);
        setTotalPages(props.totalPage);
        setKeyword(props.assetKeyword);
    }, [props.displayList, props.totalPage, props.assetKeyword])

    useEffect(() => {
        setSortRule(props.sortAssetRule);
    }, [props.sortAssetRule]);

    useEffect(() => {
        let finalResult
        if (props.newAsset !== undefined && props.newAsset !== null) {
            finalResult = [props.newAsset, ...props.displayList];
        } else {
            finalResult = props.displayList;
        }
        setDisplayList(finalResult);
        console.log(props.assetFilterCategoryRule)
        setCategoryFilter(props.assetFilterCategoryRule);
        setStateFilter(props.assetFilterStateRule);
    }, [props.assetFilterCategoryRule, props.assetFilterStateRule])

    useEffect(() => {
        console.log(displayList)
        getAssets()
    }, [])

    const handlerPrevious = () => {
        pageHandler(active > 1 ? active - 1 : 1);
    }

    const handlerNext = () => {
        pageHandler(active + 1);
    }

    const detailsModal = (index) => {
        setIsActiveModal(true)
        setCurrentItem(displayList.find(item => item.assetCode === index))
    }
    const pageHandler = async (num) => {
        // setLoading(true);
        sortPagingAsync(sortRule, num);
    }


    const sortPagingAsync = async (sortBy, num) => {
        let category;
        setLoading(true);
        props.onSortRuleChange(sortBy);
        console.log(categoryFilter);
        if (categoryFilter.includes('ALL')) {
            category = ["ALL"];
        } else {
            category = categoryFilter;
        }
        let promise = searchAndFilterAsset(keyword.toLowerCase(), category.toLocaleString(), stateFilter.toLocaleString(), sortBy, num);
        let response = (await promise).data;
        console.log(response);
        setDisplayList(response.data);
        setTotalPages(response.totalPages);
        setActive(num);
        props.onPageChange(num);
        setLoading(false);
    }

    const showRemoveAssetModal = () => {
        setRemoveAsset(!removeAsset);
    }

    const openRemoveModal = (item) => {
        console.log(item);
        setAssetRemove(item);
        showRemoveAssetModal();
    }

    const closeModal = () => {
        setRemoveAsset(!removeAsset)
    }

    const compareValues = (key, order = 'asc') => (a, b) => {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
        let comparison = a[key].localeCompare(b[key]);
        return (
            (order === 'desc') ? (comparison * - 1) : comparison
        )
    }



    const sortBy = (key) => {
        sortPagingAsync(key, active);
    }

    return (
        <div className="asset-table">
            {
                removeAsset ? <AssetRemoveModal
                    AssetRemove={assetRemove}
                    handleClose={closeModal} /> : null
            }
            {isActiveModal ? <DetailsAssetModal details={currentItem} show={isActiveModal} close={() => setIsActiveModal(!isActiveModal)} /> : null}
            {displayList !== undefined && displayList !== null && !loading ?
                <table>
                    <thead>
                        <tr>
                            <th onClick={(e) => sortBy('assetCode')}>
                                <p>Asset Code <FontAwesomeIcon icon={faSortDown} /></p>
                            </th>
                            <th onClick={(e) => sortBy('name')}>
                                <p>Asset Name <FontAwesomeIcon icon={faSortDown} /></p>
                            </th>
                            <th onClick={(e) => sortBy('category')}>
                                <p>Category <FontAwesomeIcon icon={faSortDown} /></p>
                            </th>
                            <th onClick={(e) => sortBy('state')}>
                                <p>State <FontAwesomeIcon icon={faSortDown} /></p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>{
                        displayList.map((item, index) => (
                            <tr key={index}>
                                <td onClick={() => detailsModal(item.assetCode)}><p>{item.assetCode}</p></td>
                                <td onClick={() => detailsModal(item.assetCode)}><p>{item.assetName}</p></td>
                                <td onClick={() => detailsModal(item.assetCode)}><p>{item.categoryName}</p></td>
                                <td className="state" onClick={() => detailsModal(item.assetCode)}><p>{item.state.split('_').join(' ').toLowerCase()}</p></td>
                                {item.state !== "ASSIGNED" ?
                                    <td>
                                        <Link
                                            to={{
                                                pathname: '/admin/asset/edit',
                                                state: { asset: item }
                                            }}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </Link>
                                    </td> :
                                    <td>
                                        <FontAwesomeIcon icon={faPen} color="#a2a3a2" />
                                    </td>
                                }
                                {item.state === "ASSIGNED" ?
                                    <td disabled className="asset-table__delete">
                                        <FontAwesomeIcon icon={faTimesCircle} color="#E799A3" />
                                    </td>
                                    :
                                    <td className="asset-table__delete" onClick={() => openRemoveModal(item)}>
                                        <FontAwesomeIcon icon={faTimesCircle} />
                                    </td>
                                }

                            </tr>
                        ))
                    }
                    </tbody>
                </table> : <h2>Loading</h2>
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
        </div>
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        onSortRuleChange: (rule) => {
            dispatch({ type: LOAD_NEW_ASSET_SORT_RULE, payload: rule });
        },
        onPageChange: (value) => {
            dispatch({ type: LOAD_NEW_ASSET_PAGE_NUMBER, payload: value });
        },
        onLoadAssetList: (assetList) => {
            dispatch({ type: LOAD_NEW_ASSET_DISPLAY_LIST, payload: assetList });
        },
    }
}

const mapStateToProps = (state) => {
    return {
        newAsset: state.assetManagementReducer.currentAssetManagement_NewAsset,
        sortAssetRule: state.assetManagementReducer.currentAssetManagement_SortRule,
        assetFilterStateRule: state.assetManagementReducer.currentManageAsset_StateFilter,
        assetFilterCategoryRule: state.assetManagementReducer.currentManageAsset_CategoryFilter,
        assetPage: state.assetManagementReducer.currentAssetManagement_Page,
        displayList: state.assetManagementReducer.currentManageAsset_DisplayList,
        totalPage: state.assetManagementReducer.currentManageAsset_TotalPage,
        assetKeyword: state.assetManagementReducer.currentAssetManagement_Keyword
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(AssetTable);
