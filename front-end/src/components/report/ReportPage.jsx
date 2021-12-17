import React from 'react'
import '../../css/ManageAssigment.css'
import Report from './report'
import Header from '../../components/Header'
import Menu from '../../components/Menu'

export default function ReportPage() {
    return (
        <div>
            <div>
                <Header />
            </div>
            <div class="Assignment_Page">
                <Menu />
                <div className="Assignment_List_Section">
                    <div class="Assignment_Header">
                        <h2>Report</h2>
                    </div>
                    <Report></Report>
                </div>
            </div>
        </div>
    )
}
