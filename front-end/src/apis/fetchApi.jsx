import axios from 'axios'

const url = 'https://assetmanagementrookies03.azurewebsites.net/api/v1/user'
const baseUrl = 'https://assetmanagementrookies03.azurewebsites.net/api/v1/'

export const loadUserList = async (pageNum, sortBy) => {
    var config = {
        method: 'get',
        url: url,
        params: {
            sortBy: sortBy,
            pageNum: pageNum,
            locationId: localStorage.getItem('locationId')
        },
        headers: {
            'Authorization': localStorage.getItem("jwt")
        }
    };
    const promise = axios(config);
    return promise;
}

export const searchUsers = (keyword, pageNum, sortBy) => {
    console.log(url + "/search")
    const promise = axios.get(url + '/search', {
        headers: { Authorization: localStorage.getItem('jwt') },
        params: { locationId: localStorage.getItem('locationId'), keyword: keyword, pageNum: pageNum, sortBy: sortBy },
    })
    return promise;
}

export const getTotalRecordOnSearch = (keyword) => {
    let URL = url + "/" + keyword + "/" + localStorage.getItem('locationId')
    const promise = axios.get(URL, {
        headers: { Authorization: localStorage.getItem('jwt') },
    })
    return promise;
}

export const getTotlRecordOnLoadUserList = async () => {
    var config = {
        method: 'get',
        url: url + "/totalPage",
        params: {
            location: localStorage.getItem('locationId')
        },
        headers: {
            'Authorization': localStorage.getItem("jwt")
        }
    };
    const promise = axios(config);
    return promise;
}


export const disableUser = (userid) => {
    var config = {
        method: 'delete',
        url: url,
        data: {
            staffCode: userid,
        },
        headers: {
            'Authorization': localStorage.getItem('jwt')
        }
    }
    const promise = axios(config);
    return promise
}


export const searchAndFilter = (keyword, filterString, pageNum, sortBy) => {
    const promise = axios.get(url + '/filterView', {
        headers: { Authorization: localStorage.getItem('jwt') },
        params: { locationId: localStorage.getItem('locationId'), keyword: keyword, pageNum: pageNum, sortBy: sortBy, filerRoles: filterString },
    })
    return promise;
}

export const getTotalRecordOnSearchAndFilter = (keyword, filterString, sortBy) => {
    let URL = url + "/filterView/totalPage";
    const promise = axios.get(URL, {
        headers: { Authorization: localStorage.getItem('jwt') },
        params: { locationId: localStorage.getItem('locationId'), keyword: keyword, sortBy: sortBy, filerRoles: filterString }
    })
    return promise;
}

export const checkAssignment = (staffCode) => {
    let URL = url + '/validation'
    const promise = axios.post(URL, { staffCode: staffCode }, {
        headers: { Authorization: localStorage.getItem('jwt') },
    })
    return promise
}


export const getAssetList = () => {
    let URL = baseUrl + "/asset"
    const promise = axios.get(URL, {
        headers: { Authorization: localStorage.getItem('jwt') },
        params: {
            location: localStorage.getItem('locationId')
        }
    })
    return promise
}

export const getHistory = (assetCode) => {
    let URL = baseUrl + "assignment/" + assetCode
    const promise = axios.get(URL, {
        headers: { Authorization: localStorage.getItem('jwt') },
    })
    return promise
}