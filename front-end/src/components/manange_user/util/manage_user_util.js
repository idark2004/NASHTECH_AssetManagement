import axios from "axios";

const url = 'https://assetmanagementrookies03.azurewebsites.net/api/v1/user'
const filterEndpoint = "/filterView/v2";
export const sortAndFilterUser = (sortBy, roles, keyword, pageNum) => {
    let config = {
        url: url + filterEndpoint,
        method: 'get',
        params: {
            sortBy: sortBy,
            pageNum: pageNum,
            locationId: localStorage.getItem('locationId'),
            keyword: keyword,
            filerRoles: roles
        },
        headers: {
            'Authorization': localStorage.getItem("jwt")
        }
    }
    return axios(config);
}
