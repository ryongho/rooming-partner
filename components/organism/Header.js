import { Layout, Dropdown, Menu, Button } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useRouter } from 'next/router'


const Header = ({ title }) => {

    const router = useRouter();

    const onLogout = () => {
        router.push('/');
    }

    const menu = (
        <Menu>
            <Menu.Item>
                <List onClick={()=>{router.push('/')}}>내 정보</List>
            </Menu.Item>
        </Menu>
    )

    return (
        <Wrapper>
            <Title>{title}</Title>
            <RightSide>
                <Dropdown overlay={menu}>
                    <User>
                        <Name>{'루밍'} 님</Name>
                        <Email>(test@rooming.com) <CaretDownOutlined /></Email>
                    </User>
                </Dropdown>
                <Logout type={'default'} size={'small'} onClick={onLogout}>
                    로그아웃
                </Logout>
            </RightSide>
        </Wrapper>
    )
}

const Wrapper = styled(Layout.Header)`
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #fff;
    box-shadow: 3px 2px 11px rgb(0 0 0 / 8%);
`
const Title = styled.h1`
    font-size: 18px;
    font-weight: bold;
`
const RightSide = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const User = styled.div`
    display: flex;
    align-items: center;
    line-height: 1.4;
    margin-right: 10px;
    cursor: pointer;
`
const List = styled.div`
`
const Name = styled.div`
    font-size: 12px;
    color: #666;
`
const Email = styled.div`
    font-size: 10px;
    color: #999;
`
const Logout = styled(Button)`
    font-size: 12px;
`

export default Header