import React from 'react';
import {Button, Card, Checkbox, Form, Input, message} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link, Redirect} from "react-router-dom";
import axios from 'axios';

const SignIn = ({ location, isLogin, setIsLogin }) => {
    const onSubmit = async values => {
        const res = await axios.post('http://localhost:3001/user/signIn', values);
        const { success, accessToken } = res.data;

        if (success) {
            message.success('환영합니다.', 2);
            // 앞으로 axios 로 서버와 통신할 때마다 헤더에 accessToken 담아 보내도록 설정
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            setIsLogin(true);
        } else {
            message.error('로그인 실패');
        }
    };

    const { from } = location.state ? location.state : { from : { pathname : '/' } };
    if (isLogin) {
        return <Redirect to={from}/>;
    }

    return (
        <div className="center-container">
            <div className="sign-in-container">
                <Card title="로그인">
                    <div className="content">
                        <Form
                            name="signInForm"
                            layout="vertical"
                            requiredMark={false}
                            initialValues={{
                                'rememberMe' : false
                            }}
                            onFinish={onSubmit}
                        >
                            <Form.Item
                                name="userId"
                                label="아이디"
                                rules={[
                                    {
                                        required : true,
                                        message : '필수 정보입니다.'
                                    }
                                ]}
                            >
                                <Input
                                    prefix={<FontAwesomeIcon className="login-form-icon" icon={['fas', 'user']} />}
                                    autoComplete="off"
                                    placeholder="아이디를 입력해주세요."
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="비밀번호"
                                rules={[
                                    {
                                        required : true,
                                        message : '필수 정보입니다.'
                                    }
                                ]}
                            >
                                <Input.Password
                                    prefix={<FontAwesomeIcon className="login-form-icon" icon={['fas', 'lock']}/>}
                                    autoComplete="off"
                                    placeholder="비밀번호를 입력해주세요."
                                />
                            </Form.Item>
                            <Form.Item
                                name="rememberMe"
                                valuePropName="checked"
                            >
                                <Checkbox>
                                    자동 로그인
                                </Checkbox>
                            </Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ float : 'right' }}
                            >
                                로그인
                            </Button>
                        </Form>
                    </div>
                </Card>
                <div
                    style={{
                        color : '#b1b1b1',
                        textAlign : 'center',
                        marginTop : '10px',
                        fontSize : '13px'
                    }}
                >
                    아직 회원이 아니신가요? <Link to="/signUp">여기</Link>를 눌러 회원가입을 해보세요.
                </div>
            </div>
        </div>
    );
};

export default SignIn;