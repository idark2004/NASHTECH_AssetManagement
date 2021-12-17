import { combineReducers } from 'redux'
import { LOAD_NEW_SORT_RULE, LOAD_CURRENT_PAGE, LOAD_NEW_FILTER_RULE, LOAD_NEW_KEYWORD, LOAD_NEW_USER } from '../actions/actionConstantv2'
import { LOAD_NEW_ASSET_SORT_RULE, LOAD_NEW_ASSET_KEYWORD, LOAD_NEW_ASSET_CATEGORY_FILTER, LOAD_NEW_ASSET_STATE_FILTER, LOAD_NEW_ASSET_PAGE_NUMBER, LOAD_NEW_ASSET_DISPLAY_LIST, LOAD_ASSET_TOTAL_PAGE, LOAD_NEW_ASSET } from '../actions/actionConstantv2'
import { LOAD_NEW_ASSIGNMENT_PAGE_NUMBER, LOAD_NEW_ASSIGNMENT_KEYWORD, LOAD_NEW_ASSIGNMENT_DATE_FILTER, LOAD_NEW_ASSIGNMENT_STATE_FILTER, LOAD_NEW_ASSIGNMENT_SORT_RULE } from '../actions/actionConstantv2'
const userManagementState = {
    newUser: null,
    currenManageUser_Page: 1,
    currentManageUser_SortRule: 'firstName',
    currentManageUser_FilterRoles: ['ALL'],
    currentManageUser_Keyword: '',

}


const assetManagementState = {
    currentAssetManagement_Keyword: '',
    currentAssetManagement_NewAsset: null,
    currentAssetManagement_Page: 1,
    currentAssetManagement_SortRule: 'assetCode',
    currentManageAsset_CategoryFilter: ['ALL'],
    currentManageAsset_StateFilter: ['AVAILABLE', 'ASSIGNED', 'NOT_AVAILABLE'],
    currentManageAsset_DisplayList: [],
    currentManageAsset_TotalPage: 1,
}


const assignmentManagementState = {
    currentAssignmentManagement_Keyword: '',
    currentAssignmentManagement_NewAssignment: null,
    currentAssignmentManagement_Page: 1,
    currentAssignmentManagement_SortRule: 'assetCode',
    currentAssignmentManagement_StateFiler: ['ALL'],
    currentAssignmentManagement_AssigneDateFilter: null,
}

export const userManagementReducer = (state = userManagementState, action) => {
    console.log(action.type);
    switch (action.type) {
        case LOAD_NEW_SORT_RULE: {
            return {
                ...state,
                currentManageUser_SortRule: action.payload,
            }
        }
        case LOAD_CURRENT_PAGE: {
            return {
                ...state,
                currenManageUser_Page: action.payload,
            }
        }
        case LOAD_NEW_FILTER_RULE: {
            console.log(action.payload);
            return {
                ...state,
                currentManageUser_FilterRoles: action.payload,
            }
        }

        case LOAD_NEW_KEYWORD: {
            return {
                ...state,
                keyword: action.payload
            }
        }

        case LOAD_NEW_USER: {
            return {
                ...state,
                newUser: action.payload
            }
        }

        default: {
            return {
                ...state,
            }
        }
    }
}


export const assetManagementReducer = (state = assetManagementState, action) => {
    console.log(action.payload);
    switch (action.type) {
        case LOAD_NEW_ASSET_SORT_RULE: {
            return {
                ...state,
                currentAssetManagement_SortRule: action.payload
            }
        }
        case LOAD_NEW_ASSET_KEYWORD: {
            return {
                ...state,
                currentAssetManagement_Keyword: action.payload
            }
        }

        case LOAD_NEW_ASSET_DISPLAY_LIST: {
            return {
                ...state,
                currentManageAsset_DisplayList: action.payload
            }
        }
        case LOAD_NEW_ASSET_CATEGORY_FILTER: {
            return {
                ...state,
                currentManageAsset_CategoryFilter: action.payload,
            }
        }
        case LOAD_NEW_ASSET_STATE_FILTER: {
            return {
                ...state,
                currentManageAsset_StateFilter: action.payload,
            }
        }
        case LOAD_NEW_ASSET_PAGE_NUMBER: {
            return {
                ...state,
                currentAssetManagement_Page: action.payload
            }
        }
        case LOAD_ASSET_TOTAL_PAGE: {
            return {
                ...state,
                currentManageAsset_TotalPage: action.payload
            }
        }
        case LOAD_NEW_ASSET: {
            return {
                ...state,
                currentAssetManagement_NewAsset: action.payload
            }
        }

        default: {
            return {
                ...state,
            }
        }
    }
}


export const assignmentManagementReducer = (state = assignmentManagementState, action) => {
    switch (action.type) {
        case LOAD_NEW_ASSIGNMENT_PAGE_NUMBER: {
            return {
                ...state,
                currentManageAsset_CategoryFilter: action.payload
            }
        }
        case LOAD_NEW_ASSIGNMENT_SORT_RULE: {
            return {
                ...state,
                currentAssignmentManagement_SortRule: action.payload
            }
        }
        case LOAD_NEW_ASSIGNMENT_KEYWORD: {
            return {
                ...state,
                currentAssignmentManagement_Keyword: action.payload
            }
        }
        case LOAD_NEW_ASSIGNMENT_DATE_FILTER: {
            return {
                ...state,
                currentAssignmentManagement_AssigneDateFilter: action.payload
            }
        }

        case LOAD_NEW_ASSIGNMENT_STATE_FILTER: {
            return {
                ...state,
                currentAssignmentManagement_StateFiler: action.payload
            }
        }

        case 'LOAD_NEW_CREATE_ASSIGNMENT': {
            return {
                ...state,
                currentAssignmentManagement_NewAssignment: action.payload
            }
        }

        default: {
            return {
                ...state,
            }
        }
    }
}


export default combineReducers({ userManagementReducer, assetManagementReducer, assignmentManagementReducer });