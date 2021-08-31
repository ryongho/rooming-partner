import { useState, useEffect } from "react"
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { Card, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

const Login = () => {

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');

    const onLogin = () => {
        if (!email || !pw) {
            return message.warning('이메일 또는 비밀번호를 입력해 주세요.')
        }

        router.push('/reserved/list')
    }

    return(
        <Wrapper>
            <LoginBox>
                <Logo src="/image/logo.png" />
                <Title>루밍 관리자 페이지</Title>
                <InputStyle 
                prefix={<UserOutlined />} 
                onChange={e=> setEmail(e.target.value)}
                placeholder="관리자 이메일" />
                <InputStyle 
                prefix={<LockOutlined />} 
                type="password" 
                onChange={e=> setPw(e.target.value)}
                placeholder="비밀번호" />

                <LoginBtn type={"primary"} onClick={onLogin}>로그인</LoginBtn>
            </LoginBox>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff5f4
`
const LoginBox = styled(Card)`
    padding: 30px 60px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 10px;

    .ant-card-body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`
const Logo = styled.img`
    width: 200px;
`

const Title = styled.h1`
    margin: 3px 0 20px;
    font-size: 13px;
    color: #666;
    text-align: center;
    font-weight: normal;
`
const InputStyle = styled(Input)`
    margin-bottom: 5px;
    border-radius: 5px;

`
const LoginBtn = styled(Button)`
    display: block;
    width: 100%;
    margin-top: 15px;
`

export default Login