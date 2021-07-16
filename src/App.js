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
import axios from 'axios';
import {useEffect, useState} from "react";

library.add(fas, far);

const App = () => {
    const [isLogin, setIsLogin] = useState(false);
    useEffect(() => {
        axios.get('http://localhost:3001/user/checkLoginStatus')
            .then(res => {
                const { success, accessToken } = res.data;
                if (success) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    setIsLogin(true);
                }
            })
            .catch(error => console.log(`에러 발생 -> ${error}`));
    }, []);

    return (
        <Router>
            <Switch>
                <Route path="/signIn" exact render={props => <SignIn {...props} isLogin={isLogin} setIsLogin={setIsLogin} />}/>
                <Route path="/signUp" exact component={SignUp}/>
                <Route
                    path="*"
                    exact
                    render={() => (
                        <MainLayout>
                            <Switch>
                                <PrivateRoute isLogin={isLogin} path={["/", "/index"]} exact component={Index}/>
                                <Route path="/user/userList" exact component={UserList}/>
                                <Route path="/user/userForm" exact component={UserForm}/>
                            </Switch>
                        </MainLayout>
                    )}
                />
            </Switch>
        </Router>
    );
};

export default App;
