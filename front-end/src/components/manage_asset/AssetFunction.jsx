import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import { getCategory, searchAndFilterAsset } from "../../apis/assetApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
    LOAD_NEW_ASSET_STATE_FILTER, LOAD_NEW_ASSET_CATEGORY_FILTER,
    LOAD_NEW_ASSET_KEYWORD, LOAD_NEW_ASSET_DISPLAY_LIST, LOAD_NEW_ASSET_PAGE_NUMBER,
    LOAD_ASSET_TOTAL_PAGE
} from '../../actions/actionConstantv2';
import { useHistory } from 'react-router'
import { connect } from "react-redux";
const AssetFunction = (props) => {
    const [category, setCategory] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState(
        props.assetFilterCategoryRule
    );
    const [stateFilter, setStateFilter] = useState(props.assetFilterStateRule);
    const [active, setActive] = useState(props.page);
    const [sortBy, setSortBy] = useState(props.sortAssetRule);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory('/')
    if (window.localStorage.getItem('jwt') === undefined || document.cookie.indexOf('id=') < 0) {
        history.push('/login')
    }
    useEffect(async () => {
        let promise = getCategory();
        let fetchedCategories = (await promise).data;
        console.log(fetchedCategories);
        let AllItem = {
            name: 'ALL'
        }
        fetchedCategories = [AllItem, ...fetchedCategories]
        setCategory(fetchedCategories);
    }, []);

    useEffect(() => {
        setCategoryFilter(props.assetFilterCategoryRule);
        setStateFilter(props.assetFilterStateRule);
        setSortBy(props.sortAssetRule);
        setActive(props.page);
    }, [
        props.assetFilterStateRule,
        props.assetFilterCategoryRule,
        props.sortAssetRule,
        props.page,
    ]);


    const searchAndFilterAssetAsync = async (keyword) => {
        setLoading(false);
        let promise = searchAndFilterAsset(keyword, categoryFilter.toLocaleString(), stateFilter.toLocaleString(), sortBy, active);
        let reponse = (await promise).data;
        props.onLoadAssetList(reponse.data);
        props.onChangeKeyword(keyword);
        props.onTotalPageChange(reponse.totalPages);
        setLoading(false);
    }

    const handleSearch = (e) => {
        searchAndFilterAssetAsync(keyword);
    };

    const hanldeCategoryFilter = async (e) => {
        console.log("category filter");
        let checked = e.target.checked;
        let value = e.target.value;
        let allFilterCategory = category.toLocaleString();
        let currentFilterState;
        if (stateFilter.includes("ALL")) {
            currentFilterState = ["ALL"];
        } else {
            currentFilterState = stateFilter;
        }
        if (checked) {
            if (value === "ALL") {
                props.onCategoryFilterChange(["ALL"]);
                console.log(allFilterCategory);
                let data = (
                    await searchAndFilterAsset(
                        keyword.toLowerCase(),
                        ["ALL"].toLocaleString(),
                        currentFilterState.toLocaleString(),
                        sortBy,
                        active
                    )
                ).data;
                props.onLoadAssetList(data.data);
                props.onTotalPageChange(data.totalPages);
            } else {
                let currFilterList = categoryFilter;
                currFilterList = currFilterList.filter((state) => state !== "ALL");
                let newFitlerList = [...currFilterList, value];
                let data = (
                    await searchAndFilterAsset(
                        keyword.toLowerCase(),
                        newFitlerList.toLocaleString(),
                        currentFilterState.toLocaleString(),
                        sortBy,
                        active
                    )
                ).data;
                props.onLoadAssetList(data.data);
                props.onCategoryFilterChange(newFitlerList);
                props.onTotalPageChange(data.totalPages);
            }
        } else {
            let currFilterList = categoryFilter;
            currFilterList = currFilterList.filter((state) => state !== value);
            console.log(currFilterList);
            if (currFilterList.length === 0) {
                props.onCategoryFilterChange([]);
                props.onLoadAssetList([]);
                props.onTotalPageChange(1);

            } else {
                let data = (
                    await searchAndFilterAsset(
                        keyword.toLowerCase(),
                        currFilterList.toLocaleString(),
                        currentFilterState.toLocaleString(),
                        sortBy,
                        active
                    )
                ).data;
                props.onCategoryFilterChange(currFilterList);
                props.onLoadAssetList(data.data);
                props.onTotalPageChange(data.totalPages);
            }
            props.onCategoryFilterChange(currFilterList);
        }
        if (currentFilterState.length == 0) {
            props.onLoadAssetList([]);
            props.onTotalPageChange(1);
            return;
        }
    };

    const handleStateChecked = async (e) => {
        let categoryFilStr;
        // setLoading(true);
        if (categoryFilter.includes("ALL")) {
            categoryFilStr = 'ALL'
        } else {
            categoryFilStr = categoryFilter.toLocaleString();
        }

        let checked = e.target.checked;
        let value = e.target.value;
        console.log(value);
        let stateFilStr;
        let onChangeFilterList;
        if (checked) {
            if (value === "ALL") {
                stateFilStr = "ALL";
                onChangeFilterList = ["ALL"];
            } else {
                let filterArr = stateFilter.filter((state) => {
                    return state !== "ALL";
                });
                stateFilStr = [...filterArr, value.toLocaleString()].toLocaleString();
                onChangeFilterList = [...filterArr, value.toLocaleString()];
            }
        } else {
            if (value === "ALL") {
                stateFilStr = stateFilter
                    .filter((state) => state !== "ALL")
                    .toLocaleString();
                onChangeFilterList = stateFilter.filter((state) => state !== "ALL");
            } else {
                stateFilStr = stateFilter
                    .filter((state) => state !== value)
                    .toLocaleString();
                onChangeFilterList = stateFilter.filter((state) => state !== value);
            }
        }
        console.log(onChangeFilterList);
        if (onChangeFilterList.length > 0) {
            let promise = searchAndFilterAsset(
                keyword.toLowerCase(),
                categoryFilStr,
                stateFilStr,
                sortBy,
                active
            );
            let responseObj = (await promise).data;
            setLoading(false);
            let result = responseObj.data;
            console.log(onChangeFilterList);
            props.onStateFilterChange(onChangeFilterList);
            console.log(responseObj.totalPages);
            props.onTotalPageChange(responseObj.totalPages);
            props.onCurrentPage();
            props.onChangeKeyword(keyword);
            props.onLoadAssetList(responseObj.data);
        } else {
            props.onStateFilterChange(onChangeFilterList);
            props.onLoadAssetList([]);

        }
    };

    const listState = [
        {
            display: "All",
            value: "ALL",
        },
        {
            display: "Assigned",
            value: "ASSIGNED",
        },
        {
            display: "Available",
            value: "AVAILABLE",
        },
        {
            display: "Not Available",
            value: "NOT_AVAILABLE",
        },
        {
            display: "Waiting for recycling",
            value: "WAITING_FOR_RECYCLING",
        },
        {
            display: "Recycled",
            value: "RECYCLED",
        },
    ];

    return (
        <div className="asset-function">
            <div className="asset-function__header">
                <h2>Asset List</h2>
            </div>
            <div className="asset-function__tools">
                <div className="asset-function__tools__dropdown">
                    <div className="asset-function__tools__dropdown__select">
                        <span className="asset-function__tools__dropdown__selected">
                            State
                        </span>
                        <FontAwesomeIcon className="icon" icon={faFilter} />
                    </div>
                    <ul className="asset-function__tools__dropdown__list">
                        {listState.map((item, index) => (
                            <li
                                key={index}
                                className="asset-function__tools__dropdown__list__item"
                            >
                                <label className="asset-function__tools__dropdown__list__item__name">
                                    {item.display}
                                    <input
                                        type="checkbox"
                                        value={item.value}
                                        checked={props.assetFilterStateRule.includes(item.value)}
                                        onClick={(e) => {
                                            handleStateChecked(e);
                                        }}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="asset-function__tools__dropdown" s>
                    <div className="asset-function__tools__dropdown__select">
                        <span className="asset-function__tools__dropdown__selected">
                            Category
                        </span>
                        <FontAwesomeIcon className="icon" icon={faFilter} />
                    </div>
                    <ul className="asset-function__tools__dropdown__list">
                        {category.map((item, index) => (
                            <li
                                key={index}
                                className="asset-function__tools__dropdown__list__item"
                            >
                                <label className="asset-function__tools__dropdown__list__item__name">
                                    {item.name}
                                    <input
                                        type="checkbox"
                                        value={item.name}
                                        checked={props.assetFilterCategoryRule.includes(item.name)}
                                        onClick={(e) => hanldeCategoryFilter(e)}
                                    />
                                    <span className="checkmark" value={item.name}></span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="asset-function__tools__search">
                    <form>
                        <input maxLength="100" type="text" onChange={(e) => {
                            setKeyword(e.target.value);
                        }} />
                    </form>
                    <div
                        className="wrap-icon"
                        onClick={(e) => {
                            handleSearch(e);
                        }}
                    >
                        <FontAwesomeIcon
                            size="lg"
                            className="icon-search"
                            icon={faSearch}
                        />
                    </div>
                </div>
                <div className="asset-function__tools__create">
                    <Link to="/admin/asset/new">
                        <button>Create new asset</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        onStateFilterChange: (rule) => {
            dispatch({ type: LOAD_NEW_ASSET_STATE_FILTER, payload: rule });
        },
        onCategoryFilterChange: (rule) => {
            dispatch({ type: LOAD_NEW_ASSET_CATEGORY_FILTER, payload: rule });
        },
        onChangeKeyword: (keyword) => {
            dispatch({ type: LOAD_NEW_ASSET_KEYWORD, payload: keyword });
        },
        onLoadAssetList: (assetList) => {
            dispatch({ type: LOAD_NEW_ASSET_DISPLAY_LIST, payload: assetList });
        },

        onTotalPageChange: (totalPage) => {
            dispatch({ type: LOAD_ASSET_TOTAL_PAGE, payload: totalPage });
        },
        onLoading: () => {
            dispatch({ type: "LOADING", payload: true });
        },
        onCurrentPage: () => {
            { dispatch({ type: LOAD_NEW_ASSET_PAGE_NUMBER, payload: 1 }) }
        }
    };
};

const mapStateToProps = (state) => {
    return {
        newAsset: state.assetManagementReducer.currentAssetManagement_NewAsset,
        sortAssetRule: state.assetManagementReducer.currentAssetManagement_SortRule,
        assetFilterStateRule: state.assetManagementReducer.currentManageAsset_StateFilter,
        assetFilterCategoryRule: state.assetManagementReducer.currentManageAsset_CategoryFilter,
        page: state.assetManagementReducer.currentAssetManagement_Page,
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(AssetFunction);
