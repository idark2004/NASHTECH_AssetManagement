import React from 'react'
import Header from '../Header'
import MyAssigmentTable from './MyAssigmentTable'
import Menu from '../Menu'

export default function MyAssigmentPage() {
    return (
        <div style={{ width: "100%" }}>
            <div>
                <Header />
            </div>
            <div className="ghosthub" style={{ display: "flex", flexDirection: "row", padding: "3em", flex: '2' }}>
                <div>
                    <Menu />
                </div>
                <div className="ghosthub" style={{ width: "100%" }}>
                    <MyAssigmentTable />
                </div>
            </div>
        </div>
    )
}
