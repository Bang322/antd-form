const menus = [
    {
        title : '사용자 관리',
        icon : ['far', 'user'],
        children : [
            {
                path : '/user/userList',
                title : '사용자 목록'
            },
            {
                path : '/user/userForm',
                title : '사용자 상세'
            }
        ]
    },
    {
        title : '게시판 관리',
        icon : ['far', 'clipboard'],
        children : [
            {
                path : '/board/boardList',
                title : '게시판 목록'
            },
            {
                path : '/board/boardForm',
                title : '게시판 상세'
            }
        ]
    },
    {
        path : '/fileUpload',
        title : '파일 업로드',
        icon : ['far', 'file']
    }
]

export default menus;