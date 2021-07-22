import React from 'react';
import {Route, Redirect} from "react-router-dom";

const PrivateRoute = ({ component : Component, isLogin, ...props }) => {
    // axios 디폴트 설정의 header 부분에 accessToken 이 담겨있으면 현재 로그인 상태임
    // accessToken 이 담겨있지 않다면, 로그인 페이지(/signIn)로 redirect 시킴
    return (
        <Route
            {...props}
            render = {props =>
                isLogin
                    ? <Component {...props} isLogin={isLogin} />
                    :
                    <Redirect
                        to={{
                            pathname : '/signIn',
                            state : { from : props.location}
                        }}
                    />
            }
        />
    );
};

export default PrivateRoute;