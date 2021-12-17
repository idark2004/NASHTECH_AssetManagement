import React from 'react'
import ManageUserToolbar_Table from './ManageUserToolbar_Table'
import ManageUserHeaderSection from './ManageUserHeaderSection'
import Pagination from './Pagination'
import Header from "../Header"
import Menu from "../Menu"
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

export default function ManageUserPage(props) {
    const history = useHistory('/')
    if (window.localStorage.getItem('jwt') === undefined || document.cookie.indexOf('id=') < 0) {
        history.push('/login')
    }
    return (
        <div>
            <div>
                <Header />
            </div>
            <div id="ManageUserPage" style={{ display: "flex", padding: "2rem" }}>
                <Menu />
                <div className="user-list-section">
                    <ManageUserHeaderSection />
                    <ManageUserToolbar_Table />
                </div>
            </div>
        </div>
    )
}