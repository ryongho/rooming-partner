import { useState, useEffect } from "react"
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { Card, Input, Button, message, Modal, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/StoreProvider'

const Login = observer(() => {

    const router = useRouter();
    const { user } = useStore()

    const [email, setEmail] = useState('');
    // const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    // const [idFind, setIdFind] = useState('');

    // const [showFindId, setShowFindId] = useState(false)
    const [showFindPassword, setShowFindPassword] = useState(false)

    // const [resultId, setResultId] = useState('')
    const [resultPw, setResultPw] = useState('')

    const onLogin = async () => {
        if (!email || !pw) {
            return message.warning('이메일 또는 비밀번호를 입력해 주세요.')
        }
        
        const data = {
            email: email,
            password: pw
        }

        await user.login(data, (success, result) => {
            if (success) {
                if (result.status == 200) {
                    router.push('/user/partner/list')
                } else {
                    message.error(`${result.msg}입니다`)
                }
            }
        })
    }

    // const onFindId = () => {
    //     if (email) {
    //         setResultId(`회원님의 아이디는 ${"rooming1234"} 입니다.`)
    //     } else {
    //         // 입력한 이메일 정보가 없을 경우
    //         setResultId("입력하신 이메일과 일치하는 아이디가 존재하지 않습니다.")
    //     }
    // }

    const onFindPw = () => {
        if (email) {
            setResultPw(`이메일 ${email}로 임시 비밀번호가 발급되었습니다.`)
        } else {
            // 입력한 이메일 정보가 없을 경우
            setResultPw("입력하신 이메일과 일치하는 아이디가 존재하지 않습니다.")
        }
    }

    return(
        <Wrapper>
            <LoginBox>
                <Logo src="/image/logo.png" />
                <Title>루밍 관리자 페이지</Title>
                <InputStyle 
                value={email}
                prefix={<UserOutlined />} 
                onChange={e=> setEmail(e.target.value)}
                placeholder="관리자 이메일" />
                <InputStyle 
                value={pw}
                prefix={<LockOutlined />} 
                type="password" 
                onChange={e=> setPw(e.target.value)}
                placeholder="비밀번호" />

                <BtnWrap>
                    <LoginBtn type={"primary"} onClick={onLogin}>로그인</LoginBtn>
                    <JoinBtn onClick={() => {router.push('/join')}}>회원가입</JoinBtn>
                </BtnWrap>
                
                <FindBtnWrap>
                    {/* <FindBtn onClick={() => setShowFindId(true)}>아이디 찾기</FindBtn> */}
                    <FindBtn onClick={() => {
                        setEmail(''); 
                        setShowFindPassword(true)}}>비밀번호 찾기</FindBtn>
                </FindBtnWrap>
            </LoginBox>

            {/* <Modal
            title="아이디 찾기"
            visible={showFindId}
            onCancel={() => setShowFindId(false)}
            afterClose={() => {setEmail(''); setResultId('');}}
            footer={null}
            width={480}>
                <ModalWrap>
                    <LabelId>이메일 주소</LabelId>
                    <Input placeholder="가입 시 등록한 이메일 주소를 입력해 주세요" value={email} onChange={e => {setEmail(e.target.value)}} style={{width: 320, marginRight: 8}} />
                    <Button type="primary" onClick={onFindId}>아이디 찾기</Button>
                    {resultId &&
                    <Result>{resultId}</Result>
                    }
                </ModalWrap>
            </Modal> */}
            
            <Modal
            title="비밀번호 찾기"
            visible={showFindPassword}
            onCancel={() => setShowFindPassword(false)}
            afterClose={() => {setIdFind(''); setEmail(''); setResultPw('');}}
            footer={null}
            width={480}>
                <ModalWrap>
                    {/* <FindPwSpace>
                        <Label>아이디</Label>
                        <Input placeholder="아이디를 입력해 주세요" value={idFind} onChange={e => {setIdFind(e.target.value)}} style={{width: 300}} />
                    </FindPwSpace> */}
                    <FindPwSpace>
                        <Label>이메일 주소</Label>
                        <Input placeholder="가입 시 등록한 이메일 주소를 입력해 주세요" value={email} onChange={e => {setEmail(e.target.value)}} style={{width: 300}} />
                    </FindPwSpace>
                    <FindPwBtnWrap>
                        <Button type="primary" onClick={onFindPw}>임시 비밀번호 전송</Button>
                    </FindPwBtnWrap>
                    {resultPw &&
                    <Result>{resultPw}</Result>
                    }
                </ModalWrap>
            </Modal>

        </Wrapper>
    )
})

const Wrapper = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff5f4
`
const LoginBox = styled(Card)`
    padding: 30px 60px 25px;
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
    width: 250px;
`

const Title = styled.h1`
    margin: 3px 0 30px;
    font-size: 13px;
    color: #666;
    text-align: center;
    font-weight: normal;
`
const InputStyle = styled(Input)`
    width: 300px;
    margin-bottom: 5px;
    border-radius: 5px;
`
const BtnWrap = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
`

const LoginBtn = styled(Button)`
    flex: 1;
    margin-right: 7px;
`

const JoinBtn = styled(Button)`
    flex: 1;
`

const FindBtnWrap = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const FindBtn = styled.div`
    margin-top: 20px;
    cursor: pointer;
    color: #aaa;

    &:hover {
        color: #888
    }

    // &:first-child:after {
    //     content: '';
    //     display: inline-block;
    //     width: 1px;
    //     height: 13px;
    //     margin: 0 8px 2px;
    //     vertical-align: middle;
    //     background-color: #bbb;
    // }
`

const ModalWrap = styled.div`
    // padding-bottom: 20px;
`
const LabelId = styled.div`
    padding: 5px;
    color: #666;
    font-weight: 600;
`
const Label = styled.span`
    display: inline-block;
    width: 80px;
    padding: 5px;
    color: #666;
    font-weight: 600;
`
const Result = styled.div`
    padding: 4px 8px;
    color: #F57D6A
`

const FindPwSpace = styled(Space)`
    display: flex;
    padding-bottom: 8px;
` 

const FindPwBtnWrap = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
`

export default Login