import React, {useEffect, useState} from 'react';
import 'tui-grid/dist/tui-grid.css';
import 'tui-pagination/dist/tui-pagination.css';
import Grid from '@toast-ui/react-grid';
import axios from "../../lib/authAxios";

const columns = [
    {
        name : 'user_id',
        header : '아이디',
        resizable : true,  // true 로 설정하면 컬럼 width 값 끌어다가 조절가능
        filter : {  // 필터 기능 활성화
            type : 'text',  // text 필터
            operator : 'OR', // operator 를 설정하면 이중 필터 사용 가능 ('AND' 도 있다)
            showApplyBtn : true,
            showClearBtn : true
        }
    },
    {
        name : 'name',
        header : '이름',
        sortable : true,  // 정렬 기능 사용 여부
        sortingType : 'asc' // 정렬 시작 타입(기본값은 'asc' 이다)
    },
    {
        name : 'birth',
        header : '생년월일',
        sortable : true
    },
    {
        name : 'gender',
        header : '성별',
        formatter : ({value}) => value === 'male' ? '남자' : '여자'  // 화면에 표시할 값의 포맷을 설정
    },
    {
        name : 'email',
        header : '이메일'
    }
];


const UserList_useToastui = () => {
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
        <Grid
            data={userList}  // 데이터 설정
            columns={columns}  // 컬럼 설정
            rowHeight={25}  // 각 행의 높이 설정
            bodyHeight={100}  // Grid 바디의 높이 설정
            heightResizable={false} // height 값 변경 가능 여부
            rowHeaders={['rowNum', 'checkbox']} // 각 row 에 체크박스를 추가하거나 번호를 지정 (둘 동시에 가능)
            onCheck={ev => console.log(`check : ${ev.rowKey}`)}  // 각 레코드에 있는 체크박스 선택했을 때
            onUncheck={ev => console.log(`uncheck : ${ev.rowKey}`)}  // 각 레코드에 있는 체크박스 선택 해제했을 때
            onCheckAll={ev => console.log(ev)}  // 모든 체크박스를 선택했을 때
            onUncheckAll={ev => console.log(ev)}  // 모든 체크박스 선택 해제했을 때
            pageOptions={{  // pagination 설정
                useClient: true,  // 클라이언트 페이지네이션 활성화 (서버 x)
                perPage : 1  // 한 페이지에 보여줄 데이터 수
            }}
        />
    );
};

export default UserList_useToastui;