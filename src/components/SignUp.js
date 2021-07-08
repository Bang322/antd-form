import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.min.css';
import {Button, Form, Input, Select, Card, Checkbox, Radio, Modal, message} from "antd";
import axios from 'axios';
import moment from "moment";
import DaumPostcode from "react-daum-postcode";

// 월을 선택하는 Select 의 Option 에 사용될 배열
const monthData = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
];

const { Option } = Select;

const SignUp = () => {
    const [form] = Form.useForm();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenPost, setIsOpenPost] = useState(false);

    // isOpenModal 이 true 가 되어 모달창이 열리면, 0.2초 늦게 isOpenPost 상태값을 변경하여 DaumPostcode 컴포넌트 렌더링 함
    // 모달창이 열림과 동시에 DaumPostcode 컴포넌트를 렌더링하면 모달창이 버벅거림
    useEffect(() => {
        if (isOpenModal) {
            setTimeout(() => {
                setIsOpenPost(true);
            }, 200);
        } else {
            setIsOpenPost(false);
        }
    }, [isOpenModal])

    // Form 입력값들에 대한 validation 을 통과했을 때, 해당 함수가 실행됨
    // values 값에는 Form 에서 입력한 값들이 객체 형태로 들어있다.
    const onSubmit = async ({ userId, password, name, year, month, day, gender, email, zipCode, address, addressDetail }) => {
        // 필요한 데이터만 재조립
        const signUpData = {
            userId,
            password,
            name,
            birth : `${year}-${month}-${day}`,
            gender,
            email,
            zipCode,
            address : `${address}, ${addressDetail}`
        };
        const res = await axios.post('http://localhost:3001/user/signUp', signUpData);
        const { success } = res.data;
        if (success) message.success('회원이 되신 것을 환영합니다! 로그인 페이지로 이동합니다.');
        else message.error('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
    };

    const onCompletePost = data => {
        console.log(data);
        let fullAddress = data.address;
        let zoneCode = data.zonecode;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        // Form 의 우편번호와 주소 Input 에 받아온 값 설정
        form.setFieldsValue({
            zipCode : zoneCode,
            address : fullAddress
        });
        setIsOpenModal(false);
    };

    return (
        <div className="center-container">
            <div className="sign-up-container">
                {/*<div className="header">
                    회원가입
                </div>*/}
                <Card title="회원가입">
                    <div className="content">
                        <Form
                            form={form}
                            name="signUpForm"
                            layout="vertical"   // label 과 input 이 수직으로 놓여진다.
                            onFinish={onSubmit} // html form 의 onSubmit 을 antd 의 Form 에서는 onFinish 로 사용
                        >
                            <Form.Item
                                name="userId"
                                label="아이디"
                                rules={[
                                    {
                                        required : true,
                                        message : '필수 정보입니다.'
                                    },
                                    {
                                        pattern : /^[a-zA-Z0-9]{4,12}$/,
                                        message : '4~12자의 영문 대소문자, 숫자만 사용 가능합니다.'
                                    },
                                    {
                                        // 해당 Input 에서 포커스가 떠날 때, 빈값과 입력값을 다시 한번 검사한 뒤 서버에 요청하여 아이디 중복 체크
                                        // 빈값 검사나 정규식 검사처럼 입력값이 변할 때마다 중복 체크를 하면 매번 서버에 요청을 하므로 비효율적임
                                        validator : async (rule, value) => {
                                            const regExp = /^[a-zA-Z0-9]{4,12}$/;
                                            if (value && value.match(regExp)) {
                                                const res = await axios.post('http://localhost:3001/user/checkUserId', { userId : value });
                                                const { success } = res.data;
                                                return success ? Promise.resolve() : Promise.reject(new Error('이미 사용중인 아이디입니다.'));
                                            }
                                        },
                                        validateTrigger : 'onBlur'  // 해당 validator 를 실행하는 시점을 onBlur 로 설정 (기본값은 onChange 이다)
                                    }
                                ]}
                                // validator 의 validateTrigger 를 설정하기 위해서는 Form.Item 의 속성으로 validateTrigger 값을 설정해줘야 한다.
                                // 배열 값으로 onChange 는 기본값이므로 반드시 필요하고, 추가적으로 onBlur 를 설정해준다
                                validateTrigger={['onChange', 'onBlur']}
                            >
                                <Input autoComplete="off" placeholder="아이디를 입력해주세요." allowClear />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="비밀번호"
                                hasFeedback  // 유효성 검사에 따른 결과값을 Input 박스 안의 오른쪽에 아이콘으로 표시해준다.
                                rules={[
                                    {
                                        required : true,
                                        message : '필수 정보입니다.'
                                    },
                                    {
                                        pattern : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{4,12}$/,
                                        message : '4~12자이며, 영문 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.'
                                    }
                                ]}
                            >
                                <Input.Password placeholder="비밀번호를 입력해주세요." />
                            </Form.Item>
                            <Form.Item
                                name="checkPassword"
                                label="비밀번호 확인"
                                hasFeedback
                                dependencies={['password']} // 비밀번호가 변경됐을 때, 해당 Input 의 유효성 검사가 다시 실행된다.
                                rules={[
                                    {
                                        required : true,
                                        message : '필수 정보입니다.'
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
                                        }
                                    })
                                ]}
                            >
                                <Input.Password placeholder="비밀번호를 다시 한번 입력해주세요."/>
                            </Form.Item>
                            <Form.Item
                                name="name"
                                label="이름"
                                rules={[
                                    {
                                        required : true,
                                        message : '필수 정보입니다.'
                                    }
                                ]}
                            >
                                <Input placeholder="이름을 입력해주세요." />
                            </Form.Item>
                            <Form.Item
                                label="생년월일"
                                required  // label 왼쪽에 빨간 * 마크가 생김 -> 필수 정보임을 나타냄
                                style={{ marginBottom : 0 }}
                            >
                                <Form.Item
                                    name="year"
                                    style={{ display : 'inline-block', width : 'calc(33% - 10px)'}}
                                    rules={[
                                        {
                                            validator : (rule, value) => {
                                                const regExp = /^[0-9]{4,}$/;
                                                if (!value) return Promise.reject(new Error('필수 정보입니다.'));
                                                if (value && !value.match(regExp)) return Promise.reject(new Error('4자리 숫자만 입력 가능합니다.'));

                                                // 현재 년보다 높은 값(미래 값)을 입력하면 에러 발생
                                                if (value.length === 4) {
                                                    const year = moment(value, 'YYYY');
                                                    const nowYear = moment();
                                                    const diff = nowYear.diff(year);
                                                    if (diff < 0) return Promise.reject(new Error('다시 입력해주세요.'));
                                                }
                                                return Promise.resolve();
                                            }
                                        }
                                    ]}
                                >
                                    <Input maxLength={4} placeholder="년(4자)" autoComplete="off" />
                                </Form.Item>
                                <Form.Item
                                    name="month"
                                    style={{ display : 'inline-block', width : 'calc(33% - 10px)', margin : '0 17px'}}
                                    rules={[
                                        {
                                            required : true,
                                            message : '필수 정보입니다.'
                                        }
                                    ]}
                                >
                                    <Select
                                        placeholder="월"
                                    >
                                        {monthData.map((month, index) =>
                                            <Option
                                                value={String(month).length < 2 ? `0${month}` : month}
                                                key={index}
                                            >
                                                {`${month}월`}
                                            </Option>

                                        )}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="day"
                                    dependencies={['year', 'month']}
                                    style={{ display : 'inline-block', width : 'calc(33% - 10px)'}}
                                    rules={[
                                        ({ getFieldValue, getFieldError }) => ({
                                            validator(rule, value) {
                                                const regExp = /^[0-9]{1,2}$/;
                                                if (!value) return Promise.reject(new Error('필수 정보입니다.'));
                                                if (value && !value.match(regExp)) return Promise.reject(new Error('숫자만 입력 가능합니다.'));

                                                if (!getFieldError('year').length && !getFieldError('month').length &&
                                                    getFieldValue('year') && getFieldValue('month')) {
                                                    const year = getFieldValue('year');
                                                    const month  = getFieldValue('month');
                                                    const birth = moment(`${year}-${month}-${value}`);
                                                    if (!birth.isValid()) return Promise.reject(new Error('다시 입력해주세요.'));

                                                    return Promise.resolve();
                                                }
                                            }
                                        })
                                    ]}
                                >
                                    <Input maxLength={2} placeholder="일" />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item
                                name="gender"
                                label="성별"
                                rules={[
                                    {
                                        required : true,
                                        message : '필수 정보입니다.'
                                    }
                                ]}
                            >
                                <Radio.Group>
                                    <Radio.Button value="male">남자</Radio.Button>
                                    <Radio.Button value="female">여자</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="이메일"
                                rules={[
                                    {
                                        type : 'email',
                                        message : '이메일 형식에 맞지 않습니다.'
                                    }
                                ]}
                            >
                                <Input placeholder="이메일을 입력해주세요." allowClear />
                            </Form.Item>
                            <Form.Item
                                label="주소"
                                required
                                style={{ marginBottom : 0 }}
                            >
                                <Form.Item
                                    style={{ marginBottom : '5px' }}
                                >
                                    <Form.Item
                                        name="zipCode"
                                        style={{ display : 'inline-block', width : 'calc(75% - 5px)', margin : '0 10px 0 0' }}
                                        rules={[
                                            {
                                                required : true,
                                                message : '필수 정보입니다.'
                                            }
                                        ]}
                                    >
                                        <Input autoComplete="off" placeholder="우편번호" readOnly />
                                    </Form.Item>
                                    <Button
                                        style={{ width : 'calc(25% - 5px' }}
                                        onClick={() => setIsOpenModal(true)}
                                    >
                                        주소 찾기
                                    </Button>
                                </Form.Item>
                                <Form.Item
                                    name="address"
                                    style={{ marginBottom : '5px' }}
                                    rules={[
                                        {
                                            required : true,
                                            message : '필수 정보입니다.'
                                        }
                                    ]}
                                >
                                    <Input autoComplete="off" placeholder="주소" readOnly />
                                </Form.Item>
                                <Form.Item
                                    name="addressDetail"
                                    rules={[
                                        {
                                            required : true,
                                            message : '필수 정보입니다.'
                                        }
                                    ]}
                                >
                                    <Input autoComplete="off" placeholder="상세주소" />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item
                                name="agreement"
                                valuePropName="checked"
                                rules={[
                                    {
                                        validator : (rule, value) =>
                                            value ? Promise.resolve() : Promise.reject(new Error('약관에 동의해주세요.'))
                                    }
                                ]}
                            >
                                <Checkbox>
                                    <a href="">약관</a>에 동의합니다.
                                </Checkbox>
                            </Form.Item>
                            <Button
                                type="primary"  // 버튼의 종류
                                htmlType="submit" // html 문법에서의 type 을 htmlType 으로 사용
                                style={{ float : 'right' }}
                            >
                                등록
                            </Button>
                        </Form>
                    </div>
                </Card>
                <Modal
                    title="주소 찾기"
                    visible={isOpenModal}
                    bodyStyle={{ height : '448px' }}
                    footer={null}  // 모달 footer 제거
                    onCancel={() => setIsOpenModal(false)}
                >
                    {isOpenPost && <DaumPostcode onComplete={onCompletePost}/>}
                </Modal>
            </div>
        </div>
    );
};

export default SignUp;