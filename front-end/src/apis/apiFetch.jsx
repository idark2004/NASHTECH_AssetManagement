import axios from 'axios';

let token = localStorage.getItem("jwt");
const localUrl = 'http://localhost:8080/api/v1';
const url = "https://assetmanagementrookies03.azurewebsites.net/api/v1";

axios.defaults.baseURL = url;
axios.defaults.headers = {
    'Authorization': token,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
}

const responseBody = response => response.data;
const requests = {
    get: url => axios.get(url).then(responseBody),
    post: (url, body) => axios.post(url, body).then(responseBody),
    put: (url, body) => axios.put(url, body).then(responseBody),
    del: (url, params) => axios.delete(url, {params}).then(responseBody),
};
const activities = {
    list: target => requests.get(`/${target}`),
    create: (target, body) => requests.post(`/${target}`, body),
    update: (target, body) => requests.put(`/${target}`, body),
    delete: (target, data) => requests.del(`/${target}`, data)
};

export default activities;