import "./App.css";
import "semantic-ui-css/semantic.min.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterForm from "./components/RegisterForm";
import ManageUserPage from "./components/manange_user/ManageUserPage";
import ChangePass from "./pages/ChangePass";
import ManageAsset from "./pages/ManageAsset";
import EditUserForm from "./components/EditUserForm";
import EditAssetForm from "./components/EditAssetForm";
import ManageAssigmentPage from './components/manage_assignment/ManageAssigmentPage';
import CreateAssetForm from "./components/manage_asset/CreateAssetForm";
import CreateNewAssignment from "./pages/CreateNewAssignment";
import Report from './components/report/ReportPage'
import ReportPage from "./components/report/ReportPage";
import EditAssignment from "./components/manage_assignment/EditAssignment";
import RequestForReturning from "./pages/RequestForReturning";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/"} exact component={Home} />
        <Route path={"/login"} component={Login} />
        <Route exact path={"/admin/user"} component={ManageUserPage} />
        <Route exact path={"/admin/user/new"} component={RegisterForm} />
        <Route exact path={"/admin/user/edit"} component={EditUserForm} />
        <Route exact path={"/admin/asset"} component={ManageAsset} />
        <Route exact path={"/admin/asset/edit"} component={EditAssetForm} />
        <Route exact path={"/admin/assignment"} component={ManageAssigmentPage} />
        <Route path={"/admin/request"} />
        <Route path={"/password"} component={ChangePass} />
        <Route exact path={"/admin/asset/new"} component={CreateAssetForm} />
        <Route exact path={"/admin/new/assignment"} component={CreateNewAssignment} />
        <Route exact path={"/admin/request-for-returning"} component={RequestForReturning} />
        <Route exact path={"/report"} component={ReportPage} />
        <Route path={"/admin/assignment/edit/:id"} component={EditAssignment} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
