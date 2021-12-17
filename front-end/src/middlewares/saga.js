import { put, call, takeEvery } from 'redux-saga/effects';
import { INIT_LOAD, PAGE_LOAD, SEARCH_SUCCESS, SEARCH_FAIL } from '../actions/actionConstants'
import { CREATE_NEW_USER_ASYN, INIT_LOAD_ASYN, PAGE_LOAD_ASYN, SEARCH_SUCCESS_ASYN, SEARCH_FAIL_ASYN } from '../actions/actionConstants'

function* watchInitLoad() {
    takeEvery(INIT_LOAD_ASYN, initLoadHanlder)
}

function* initLoadHanlder(action) {

}