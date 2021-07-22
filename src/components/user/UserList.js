import React, {useEffect, useState} from 'react';
import axios from "../../lib/authAxios";
import {Table} from "antd";

const columns = [
    {
        title : '아이디',
        dataIndex : 'user_id',
        sorter : (a, b) => {
            const aLow = a.user_id.toLowerCase();
            const bLow = b.user_id.toLowerCase();
            return (aLow < bLow) ? -1 : (aLow === bLow) ? 0 : 1
        }
    },
    {
        title : '이름',
        dataIndex : 'name'
    },
    {
        title : '생년월일',
        dataIndex : 'birth'
    },
    {
        title : '성별',
        dataIndex : 'gender',
        render : text => text === 'male' ? '남자' : '여자'
    },
    {
        title : '이메일',
        dataIndex : 'email'
    }
];

// 테이블 첫 번째 열에 checkbox 생성
const rowSelection = {
    type : 'checkbox',
    // 생성한 checkbox 에 onChange 이벤트 설정
    onChange : (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
};

const UserList = () => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/user/getUserInfoList')
            .then(({ data : { success, result }}) => {
                if (success) setUserList(userList => result);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    return (
        <Table
            columns={columns}
            dataSource={userList}
            rowKey={record => record.user_id}
            size="middle"
            rowSelection={rowSelection}
            showSorterTooltip={false}
        />
    );
};

export default UserList;