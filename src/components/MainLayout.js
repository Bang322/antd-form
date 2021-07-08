import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.min.css';
import {Layout, Menu, Drawer, Button} from "antd";
import { debounce } from "lodash";


const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

const MainLayout = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [collapsed, setCollapsed] = useState(true);

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
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="layout">
            <Header
                style={{ padding : 0, height : 55 }}
                className="header"
            >
                {isMobile && <div><Button onClick={() => setCollapsed(!collapsed)}>토글 버튼</Button></div>}
            </Header>
            <Drawer
                placement="left"
                visible={collapsed}
                className="sidebar"
                closable={false}
                onClose={() => setCollapsed(false)}
                width={220}
                bodyStyle={{ padding : 0 }}
                mask={isMobile}
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