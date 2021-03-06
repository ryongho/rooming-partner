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
                return message.warning('??????????????? ????????? ?????????')
            }
            if (!phone) {
                return message.warning('????????? ???????????? ????????? ?????????')
            }
            if (phone.length < 8 || phone.length > 12) {
                return message.warning('????????? ???????????? ????????? ????????? ?????????')
            }
            if (!pw) {
                return message.warning('??????????????? ????????? ?????????')
            }
            if (!pwRegExp.test(pw)) {
                return message.warning('??????????????? ??????, ?????? ?????? 8~20????????? ???????????? ?????????')
            }
            if (!pw2) {
                return message.warning('???????????? ????????? ????????? ?????????')
            }
            if (pw !== pw2) {
                return message.warning('??????????????? ???????????? ????????? ???????????? ????????? ?????????')
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
                    message.success('?????? ??????');
                    window.location.href='/user/partner/detail'
                }
            })
        }
    }

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>????????? ??????</Title>} bordered column={1} extra={<Button onClick={() => router.push('/user/partner/list')}>???????????? ????????????</Button>}>
                    <Descriptions.Item label="????????????">
                        {partner}
                    </Descriptions.Item>
                    <Descriptions.Item label="????????? ??????">
                        {email}
                    </Descriptions.Item>
                    <Descriptions.Item label="????????????">
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
                        <Descriptions.Item label="???????????? ??????">
                            <InputValue
                            type="password"
                            value={pw2} 
                            onChange={(e) => onDataChange(e, 'pw2')}
                            bordered={modiStatus} />
                        </Descriptions.Item>
                    }
                    <Descriptions.Item label="????????????">
                        {modiStatus ?
                        <InputValue
                        value={name} 
                        onChange={(e) => onDataChange(e, 'name')}
                        bordered={modiStatus} />
                        : name }
                    </Descriptions.Item>
                    <Descriptions.Item label="????????? ?????????">
                        {modiStatus ?
                        <InputValue
                        value={phone} 
                        onChange={(e) => onDataChange(e, 'phone')}
                        bordered={modiStatus} />
                        : phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="?????? ??????">
                        {hotelName ?
                        <HotelBtn onClick={() => router.push(`/hotel/${user.hotelid}`)}>{hotelName}</HotelBtn>
                        : <>????????? ????????? ????????????.</>}
                    </Descriptions.Item>
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onModi}>{modiStatus ? '????????????' : '??????'}</Button>
                    {modiStatus ?
                    <Button onClick={() => router.replace('/user/partner/detail', undefined, {shallow: true}).then(() => window.scrollTo(0,0))}>??????</Button>
                    : <Button onClick={() => router.push('/user/partner/list')}>??????</Button>
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