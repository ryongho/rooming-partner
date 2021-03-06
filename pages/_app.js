import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Layout, Menu } from 'antd'
import { UserOutlined, ScheduleOutlined, ShoppingCartOutlined, FormOutlined, ShopOutlined, SettingOutlined, BarChartOutlined, RightCircleFilled, ClearOutlined } from '@ant-design/icons'
import Header from '../components/organism/Header'
import 'moment/locale/ko'
import { StoreProvider } from '../store/StoreProvider'
import Link from 'next/link'


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
    .ant-layout {
        background: #f1f0f0
    }
    .ant-descriptions-header {
        margin-bottom: 10px;
    }
    .ant-checkbox + span {
        padding: 5px 8px;
    }
`

const theme = {}

const MyApp = ({ Component, pageProps }) => {
    const router = useRouter();

    const [isAdmin, setIsAdmin] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [group, setGroup] = useState('숙소 관리');
    const [title, setTitle] = useState('숙소 목록')

    const { Sider, Content } = Layout
    const { SubMenu } = Menu

    const onMenuSelect = ({ item, key }) => {
        // console.log(item, key)
        // if(key == '/reserved/list' ||
        // key == '/review/list' ||
        // key == '/stats/list' ||
        // key == '/user/partner/list' ||
        // key == '/user/customer/list') return;
        setGroup(item.props.group);
        setTitle(item.props.title);
        router.push(key).then(() => window.scrollTo(0,0));
    }

    useEffect(() => {
        setIsAdmin(localStorage.getItem('rmaauth') == 1 ? false : true)
        // setIsAdmin(localStorage.getItem('rmaauth') == 1 ? true : false)
        if(isAdmin) {
            setGroup('회원 관리')
            setTitle('파트너 목록')
        }
    }, [])


    // 페이지 상단 타이틀명 설정
    useEffect(() => {
        if (router.pathname.indexOf('/user/') !== -1) {
            setTitle('파트너 상세')
            setGroup('회원 관리')
        }
        if (router.pathname == '/user/partner/list') setTitle('파트너 목록')
        if (router.pathname == '/user/customer/list') setTitle('고객 목록')
        if (router.pathname == '/user/customer/[pid]') setTitle('고객 상세')
        
        if (router.pathname.indexOf('/hotel/') !== -1) setGroup('숙소 관리')
        if (router.pathname == '/hotel/write') setTitle('숙소 등록')
        if (router.pathname == '/hotel/list') setTitle('숙소 목록')
        if (router.pathname == '/hotel/[pid]') setTitle('숙소 상세')

        if (router.pathname.indexOf('/rooms/') !== -1) setGroup('객실 관리')
        if (router.pathname == '/rooms/write') setTitle('객실 등록')
        if (router.pathname == '/rooms/list') setTitle('객실 목록')
        if (router.pathname == '/rooms/[pid]') setTitle('객실 상세')

        if (router.pathname.indexOf('/goods/') !== -1) setGroup('상품 관리')
        if (router.pathname == '/goods/write') setTitle('상품 등록')
        if (router.pathname == '/goods/list') setTitle('상품 목록')
        if (router.pathname == '/goods/[pid]') setTitle('상품 상세')
        if (router.pathname == '/goods/quantity/[pid]') setTitle('상품 재고수량')

        if (router.pathname.indexOf('/reserved/') !== -1) setGroup('예약 관리')
        if (router.pathname == '/reserved/list') setTitle('예약 목록')
        if (router.pathname == '/reserved/[pid]') setTitle('예약 상세')

        if (router.pathname == '/review/list') setTitle('리뷰 목록')
        if (router.pathname == '/stats/list') setTitle('통계 목록')
    }, [router])


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
                {router.pathname == '/' || router.pathname == '/join' ?
                    <StoreProvider {...pageProps}>
                        <Component {...pageProps} />
                    </StoreProvider>
                    :
                    (
                        <Layout style={{minHeight: '100vh'}}>
                            <Sider theme={'light'} collapsible collapsed={collapsed} onCollapse={e => setCollapsed(e)} style={{height: '100vh', overflowY: 'auto'}}>
                                <LogoArea>
                                    <HeaderLogo src={'/image/logo.png'} />
                                </LogoArea>
                                <Menu defaultOpenKeys={['/user', '/goods', '/hotel', '/rooms']} theme={'light'} onSelect={onMenuSelect} defaultSelectedKeys={isAdmin ? ['/user/partner/list'] : [router.pathname]} mode="inline">
                                    <SubMenu key="/user" icon={<UserOutlined />} title="회원 관리">
                                        <Menu.Item key="/user/partner/list" group="회원 관리" title="파트너 목록"><Link href="/user/partner/list">파트너 목록</Link></Menu.Item>
                                        {isAdmin && <Menu.Item key="/user/customer/list" group="회원 관리" title="고객 목록">고객 목록</Menu.Item>}
                                    </SubMenu>
                                    <SubMenu key="/hotel" icon={<ShopOutlined />} title="숙소 관리">
                                        <Menu.Item key="/hotel/list" group="숙소 관리" title="숙소 목록"><Link href="/hotel/list">숙소 목록</Link></Menu.Item>
                                    </SubMenu>
                                    <SubMenu key="/rooms" icon={<ClearOutlined />} title="객실 관리">
                                        <Menu.Item key="/rooms/list" group="객실 관리" title="객실 목록"><Link href="/rooms/list">객실 목록</Link></Menu.Item>
                                    </SubMenu>
                                    <SubMenu key="/goods" icon={<ShoppingCartOutlined />} title="상품 관리">
                                        <Menu.Item key="/goods/list" group="상품 관리" title="상품 목록"><Link href="/goods/list">상품 목록</Link></Menu.Item>
                                    </SubMenu>
                                    <SubMenu key="/reserved" icon={<ScheduleOutlined />} title="예약 관리">
                                        <Menu.Item key="/reserved/list" group="예약 관리" title="예약 목록"><Link href="/reserved/list">예약 목록</Link></Menu.Item>
                                    </SubMenu>
                                    {/* <SubMenu key="/review" icon={<FormOutlined />} title="리뷰 관리">
                                        <Menu.Item key="/review/list" group="리뷰 관리" title="리뷰 목록"><Link href="/review/list">리뷰 목록</Link></Menu.Item>
                                    </SubMenu>
                                    {isAdmin &&
                                    <SubMenu key="/board" icon={<SettingOutlined />} title="게시판 관리">
                                        <Menu.Item key="/board/notice/list" group="게시판 관리" title="공지사항 목록"><Link href="/board/notice/list">공지사항 목록</Link></Menu.Item>
                                        <Menu.Item key="/board/faq/list" group="게시판 관리" title="FAQ 목록"><Link href="/board/faq/list">FAQ 목록</Link></Menu.Item>
                                        <Menu.Item key="/board/policy/list" group="게시판 관리" title="약관 및 정책 목록"><Link href="/board/policy/list">약관 및 정책 목록</Link></Menu.Item>
                                    </SubMenu>
                                    }
                                    <SubMenu key="/stats" icon={<BarChartOutlined />} title="통계 관리">
                                        <Menu.Item key="/stats/list" group="통계 관리" title="통계 목록"><Link href="/stats/list">통계 목록</Link></Menu.Item>
                                    </SubMenu> */}
                                </Menu>
                            </Sider>

                            <Layout style={{height: '100vh', overflowY: 'auto'}}>
                                <StoreProvider {...pageProps}>
                                    <Header title={group} />
                                    <Content>
                                        <ContentTitle>
                                            <RightCircleFilled style={{color: "#F57D6A", fontSize: '11px', backgroundColor: '#fff', borderRadius: '100%'}} /> {title}
                                        </ContentTitle>
                                        <ContentWrap>
                                            <Component {...pageProps} />
                                        </ContentWrap>
                                    </Content>
                                </StoreProvider>
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