import axios from "axios";
const url = 'https://assetmanagementrookies03.azurewebsites.net/api/v1/assignment'
const localUrl = 'http://localhost:8080/api/v1/assignment'
export const searchAndFilterAssignment = (keyword, filterState, filterDate, pageNum, sortBy) => {
    var config = {
        method: 'get',
        url: url,
        params: {
            keyword: keyword,
            sort: sortBy,
            pageNumber: pageNum,
            locationId: localStorage.getItem('locationId'),
            filterState: filterState,
            filterDate: filterDate,
            direction: 0
        },
        headers: {
            'Authorization': localStorage.getItem("jwt")
        }
    };
    console.log(url);
    return axios(config);
}