import './css/custom.css';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import SignUp from "./components/user/SignUp";
import MainLayout from "./components/MainLayout";
import UserList from "./components/user/UserList";
import UserForm from "./components/user/UserForm";
import SignIn from "./components/user/SignIn";
import Index from "./components/Index"
import PrivateRoute from "./components/PrivateRoute";

library.add(fas, far);

const App = () => (
    <Router>
        <Switch>
            <Route path="/signIn" exact component={SignIn} />
            <Route path="/signUp" exact component={SignUp} />
            <Route
                path="*"
                exact
                render={() => (
                    <MainLayout>
                        <Switch>
                            <PrivateRoute path={["/", "/index"]} exact component={Index} />
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
