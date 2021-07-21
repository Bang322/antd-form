import React from 'react';
import {Button} from "antd";
import authAxios from "../../lib/authAxios";
import axios from "axios";

const UserList = () => {
    const onClick = async () => {
        try {
            const res = await authAxios.get('http://localhost:3001/user/getUserInfoList');
            const { success, result } = res.data;
            if (success) console.log(result);
        } catch (error) {
            console.log(error.response.data);
        }
    }

    return (
        <div>
            <Button type="primary" onClick={onClick}>api 테스트</Button>
        </div>
    );
};

export default UserList;