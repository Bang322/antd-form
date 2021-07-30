import './css/custom.css';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import axios from 'axios';
import {lazy, Suspense, useEffect, useState} from "react";

library.add(fas, far);

// 코드 스플리팅
const SignIn = lazy(() => import('./components/user/SignIn'));
const SignUp = lazy(() => import('./components/user/SignUp'));
const MainLayout = lazy(() => import('./components/MainLayout'));
const PrivateRoute = lazy(() => import('./components/PrivateRoute'));
const Index = lazy(() => import('./components/Index'));
const UserForm = lazy(() => import('./components/user/UserForm'));
const UserList = lazy(() => import('./components/user/UserList'));

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
            <Suspense fallback={<div>Loading...</div>}>
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
                                    <PrivateRoute isLogin={isLogin} path="/user/userList" exact component={UserList}/>
                                    <Route path="/user/userForm" exact component={UserForm}/>
                                </Switch>
                            </MainLayout>
                        )}
                    />
                </Switch>
            </Suspense>
        </Router>
    );
};

export default App;
