import { INIT_LOAD, PAGE_LOAD, SEARCH_SUCCESS, SEARCH_FAIL, SORT_BY } from '../actions/actionConstants'
export const initLoadActionCreator = () => {
    return {
        type: INIT_LOAD
    }
}

export const pageLoadActionCreator = (pageNum) => {
    return {
        type: PAGE_LOAD,
        payload: {
            pageNum: pageNum
        }
    }
}

export const searchSuccessActionCreator = (data) => {
    return { type: SEARCH_SUCCESS, payload: data };
}

export const searchFailureActionCreator = (errorMessage) => {
    return { type: SEARCH_FAIL, payload: errorMessage };
}


export const sortByActionCreator = (data) => {
    return { type: SORT_BY, payload: data }
}
