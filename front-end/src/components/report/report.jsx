import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
export default function Report() {
    const [displayList, setDisplayList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [totalReports, setTotalReports] = useState(1);
    const [sortRule, setSortRule] = useState('category');
    const [sortCategory, setSortCategory] = useState(true);
    const [sortTotal, setSortTotal] = useState(true);
    const [sortAssigned, setSortAssigned] = useState(true);
    const [sortAvailable, setSortAvailabel] = useState(true);
    const [sortNotAvailable, setSortNotAvailabel] = useState(true);
    const [sortWaiting, setSortWaiting] = useState(true);
    const [sortRecycled, setSortRecycled] = useState(true);
    const history = useHistory('/');
    if (window.localStorage.getItem('jwt') === undefined || document.cookie.indexOf('id=') < 0) {
        history.push('/login')
    }
    useEffect(() => {
        if (displayList)
            if (displayList.length == 0) {
                getReportDataAsync();
            } else {
            }
    }, [])

    useEffect(() => {
        if (displayList !== undefined && displayList !== null) {
            if (displayList.length > 0) {
                setLoading(false);
            } else {
                sort(sortRule);
            }
        }
    }, displayList)

    const sort = (rule) => {
        let responseObj = {
            data: displayList
        }
        let sortedList = sortResponse(rule, responseObj);
        console.log(sortedList);
        setDisplayList(() => [...sortedList]);
    }

    const sortResponse = (rule) => {
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
            case "total": {
                console.log("total")
                let sortData = displayList.sort((a, b) =>
                    (a.total > b.total) ? 1 :
                        (a.total < b.total) ? -1 : 0);
                if (!sortTotal) {
                    sortData = sortData.reverse();
                }
                return sortData;
            }
            case "assigned": {
                let sortData = displayList.sort((a, b) =>
                    (a.assigned > b.assigned) ? 1 :
                        (a.assigned < b.assigned) ? -1 : 0);
                if (!sortAssigned) {
                    sortData = sortData.reverse();
                }
                return sortData;
            }
            case "available": {
                let sortData = displayList.sort((a, b) =>
                    (a.available > b.available) ? 1 :
                        (a.available < b.available) ? -1 : 0);
                if (!sortAvailable) {
                    sortData = sortData.reverse();
                }
                return sortData;
            }
            case "notAvailable": {
                let sortData = displayList.sort((a, b) =>
                    (a.notAvailable > b.notAvailable) ? 1 :
                        (a.notAvailable < b.notAvailable) ? -1 : 0);
                if (!sortNotAvailable) {
                    sortData = sortData.reverse();
                }
                return sortData;
            }
            case "waiting": {
                let sortData = displayList.sort((a, b) =>
                    (a.waiting > b.waiting) ? 1 :
                        (a.waiting < b.waiting) ? -1 : 0);
                if (!sortWaiting) {
                    sortData = sortData.reverse();
                }
                return sortData;
            }
            case "recycled": {
                let sortData = displayList.sort((a, b) =>
                    (a.recycled > b.recycled) ? 1 :
                        (a.recycled < b.recycled) ? -1 : 0);
                if (!sortRecycled) {
                    sortData = sortData.reverse();
                }
                return sortData;
            }
        }
    }


    const exportHanlder = () => {
        const url = "https://assetmanagementrookies03.azurewebsites.net/api/v1/report/" + window.localStorage.getItem("locationId");
        let config = {
            headers: {
                Authorization: localStorage.getItem("jwt")
            },
        };
        axios.get(url, { responseType: 'blob' }, config)
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'report.xlsx'); //or any other extension
                document.body.appendChild(link)
                    ;
                link.click();
            })
            .catch((err) => alert(err))
            .finally(() => { });
    }

    const getReportDataAsync = async (sortRule) => {
        let url = "https://assetmanagementrookies03.azurewebsites.net/api/v1/asset/report/" + window.localStorage.getItem('locationId');
        let promise = axios.get(url, {
            headers: {
                Authorization: window.localStorage.getItem('jwt')
            }
        })
        let data = (await promise).data;
        setTotalReports(data.length);
        setDisplayList(data);
        setLoading(false);
    }


    return (
        <div>
            <div className="assignment-toolbar__container">
                <button style={
                    {
                        marginLeft: '86%',
                        width: '5rem',
                        backgroundColor: 'red',
                        padding: '5px',
                        borderRadius: '5px',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer'
                    }
                } className="export_button" onClick={() => { exportHanlder() }}>Export</button>
            </div>
            <div className="assign_table_section">
                <div className="assign_table_wrapper">
                    {!loading ? <table>
                        <thead>
                            <tr>
                                <th onClick={(e) => sort('category')} style={{
                                    maxWidth: '7%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <p>Category <span style={{
                                        maxWidth: '7%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}></span>
                                        <FontAwesomeIcon size={32} icon={faSortDown} />
                                    </p>
                                </th>
                                <th onClick={(e) => sort('total')} style={{
                                    maxWidth: '7%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <p >Total <span style={{
                                        maxWidth: '7%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}></span>
                                        <FontAwesomeIcon icon={faSortDown} />
                                    </p>
                                </th>
                                <th onClick={(e) => sort('assigned')} style={{
                                    maxWidth: '7%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <p >Assigned <span style={{
                                        maxWidth: '7%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}></span>
                                        <FontAwesomeIcon icon={faSortDown} />
                                    </p>
                                </th>
                                <th onClick={(e) => sort('available')} style={{
                                    maxWidth: '7%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <p>Available <span style={{ width: "10px" }}></span>
                                        <FontAwesomeIcon icon={faSortDown} />
                                    </p>
                                </th>
                                <th onClick={(e) => sort('notAvailable')} style={{
                                    maxWidth: '7%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <p>Not Available <span style={{ width: "10px" }}></span>
                                        <FontAwesomeIcon icon={faSortDown} />
                                    </p>
                                </th>
                                <th onClick={(e) => sort('waiting')} style={{
                                    maxWidth: '7%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <p >Waiting for recycling <span style={{
                                        maxWidth: '7%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}></span><FontAwesomeIcon icon={faSortDown} />
                                    </p>
                                </th>
                                <th onClick={(e) => sort('recycled')} style={{
                                    maxWidth: '7%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <p>Recycled <FontAwesomeIcon icon={faSortDown} /></p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                displayList.map((report, index) => {
                                    return <tr>
                                        <td style={{
                                            maxWidth: '7%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <p>
                                                {report.category}
                                            </p>
                                        </td>
                                        <td style={{
                                            maxWidth: '7%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <p>
                                                {report.total}
                                            </p>
                                        </td>
                                        <td >
                                            <p>{
                                                report.assigned
                                            }</p>
                                        </td>
                                        <td>
                                            <p >{
                                                report.available
                                            }</p>
                                        </td>
                                        <td >
                                            <p>{
                                                report.notAvailable
                                            }</p>
                                        </td>
                                        <td >
                                            <p>{
                                                report.waiting
                                            }</p>
                                        </td>
                                        <td >
                                            <p>{
                                                report.recycled
                                            }</p>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                        : <h2>Loading</h2>}
                </div>
            </div>
        </div >
    )
}
