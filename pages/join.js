import styled from 'styled-components'
import { useState } from 'react'
import { Descriptions, Input, Button, message } from 'antd'
import router from 'next/router'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/StoreProvider'

const Join = observer(() => {

    const { user } = useStore()

    const [nick, setNick] = useState('')
    const [nickDup, setNickDup] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [emailDup, setEmailDup] = useState('')
    const [phone, setPhone] = useState('')
    const [pw, setPw] = useState('')
    const [pw2, setPw2] = useState('')

    const onJoin = async() => {
        // const idRegExp = /^[a-zA-Z0-9]{6,16}$/;
        const pwRegExp = /^[a-z0-9]{8,20}$/;

        if (!name) {
            return message.warning('담당자명을 입력해 주세요')
        }
        if (!nick) {
            return message.warning('파트너명을 입력해 주세요')
        }
        if (!email) {
            return message.warning('이메일주소를 입력해 주세요')
        }
        if (!phone) {
            return message.warning('담당자 연락처를 입력해 주세요')
        }
        if (phone.length !== 11) {
            return message.warning('담당자 연락처를 정확하게 입력해 주세요')
        }
        if (!pw) {
            return message.warning('비밀번호를 입력해 주세요')
        }
        if (!pwRegExp.test(pw)) {
            return message.warning('비밀번호는 영문, 숫자 조합 8~20자리로 입력해야 합니다')
        }
        if (!pw2) {
            return message.warning('비밀번호 확인을 입력해 주세요')
        }
        if (pw !== pw2) {
            return message.warning('비밀번호와 비밀번호 확인을 동일하게 입력해 주세요')
        }
        if (nickDup === '') {
            return message.warning('파트너명 중복 검사를 해주세요.')
        }
        if (nickDup === false) {
            return message.warning('이미 사용중인 파트너명 입니다.')
        }
        if (emailDup === '') {
            return message.warning('이메일 중복 검사를 해주세요.')
        }
        if (emailDup === false) {
            return message.warning('이미 사용중인 이메일 입니다.')
        }

        const data = {
            name: name,
            nickname: nick,
            email: email,
            phone: phone,
            password: pw,
            user_type: 1,
        }

        await user.checkNickDuplicate({nickname: nick}, (success, result) => {
            if (result.usable == 'N') {
                return message.warning('파트너명 중복 체크를 해주세요')
            } else {
                user.checkEmailDuplicate({email}, (success, result) => {
                    if (result.usable == 'N') {
                        return message.warning('이메일 중복 체크를 해주세요')
                    } else {
                        user.join(data, (success, result) => {
                            if (success) {
                                if (result.status == 200) {
                                    // console.log(data)
                                    message.success('회원가입이 완료되었습니다')
                                    router.push('/')
                                } else {
                                    message.error(result.msg)
                                }
                            }
                        })
                    }
                })
            }
        })


    }

    const onCheckNick = async() => {
        console.log('test')
        await user.checkNickDuplicate({nickname: nick}, (success, result) => {
            if (success) {
                console.log(result)
                alert(`${result.msg}입니다.`)
                alert(`${result.usable}입니다.`)
                if (result.usable == 'N') {
                    setNickDup(false);
                } else {
                    setNickDup(true);
                }
            }
        })
    }

    const onCheckEmail = async() => {
        await user.checkEmailDuplicate({email}, (success, result) => {
            if (success) {
                console.log(result)
                alert(`${result.msg}입니다.`)
                if (result.usable == 'N') {
                    setEmailDup(false);
                } else {
                    setEmailDup(true);
                }
            }
        })
    }


    return (
        <Wrapper>
            <JoinWrap>
                <Logo src="/image/logo.png" onClick={() => router.push('/')} />
                <JoinForm>
                    <Descriptions title="루밍 파트너 회원가입" bordered column={1}>
                        <Descriptions.Item label="파트너명">
                            <Input placeholder="소속된 업체명을 입력해 주세요" value={nick} onChange={e => setNick(e.target.value)} style={{width: 250, marginRight: 10}} />
                            <Button onClick={onCheckNick}>파트너명 중복 체크</Button>
                        </Descriptions.Item>
                        <Descriptions.Item label="담당자명">
                            <Input placeholder="담당자명을 입력해 주세요" value={name} onChange={e => setName(e.target.value)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="담당자 연락처">
                            <Input placeholder="'-'없이 번호만 입력해 주세요" value={phone} onChange={e => {
                                const numRegExp = /^[0-9]*$/;
                                if (!numRegExp.test(e.target.value)) return;
                                setPhone(e.target.value)}} />
                        </Descriptions.Item>
                        <Descriptions.Item label="이메일 주소">
                            <Input placeholder="이메일 주소를 입력해 주세요" value={email} onChange={e => setEmail(e.target.value)} style={{width: 250, marginRight: 10}}/>
                            <Button onClick={onCheckEmail}>이메일 중복 체크</Button>
                        </Descriptions.Item>
                        <Descriptions.Item label="비밀번호">
                            <Input type="password" placeholder="영문, 숫자 조합 8자 이상 입력해 주세요" value={pw} onChange={e => setPw(e.target.value)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="비밀번호 확인">
                            <Input type="password" placeholder="영문, 숫자 조합 8자 이상 입력해 주세요" value={pw2} onChange={e => setPw2(e.target.value)} />
                        </Descriptions.Item>
                    </Descriptions>

                    <BtnWrap>
                        <JoinBtn type="primary" onClick={onJoin}>가입하기</JoinBtn>
                        <JoinBtn onClick={() => {router.reload('/join')}}>초기화</JoinBtn>
                    </BtnWrap>
                </JoinForm>
            </JoinWrap>
        </Wrapper>
    )
})

const Wrapper = styled.div`
    width: 100%;
    height: 100vh;
    background-color: #eee;
`

const JoinWrap = styled.div`
    display: flex;
    justify-content: center;
    background-color: #eee;
    padding: 120px 0;
`

const Logo = styled.img`
    position: absolute;
    top: 50px;
    width: 200px;
    cursor: pointer;
`

const JoinForm = styled.div`
    width: 800px;
    padding: 30px 40px;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    background-color: #fff;
`

const BtnWrap = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 45px;
`

const JoinBtn = styled(Button)`
    margin: 0 5px;
`


export default Join