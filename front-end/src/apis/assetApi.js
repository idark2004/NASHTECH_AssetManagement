import axios from "axios";
import { config } from "process";

const baseUrl = "https://assetmanagementrookies03.azurewebsites.net/api/v1";
const endPoint = "/asset/";

export const getAsset = () => {

};

export const deleteAsset = (assetCode, locationId) => { };


export const getCategory = () => {
    let config = {
        url: baseUrl + '/category',
        method: "get",
        headers: {
            Authorization: window.localStorage.getItem('jwt'),
        }
    }
    return axios(config);
};


export const searchAndFilterAsset = (keyword, categoryFilter, stateFilter, sortBy, pageNumber) => {
    let config = {
        url: baseUrl + endPoint,
        params: {
            locationId: window.localStorage.getItem('locationId'),
            pageNumber: pageNumber,
            sort: sortBy,
            filterState: stateFilter,
            filterCategory: categoryFilter,
            keyword: keyword
        },
        headers: {
            contentType: 'application/json',
            Authorization: window.localStorage.getItem('jwt')
        }
    }
    return axios(config);
}
