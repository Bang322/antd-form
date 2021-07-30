import React, {useEffect, useRef, useState} from 'react';
import axios from "../../lib/authAxios";
import {Button, Input, Space, Table} from "antd";
import Highlighter from 'react-highlight-words';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
    const initialSearchData = {
        searchText : '',
        searchedColumn : ''
    };
    const [searchData, setSearchData] = useState(initialSearchData);
    const searchInput = useRef(null);
    console.log(searchData);
    const getColumnSearchProps = dataIndex => ({
        filterDropdown : ({ selectedKeys, setSelectedKeys, confirm, clearFilters }) => (  // 필터 커스터마이징
            <div style={{ padding : 8 }}>
                <Input
                    ref={input => searchInput.current = input}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom : 8, display : 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<FontAwesomeIcon icon={['fas', 'search']}/>}
                        style={{ width : 90 }}
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    >
                        검색
                    </Button>
                    <Button
                        size="small"
                        style={{ width : 90 }}
                        onClick={() => handleReset(clearFilters)}
                    >
                        초기화
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown : false });
                            setSearchData({
                                ...searchData,
                                searchText : selectedKeys[0],
                                searchedColumn : dataIndex
                            });
                        }}
                    >
                        필터
                    </Button>
                </Space>
            </div>
        ),
        filterIcon : filtered => <FontAwesomeIcon icon={['fas', 'search']} style={{ color : filtered ? '#1890ff' : null }} />,  // 헤더의 필터 아이콘 설정
        onFilter : (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        // setTimeout 을 줘야 searchInput.current 값을 참조 가능
        // timeout 시간값을 주지 않으면 최대한 빨리 실행하라는 뜻 (바로 실행되는 것이 아님. 비동기적 실행이라고 볼 수 있음)
        onFilterDropdownVisibleChange : visible => visible && setTimeout(() => searchInput.current.select()),
        render : text =>
            searchData.searchedColumn === dataIndex
                ?
                    <Highlighter  // 검색 단어에 하이라이팅을 해주는 컴포넌트 (react-highlight-words)
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchData.searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                : text
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchData({
            searchText : selectedKeys[0],
            searchedColumn : dataIndex
        });
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchData(initialSearchData);
    }

    const columns = [
        {
            title : '아이디',
            dataIndex : 'user_id',
            width : 300,
            sorter : (a, b) => {
                // 대소문자 구분 하지 않고 정렬
                const aLow = a.user_id.toLowerCase();
                const bLow = b.user_id.toLowerCase();
                return (aLow < bLow) ? -1 : (aLow === bLow) ? 0 : 1
            },
            ...getColumnSearchProps('user_id')
        },
        {
            title : '이름',
            dataIndex : 'name',
            width : 250,
            ...getColumnSearchProps('name')
        },
        {
            title : '생년월일',
            dataIndex : 'birth',
            width : 200,
            responsive: ['md'],
            ...getColumnSearchProps('birth')
        },
        {
            title : '성별',
            dataIndex : 'gender',
            width : 150,
            responsive: ['md'],
            render : text => text === 'male' ? '남자' : '여자'
        },
        {
            title : '이메일',
            dataIndex : 'email',
            responsive: ['md'],
            ...getColumnSearchProps('email')
        }
    ];

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
            pagination={{  // pagination 설정
                position : ['bottomRight'],
                defaultPageSize : 10,
                size : 'small'
            }}
            // bordered 속성을 추가하면 테이블과 각 컬럼에 border 가 생긴다
            onRow={(record, rowIndex) => ({  // 각 row 에 이벤트 설정
                onClick : e => {
                    console.log(record.address);
                }
            })}
            expandable={{
                expandedRowRender : record => <span>주소 : {record.address}</span>,
                rowExpandable : record => record.address
            }}
        />
    );
};

export default UserList;