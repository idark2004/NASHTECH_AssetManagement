import { useEffect, useState } from "react";

import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../css/ManageUsers.css';

function ManagerUsers() {
    let list = [
        {
            staffCode: "SD1901",
            fullname: "An Nguyen Ihuy",
            username: "annt",
            joinedDate: "20/06/2019",
            type: "Staff"
        },
        {
            staffCode: "SD1234",
            fullname: "An than Van",
            username: "antv",
            joinedDate: "09/04/2019",
            type: "Staff"
        },
        {
            staffCode: "SD0971",
            fullname: "Binh Nguyen Van",
            username: "binhnv",
            joinedDate: "08/03/2018",
            type: "Admin"
        },
    ]
    const domain = 'http://localhost:3000/';
    const drop_down_arrow = <span><img width='12' src={domain + 'drop_down_arrow.svg'} alt="dropdown" /></span>;
    const [type, setType] = useState('Type');
    const [searchKey, setSearchKey] = useState("");

    const search = (searchKey) => {
        alert(searchKey);
    }

    return (
        <div >
            <h3>User List</h3>

            <div id="tools-container">
                <span id="form-filter">
                    <input className="input-filter" id="type-filter" disabled type="text" value={type} />
                    <button className="btn-submit" type="submit">
                        <img width='20' src={domain + 'filter.svg'} alt="" />
                    </button>
                </span>
                <form action="#">
                    <input className="input-filter" type="text" onChange={(event) => setSearchKey(event.target.value)} />
                    <button onClick={() => search(searchKey)} className="btn-submit" type="submit">
                        <img width='20' src={domain + 'search.svg'} alt="" />
                    </button>
                </form>
                <button id="btn-add-user">Create New User</button>
            </div>

            <table className="user-table">
                <thead>
                    <tr className="user-row">
                        <th>Staff Code {drop_down_arrow}</th>
                        <th>Full Name {drop_down_arrow}</th>
                        <th>Username</th>
                        <th>Joined Date {drop_down_arrow}</th>
                        <th>Type {drop_down_arrow}</th>
                        <th id="user-management"></th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((user, index) => {
                        return (
                            <tr className="user-row" key={index}>
                                <td className="user-info">{user.staffCode}</td>
                                <td className="user-info">{user.fullname}</td>
                                <td id="td-username" className="user-info">{user.username}</td>
                                <td className="user-info">{user.joinedDate}</td>
                                <td className="user-info">{user.type}</td>
                                <td id='user-edit-remove' className="user-info">
                                    <span>
                                        <img className="img-manage" width='16' onClick={() => alert('remove')} src={domain + 'remove_icon.svg'} alt="remove" />
                                        <img className="img-manage" width='16' onClick={() => alert('edit')} src={domain + 'pen_icon.svg'} alt="edit" />
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

const style = StyleSheet.crea

export default ManagerUsers;