import React, { useState, useEffect } from 'react';
import {Drawer, Menu} from "antd";
import {debounce} from "lodash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import menus from "./menus";
import {Link, useLocation } from "react-router-dom";

const { SubMenu } = Menu;

const Sidebar = () => {
    const pathname = useLocation().pathname;
    const [isMobile, setIsMobile] = useState(false);   // 현재 화면이 모바일인지 데스크탑인지 나타내주는 상태값
    const [collapsed, setCollapsed] = useState(false);  // 사이드바의 접힘과 펼침 상태
    const [defaultKey, setDefaultKey] = useState({
        openKey : '',
        selectKey : ''
    });
    const [currentPath, setCurrentPath] = useState('');

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
        <Drawer
            placement="left"    // 사이드바 위치 설정
            visible={collapsed} // 사이드바의 접힘과 펼쳐짐 여부
            className="sidebar"
            closable={false}    // 사이드바 오른쪽 상단에 닫기 버튼 표시 여부
            onClose={() => setCollapsed(false)}
            width={220}
            // 모바일 화면일 때만 사이드바를 접고 펼칠 수 있는 핸들러 렌더링
            handler={isMobile ?
                <div className="drawer-handle" onClick={() => setCollapsed(!collapsed)}>
                    <i className="drawer-handle-icon" />
                </div>
                : null
            }
            bodyStyle={{ padding : 0 }}  // 사이드바의 아이템들을 담고있는 body 스타일 설정 -> 기본 패딩 삭제
            mask={isMobile}  // 사이드바가 펼쳐질 때, 화면이 어두워지는 마스크 효과 설정 여부 -> 모바일 화면에서만 설정
        >
            <Menu
                mode="inline"
                defaultOpenKeys={[defaultKey.openKey]}
                defaultSelectedKeys={[defaultKey.selectKey]}
            >
                {menus.map((menu, index) =>
                    menu.children ? (
                        <SubMenu
                            key={`parent${index}`}
                            title={menu.title}
                            icon={ <FontAwesomeIcon className="menu-icon" icon={menu.icon}/> }
                        >
                            {menu.children.map((subMenu, subIndex) => {
                                if (currentPath === '') {
                                    if (subMenu.path === pathname) {
                                        setDefaultKey({
                                            openKey : `parent${index}`,
                                            selectKey : `parent${index}-children${subIndex}`
                                        });
                                        setCurrentPath(subMenu.pathname);
                                    }
                                }
                                return (
                                    <Menu.Item key={`parent${index}-children${subIndex}`}>
                                        <Link to={subMenu.path}>{subMenu.title}</Link>
                                    </Menu.Item>
                                )}
                            )}
                        </SubMenu>
                    ) : (
                        <Menu.Item
                            key={`parent${index}`}
                            icon={ <FontAwesomeIcon className="menu-icon" icon={menu.icon}/> }
                        >
                            <Link to={menu.path}>{menu.title}</Link>
                        </Menu.Item>
                    )
                )}
            </Menu>
        </Drawer>
    );
};

export default Sidebar;