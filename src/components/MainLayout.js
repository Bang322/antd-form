import React from 'react';
import 'antd/dist/antd.min.css';
import { Layout } from "antd";
import Sidebar from "./sidebar/Sidebar";

const { Header, Content, Footer } = Layout;

const MainLayout = ({ children }) => {
    return (
        <div className="layout">
            <Header
                className="header"
            >
                <div className="logo">관리자 페이지</div>
            </Header>
            <Sidebar />
            <Content
                style={{ padding : 24, minHeight: 'calc(100vh - 98px)' }}
                className="content"
            >
                {children}
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