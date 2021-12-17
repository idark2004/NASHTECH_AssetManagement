import React from 'react'
import { useLocation, useHistory } from "react-router-dom";
import Header from "../components/Header";
import Menu from "../components/Menu";
import MessageModal from '../components/MessageModal';
import MyAssigmentTable from '../components/manage_my_assignment/MyAssigmentTable'

const Home = () => {
    const location = useLocation();
    const history = useHistory();

    if (!localStorage.hasOwnProperty("fullName") || localStorage.getItem("fullName") === "") {
        history.push("/login");
    }

    return (
        <div style={{ overflowX: 'hidden' }}>
            <div>
                <Header />
            </div>
            <div style={{ display: "flex", flexDirection: "row", padding: "3em" }}>
                <div>
                    <Menu />
                </div>
                <div style={{ width: '100%' }}>
                    <div className="Assignment_List_Section">
                        <div className="Assignment_Header">
                            <h2>My Assignment</h2>
                        </div>
                        <MyAssigmentTable />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
