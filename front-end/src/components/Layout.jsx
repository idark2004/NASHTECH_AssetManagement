import React from 'react'

import { BrowserRouter, Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'
import Menu from './Menu'

import App from "../App"

const Layout = () => {
    return (
        <BrowserRouter>
            <Route render={props => (
                <div>
                    <Header {...props} />

                    <div className="container">
                        <div className="main">
                            <Menu />
                            <App />
                        </div>
                    </div>

                    <Footer />
                </div>
            )} />
        </BrowserRouter>
    )
}

export default Layout
