import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.min.css';
import {Layout, Menu, Drawer, Button} from "antd";
import { debounce } from "lodash";


const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

const MainLayout = () => {
    const [isMobile, setIsMobile] = useState(false);   // 현재 화면이 모바일인지 데스크탑인지 나타내주는 상태값
    const [collapsed, setCollapsed] = useState(false);  // 사이드바의 접힘과 펼침 상태

    const handleResize = debounce(() => {
        if (window.innerWidth <= 768) {
            setIsMobile(true);
            setCollapsed(false);
        }
        else {
            setIsMobile(false);
            setCollapsed(true);
        }
    }, 100);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="layout">
            <Header
                style={{ padding : 0, height : 55 }}
                className="header"
            >
            </Header>
            <Drawer
                placement="left"
                visible={collapsed}  // 사이드바의 접힘과 펼쳐짐 여부
                className="sidebar"
                closable={false}     // 사이드바 오른쪽 상단에 닫기 버튼 표시 여부
                onClose={() => setCollapsed(false)}
                width={220}
                // 모바일 화면일 때만 사이드바를 접고 펼칠 수 있는 핸들러 렌더링
                handler={isMobile ?
                    <div className="drawer-handle" onClick={() => setCollapsed(!collapsed)}>
                        <i className="drawer-handle-icon" />
                    </div>
                    : null
                }
                bodyStyle={{ padding : 0 }}
                mask={isMobile}  // 사이드바가 펼쳐질 때, 화면이 어두워지는 마스크 효과 설정 여부 -> 모바일 화면에서만 설정
            >
                <Menu
                    mode="inline"
                >
                    <SubMenu key="sub1" title="메뉴1">
                        <Menu.Item key="1">메뉴1 - 서브1</Menu.Item>
                        <Menu.Item key="2">메뉴1 - 서브2</Menu.Item>
                        <Menu.Item key="3">메뉴1 - 서브3</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" title="메뉴2">
                        <Menu.Item key="4">메뉴2 - 서브1</Menu.Item>
                        <Menu.Item key="5">메뉴2 - 서브2</Menu.Item>
                        <Menu.Item key="6">메뉴2 - 서브3</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="7">
                        메뉴3
                    </Menu.Item>
                </Menu>
            </Drawer>
            <Content
                style={{ padding : 24, minHeight: 'calc(100vh - 98px)' }}
                className="content"
            >
                <div>내용 들어가는 곳</div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                    padding : '10px 0',
                    borderTop : '1px solid #c6ced563',
                    backgroundColor : '#fff'
                }}
                className="footer"
            >
                antd 적용한 템플릿 만드는 중...
            </Footer>
        </div>
    );
};

export default MainLayout;