import React from 'react'

export default function Header_Aside() {
    return (
        <div>
            <aside>
                <div>
                    <img src="https://www.nashtechglobal.com/wp-content/uploads/2020/04/logo.png" alt="" />
                    <h2>Online Asset Management</h2>
                </div>
                <div className="sidebar">
                    <nav className="navbar">
                        <ul>
                            <li>
                                <div className="navbar navbar-item">
                                    <h3>Home</h3>
                                </div>
                            </li>
                            <li>
                                <div className="navbar navbar-item">
                                    <h3>Manage User</h3>
                                </div>
                            </li>
                            <li>
                                <div className="navbar navbar-item">
                                    <h3>Manage Asset</h3>
                                </div>
                            </li>
                            <li>
                                <div className="navbar navbar-item">
                                    <h3>Manage Assignment</h3>
                                </div>
                            </li>
                            <li>
                                <div className="navbar-item">
                                    <h3>Request for Returning</h3>
                                </div>
                            </li>
                            <li>
                                <div className="navbar-item">
                                    <h3>Report</h3>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </div>
    )
}
