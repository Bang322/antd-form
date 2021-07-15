import './css/custom.css';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import SignUp from "./components/user/SignUp";
import MainLayout from "./components/MainLayout";
import UserList from "./components/user/UserList";
import UserForm from "./components/user/UserForm";

library.add(fas, far);

const App = () => (
    <Router>
        <Switch>
            <Route path="/signUp" exact component={SignUp} />
            <Route
                path="*"
                exact
                render={() => (
                    <MainLayout>
                        <Switch>
                            <Route path="/user/userList" exact component={UserList} />
                            <Route path="/user/userForm" exact component={UserForm} />
                        </Switch>
                    </MainLayout>
                )}
            />
        </Switch>
    </Router>
)

export default App;
