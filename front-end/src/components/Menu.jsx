import React from 'react'

import { Link, useLocation } from 'react-router-dom'

import logo from '../assets/images/logo.png'

const mainMenu = [
    {
        display: "Home",
        path: "/"
    },
    {
        display: "Manage User",
        path: "/admin/user"
    },
    {
        display: "Manage Asset",
        path: "/admin/asset"
    },
    {
        display: "Manage Assignment",
        path: "/admin/assignment"
    },
    {
        display: "Request for Returning",
        path: "/admin/request-for-returning"
    },
    {
        display: "Report",
        path: "/report"
    }
]

const MenuBar = () => {

    const { pathname } = useLocation()
    const activeMenu = mainMenu.findIndex(e => e.path === pathname)

    return (
        <div className="menu">
            <div className="menu__logo">
                <img src={logo} alt="" />
                <h3>Online Asset Management</h3>
            </div>
            <div className="menu__widget">
                {
                    (localStorage.hasOwnProperty("role") && localStorage.getItem("role") === "ADMIN")
                        ?
                        mainMenu.map((item, index) => (
                            <div key={index} className={`menu__widget__content ${index === activeMenu ? "active" : ""}`}>
                                <Link to={item.path}>
                                    <span>{item.display}</span>
                                </Link>
                            </div>
                        ))
                        :
                        <div key={0} className={`menu__widget__content home active`} >
                            <Link to={mainMenu[0].path}>
                                <span>{mainMenu[0].display}</span>
                            </Link>
                        </div>
                }
            </div>
        </div>
    )
}

export default MenuBar
