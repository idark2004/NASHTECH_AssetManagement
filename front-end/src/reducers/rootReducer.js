import { INIT_LOAD, PAGE_LOAD, SEARCH_SUCCESS, SEARCH_FAIL, SORT_BY, NEW_USER, RELOAD, NEW_FILTERS_RULE, CLEAR_FILTER_RULE } from '../actions/actionConstants'
import { NEW_FILTER_STATE, NEW_FILTER_DATE, CLEAR_FILTER_STATE, CLEAR_FILTER_DATE } from '../actions/actionConstants'
import { LOAD_NEW_ASSIGNMENT, LOAD_NEW_ASSET, LOAD_NEW_ASSET_SORT, LOAD_NEW_ASSIGNMENT_SORT } from '../actions/actionConstants'
import { LOAD_NEW_ASSET_STATE_FILTER, LOAD_NEW_ASSET_CATEGORY_FILTER, LOAD_NEW_ASSET_PAGE } from '../actions/actionConstants'
const initState = {
    initUserList: [],
    searchedUserList: [],
    sortRule: 'firstName',
    sortAssignmentRule: 'assetCode',
    filterRule: ['ALL'],
    filterStates: ['ALL'],
    filterDate: '2020-01-01',
    failReason: '',
    currentviewPage: 1,
    newUser: null,
    newAsset: null,
    newAssignment: null,
    sortAssetRule: 'assetCode',
    sortAssignmentRule: 'assetCode',
    assetFilterStateRule: ['ASSIGNED', 'AVAILABLE', 'NOT_AVAILABLE'],
    assetFilterCategoryRule: ['ALL'],
    assetPage: 1,
    assetKeyword: '',
    totalPage: 1,
    assetDisplayList: [],
    loading: false,
    disableStaffCode: '',

}

const userManagementReducer = (state = initState, action) => {
    switch (action.type) {
        case INIT_LOAD: {
            return {
                ...state,
                initUserList: action.payload
            }
        }
        case SEARCH_SUCCESS: {
            return {
                ...state,
                initUserList: action.payload,
            }
        }
        case SEARCH_FAIL: {
            return {
                ...state,
                failReason: action.payload
            }
        }
        case PAGE_LOAD: {
            return {
                ...state,
                currentviewPage: action.payload.pageNum
            }
        }
        case SORT_BY: {
            return {
                ...state,
                sortRule: action.payload
            }
        }

        case NEW_USER: {
            return {
                ...state,
                newUser: action.payload

            }
        }

        case RELOAD: {
            return {
                ...state,
                newUser: null
            }
        }
        case NEW_FILTERS_RULE: {
            return {
                ...state,
                filterRule: action.payload
            }
        }

        case CLEAR_FILTER_RULE: {
            return {
                ...state,
                filterRule: ['ALL']
            }
        }

        case NEW_FILTER_STATE: {
            return {
                ...state,
                filterStates: action.payload
            }
        }
        case CLEAR_FILTER_STATE: {
            return {
                ...state,
                filterStates: ['ALL']
            }
        }

        case NEW_FILTER_DATE: {
            return {
                ...state,
                filterDate: action.payload
            }
        }

        case CLEAR_FILTER_DATE: {
            return {
                ...state,
                filterDate: '2020-05-02'
            }
        }


        case LOAD_NEW_ASSIGNMENT: {
            return {
                ...state,
                newAssignment: action.payload
            }
        }

        case LOAD_NEW_ASSET: {
            return {
                ...state,
                newAsset: action.payload
            }
        }

        case LOAD_NEW_ASSIGNMENT_SORT: {
            return {
                ...state,
                sortAssignmentRule: action.payload
            }
        }

        case LOAD_NEW_ASSET_SORT: {
            return {
                ...state,
                sortAssetRule: action.payload
            }
        }

        case LOAD_NEW_ASSET_PAGE: {
            return {
                ...state,
                assetPage: action.payload
            }
        }

        case LOAD_NEW_ASSET_CATEGORY_FILTER: {
            return {
                ...state,
                assetFilterCategoryRule: action.payload,

            }
        }
        case LOAD_NEW_ASSET_STATE_FILTER: {
            return {
                ...state,
                assetFilterStateRule: action.payload
            }
        }

        case 'UPDATE_ASSET_KEYWORD': {
            return {
                ...state,
                assetKeyword: action.payload
            }
        }

        case 'LOAD_ASSET_RESULT': {
            return {
                ...state,
                assetDisplayList: action.payload
            }
        }


        case 'LOAD_NEW_TOTAL_PAGE': {
            return {
                ...state,
                totalPages: action.payload
            }
        }

        case 'LOADING': {
            return {
                ...state,
                loading: true,
            }
        }

        case 'LOAD_SUCCESS': {
            return {
                ...state,
                loading: false
            }
        }

        case 'LOAD_ASSET_KEYWORD': {
            return {
                ...state,
                assetKeyword: action.payload
            }
        }

        case 'LOAD_DISABLE_CODE': {
            return {
                ...state,
                disableStaffCode: action.payload
            }
        }

        default: {
            return {
                ...state,
            }
        }
    }
}

const rootReducer = userManagementReducer;
export default rootReducer;