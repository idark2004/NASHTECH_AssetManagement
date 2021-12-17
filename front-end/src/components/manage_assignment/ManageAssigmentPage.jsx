import React from 'react'
import Header from '../../components/Header'
import ManageAssigmentToolBar from './ManageAssigmentToolBar'
import ManageAssigmentTable from './ManageAssigmentTable'
import { useHistory } from 'react-router'
import Menu from '../Menu'
import '../../css/ManageAssigment.css'
export default function ManageAssigmentPage() {
    const history = useHistory('/')
    if (window.localStorage.getItem('jwt') === undefined || document.cookie.indexOf('id=') < 0) {
        history.push('/login')
    }
    return (
        <div>
            <div>
                <Header />
            </div>
            <div class="Assignment_Page">
                <Menu />
                <div className="Assignment_List_Section">
                    <div class="Assignment_Header">
                        <h2>Assignment List</h2>
                    </div>
                    <ManageAssigmentToolBar />
                </div>
            </div>
        </div>
    )
}
