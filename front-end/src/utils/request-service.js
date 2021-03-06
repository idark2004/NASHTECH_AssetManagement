import React from "react"
import axios from "axios"

import { API_BASE_URL } from "./constants/url"

class RequestService {
    constructor() {
        this.get = (url, isAuthRequired = false, contentType = "application/json") => {
            return createRequest("GET", url, null, isAuthRequired, contentType);
        }

        this.post = (url, body, isAuthRequired = false, contentType = "application/json") => {
            return createRequest("POST", url, body, isAuthRequired, contentType);
        }

        this.put = (url, body, isAuthRequired = false, contentType = "application/json") => {
            return createRequest("PUT", url, body, isAuthRequired, contentType);
        }

        this.delete = (url, isAuthRequired = false, contentType = "application/json") => {
            return createRequest("DELETE", url, null, isAuthRequired, contentType);
        } 
    } 
}

const createRequest = (method, url, body, isAuthRequired, contentType) => {
    return axios({
        method: method,
        url: API_BASE_URL + url,
        data: body,
        headers: setHeader(isAuthRequired, contentType)
    })
}

const setHeader = (isAuthRequired, contentType) => {
    if (isAuthRequired) {
        axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
    } else {
        delete axios.defaults.headers.common['Authorization']
    }
    axios.defaults.headers.common["Content-Type"] = contentType
};

export default new RequestService();