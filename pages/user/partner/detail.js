import styled from 'styled-components'
import { Descriptions, Input, Button, message, Image, Modal, Upload } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import DaumPostcode from 'react-daum-postcode';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useStore } from '../../../store/StoreProvider'
import { observer } from 'mobx-react-lite'

const PartnerDetail = observer(() => {
    
    const { user, hotel } = useStore(); 
    const router = useRouter();

    const [modiStatus, setModiStatus] = useState(false)
    const [partner, setPartner] = useState('')
    const [pw, setPw] = useState('')
    const [pw2, setPw2] = useState('')
    const [name, setName] = useState('')
    const [hotelName, setHotelName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => {
        const callDetail = async() => {
            await user.callInfo(user.token);
            await hotel.callInfo({id: user.hotelid}, user.token);

            setPartner(user.info.data.nickname)
            setPw(user.info.data.pw)
            setName(user.info.data.name)
            setPhone(user.info.data.phone)
            setEmail(user.info.data.email)
            
            if (hotel.info.data[0]) {
                setHotelName(hotel.info.data[0].name)
            }
        }
        callDetail();
    }, [])

    useEffect(() => {
        if (router.query.type) setModiStatus(true)
        else setModiStatus(false)
    }, [router])

    const onDataChange = (e, val) => {
        const numRegExp = /^[0-9]*$/
        if (!router.query.type) return;
        if (val == 'phone') {
            if (!numRegExp.test(e.target.value)) return
            setPhone(e.target.value);
        }
        if (val == 'partner') setPartner(e.target.value);
        if (val == 'pw') setPw(e.target.value);
        if (val == 'pw2') setPw2(e.target.value);
        if (val == 'name') setName(e.target.value);
    }
    
    const onModi = async () => {
        const pwRegExp = /^[a-z0-9]{8,20}$/;
        if (!router.query.type) router.push('/user/partner/detail?type=modi');
        else {
            if (!name) {
                return message.warning('담당자명을 입력해 주세요')
            }
            if (!phone) {
                return message.warning('담당자 연락처를 입력해 주세요')
            }
            if (phone.length < 8 || phone.length > 12) {
                return message.warning('담당자 연락처를 정확히 입력해 주세요')
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

            // success
            const data = {
                name: name,
                phone: phone,
                pw: pw,
                pw2: pw2,
                user_id: user.info.data.id,
                email: user.info.data.email,
                nickname: user.info.data.nickname,
                user_type: 1
            }

            await user.updateInfo(data, user.token, (success, result) => {
                if (success) {
                    message.success('수정 완료');
                    window.location.href='/user/partner/detail'
                }
            })
        }
    }

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>파트너 정보</Title>} bordered column={1} extra={<Button onClick={() => router.push('/user/partner/list')}>목록으로 돌아가기</Button>}>
                    <Descriptions.Item label="파트너명">
                        {partner}
                    </Descriptions.Item>
                    <Descriptions.Item label="이메일 주소">
                        {email}
                    </Descriptions.Item>
                    <Descriptions.Item label="비밀번호">
                    {
                        modiStatus &&
                        <InputValue
                        type="password"
                        value={pw} 
                        onChange={(e) => onDataChange(e, 'pw')} />
                    }
                    </Descriptions.Item>
                    {
                        modiStatus &&
                        <Descriptions.Item label="비밀번호 확인">
                            <InputValue
                            type="password"
                            value={pw2} 
                            onChange={(e) => onDataChange(e, 'pw2')}
                            bordered={modiStatus} />
                        </Descriptions.Item>
                    }
                    <Descriptions.Item label="담당자명">
                        {modiStatus ?
                        <InputValue
                        value={name} 
                        onChange={(e) => onDataChange(e, 'name')}
                        bordered={modiStatus} />
                        : name }
                    </Descriptions.Item>
                    <Descriptions.Item label="담당자 연락처">
                        {modiStatus ?
                        <InputValue
                        value={phone} 
                        onChange={(e) => onDataChange(e, 'phone')}
                        bordered={modiStatus} />
                        : phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 정보">
                        {hotelName ?
                        <HotelBtn onClick={() => router.push(`/hotel/${user.hotelid}`)}>{hotelName}</HotelBtn>
                        : <>등록된 숙소가 없습니다.</>}
                    </Descriptions.Item>
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onModi}>{modiStatus ? '수정완료' : '수정'}</Button>
                    {modiStatus ?
                    <Button onClick={() => router.replace('/user/partner/detail', undefined, {shallow: true}).then(() => window.scrollTo(0,0))}>취소</Button>
                    : <Button onClick={() => router.push('/user/partner/list')}>목록</Button>
                    }
                </ButtonWrap>
            </Detail>
        </Wrapper>
    )
})

const Wrapper = styled.div`
    width: 100%;
    max-width: 1100px;
`

const Detail = styled.div`
    padding: 18px;
    margin-bottom: 80px;
    background-color: #fff;
`

const Title = styled.div`
    color: #666;
    font-size: 15px;
`

const InputValue = styled(Input)`
    width: 400px;
`

const HotelBtn = styled.div`
    display: inline-block;
    color: #666;
    border-bottom: 1px solid #666;
    cursor: pointer;

    &:hover {
        color: blue;
        border-color: blue;
    }
`

const ButtonWrap = styled.div`
    display: flex;
    justify-content: center;
    padding: 25px 0 10px;

    button:first-child {
        margin-right: 10px;
    }
`

export default PartnerDetail