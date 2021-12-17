import { createBrowserHistory } from "history";
import api from "../apis/apiFetch";

export const customHistory = createBrowserHistory();

class AuthService {
  logout() {
    localStorage.clear();
    document.cookie = "id= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    customHistory.push("/")
    window.location.reload();
  }

  register(firstName, lastName, dateOfBirth, gender, joinDate, roleId) {
    return api.create("user", {
        firstName, 
        lastName,
        dateOfBirth,
        gender,
        joinDate,
        locationId: localStorage.getItem("locationId"),
        roleId
    }).then(res => {
        console.log(res)
        let response = {
          id: res.id,
          username: res.username,
          firstName: res.firstName,
          lastName: res.lastName,
          dateOfBirth: res.dateOfBirth,
          gender: res.gender,
          joinDate: res.joinDate,
          role: res.roleId === 1 ? "Admin" : "Staff"
        }
        return response
    })
  }

  update(id, dateOfBirth, gender, joinDate, roleId) {
    return api.update("user", {
        id,
        dateOfBirth,
        gender,
        joinDate,
        locationId: localStorage.getItem("locationId"),
        roleId
    }).then(res => {
        console.log(res)
        let response = {
          id: res.id,
          username: res.username,
          firstName: res.firstName,
          lastName: res.lastName,
          dateOfBirth: res.dateOfBirth,
          gender: res.gender,
          joinDate: res.joinDate,
          role: res.roleId === 1 ? "Admin" : "Staff"
        }
        return response
    })
  }
}

export default new AuthService();