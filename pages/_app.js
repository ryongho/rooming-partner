import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Layout, Menu } from 'antd'
import { UserOutlined, ScheduleOutlined, ShoppingCartOutlined, FormOutlined, ShopOutlined, SettingOutlined, BarChartOutlined, RightCircleFilled } from '@ant-design/icons'
import Header from '../components/organism/Header'

const GlobalStyle = createGlobalStyle`
    html, body {
        margin: 0;
        padding: 0;
    }
    * {
        box-sizing: border-box;
        // font-family : 'Noto Sans KR', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    }

    ol, ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    h1 {
        font-size: 28px;
        margin: 0;
    }

    h2 {
        font-size: 24px;
        margin: 0;
    }

    h3 {
        font-size: 18px;
        margin: 0;
    }

    p {
        margin: 0;
        font-size: 14px;
    }

    .ant-menu-inline.ant-menu-root .ant-menu-item > .ant-menu-title-content, .ant-menu-inline.ant-menu-root .ant-menu-submenu-title > .ant-menu-title-content {
        font-size: 13px;
    }
    .ant-layout-header {
        padding: 0 24px;
    }
`

const theme = {}

const MyApp = ({ Component, pageProps }) => {
    const router = useRouter();

    const [isAdmin, setIsAdmin] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [group, setGroup] = useState('예약 관리');
    const [title, setTitle] = useState('예약 목록')

    const { Sider, Content } = Layout
    const { SubMenu } = Menu

    const onMenuSelect = ({ item, key }) => {
        setGroup(item.props.group);
        setTitle(item.props.title);
        router.push(key).then(() => window.scrollTo(0,0));
    }

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0" />
                <title>루밍 관리자</title>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
            </Head>
            <GlobalStyle />
            <ThemeProvider theme={theme}>
                {router.pathname == '/' ?
                    <Component {...pageProps} />
                    :
                    (
                        <Layout style={{height: '100vh'}}>
                            <Sider theme={'light'} collapsible collapsed={collapsed} onCollapse={e => setCollapsed(e)}>
                                <LogoArea>
                                    <HeaderLogo src={'/image/logo.png'} />
                                </LogoArea>
                                <Menu defaultOpenKeys={['/reserved', '/product', '/review', '/user', '/rooms', '/board', '/stats']} theme={'light'} onSelect={onMenuSelect} defaultSelectedKeys={[router.pathname]} mode="inline">
                                    <SubMenu key="/reserved" icon={<ScheduleOutlined />} title="예약 관리">
                                        <Menu.Item key="/reserved/list" group="예약 관리" title="예약 목록">예약 목록</Menu.Item>
                                    </SubMenu>
                                    <SubMenu key="/product" icon={<ShoppingCartOutlined />} title="상품 관리">
                                        <Menu.Item key="/product/list" group="상품 관리">상품 목록</Menu.Item>
                                    </SubMenu>
                                    <SubMenu key="/review" icon={<FormOutlined />} title="리뷰 관리">
                                        <Menu.Item key="/review/list" group="리뷰 관리">리뷰 목록</Menu.Item>
                                    </SubMenu>
                                    {isAdmin &&
                                    <SubMenu key="/user" icon={<UserOutlined />} title="회원 관리">
                                        <Menu.Item key="/user/partner" group="회원 관리">파트너 목록</Menu.Item>
                                        <Menu.Item key="/user/customer" group="회원 관리">고객 목록</Menu.Item>
                                    </SubMenu>
                                    }
                                    {isAdmin &&
                                    <SubMenu key="/rooms" icon={<ShopOutlined />} title="숙소 관리">
                                        <Menu.Item key="/rooms/list" group="숙소 관리">숙소 목록</Menu.Item>
                                    </SubMenu>
                                    }
                                    {isAdmin &&
                                    <SubMenu key="/board" icon={<SettingOutlined />} title="게시판 관리">
                                        <Menu.Item key="/board/notice" group="게시판 관리">공지사항 목록</Menu.Item>
                                        <Menu.Item key="/board/faq" group="게시판 관리">FAQ 목록</Menu.Item>
                                        <Menu.Item key="/board/policy" group="게시판 관리">약관 및 정책 목록</Menu.Item>
                                    </SubMenu>
                                    }
                                    <SubMenu key="/stats" icon={<BarChartOutlined />} title="통계 관리">
                                        <Menu.Item key="/stats/list" group="통계 관리">통계 목록</Menu.Item>
                                    </SubMenu>
                                </Menu>
                            </Sider>
                            <Layout>
                                <Header title={group} />
                                <Content>
                                    <ContentTitle>
                                        <RightCircleFilled style={{color: "#F57D6A", fontSize: '11px', backgroundColor: '#fff', borderRadius: '100%'}} /> {title}
                                    </ContentTitle>
                                    <ContentWrap>
                                        <Component {...pageProps} />
                                    </ContentWrap>
                                </Content>
                            </Layout>
                        </Layout>
                    )
                }
            </ThemeProvider>
        </>
    )
}

const LogoArea = styled.div`
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #f0f0f0;
`

const HeaderLogo = styled.img`
    width: 97px;
`

const ContentTitle = styled.div`
    padding: 15px 26px;
    color: #666;
`

const ContentWrap = styled.div`
    padding: 0 26px;
`

export default MyApp
