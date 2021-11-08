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
    const [address, setAddress] = useState('')
    const [address2, setAddress2] = useState('')
    const [zonecode, setZonecode] = useState('')
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState();
    const [tel, setTel] = useState('')
    const [showAddress, setShowAddress] = useState(false)

    useEffect(() => {
        const callDetail = async() => {
            await user.callInfo(user.token);
            await hotel.callInfo({id: user.hotelid}, user.token);
            console.log(user.info.data, hotel.info.data[0])
            setPartner(user.info.data.nickname)
            setPw(user.info.data.pw)
            setName(user.info.data.name)
            setPhone(user.info.data.phone)
            setEmail(user.info.data.email)
            setTel(user.info.data.phone)
            if (hotel.info.data[0]) {
                setAddress(hotel.info.data[0].address.slice(0, hotel.info.data[0].address.length - 5))
                setZonecode(hotel.info.data[0].address.slice(hotel.info.data[0].address.length - 5))
                setHotelName(hotel.info.data[0].name)
            }
        }
        callDetail();
    }, [])

    useEffect(() => {
        console.log(router.query.type)
        if (router.query.type) setModiStatus(true)
        else setModiStatus(false)
    }, [router])

    const onDataChange = (e, val) => {
        const numRegExp = /^[0-9]*$/
        if (!router.query.type) return;
        if (val == 'phone' || val == 'tel') {
            if (!numRegExp.test(e.target.value)) return
        }
        if (val == 'partner') setPartner(e.target.value);
        if (val == 'pw') setPw(e.target.value);
        if (val == 'pw2') setPw2(e.target.value);
        if (val == 'name') setName(e.target.value);
        if (val == 'phone') setPhone(e.target.value);
        // if (val == 'email') setEmail(e.target.value);
        if (val == 'address') setAddress(e.target.value);
        if (val == 'address2') setAddress2(e.target.value);
        if (val == 'tel') setTel(e.target.value);
    }
    
    const onModi = () => {
        const pwRegExp = /^[a-z0-9]{8,20}$/;
        if (!router.query.type) router.push('/user/partner/detail?type=modi');
        else {
            if (!partner) {
                return message.warning('파트너명을 입력해 주세요')
            }
            if (!name) {
                return message.warning('담당자명을 입력해 주세요')
            }
            // if (!email) {
            //     return message.warning('이메일주소를 입력해 주세요')
            // }
            if (!phone) {
                return message.warning('담당자 연락처를 입력해 주세요')
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

            let total_address;
            if (address2) total_address = address +' '+ address2 +' '+ zonecode;
            if (address2 == '') total_address = address +' '+ zonecode;

            // success
            const data = {
                name: name,
                address: total_address,
            }

        }
    }

    let isImage = false;

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('JPG 및 PNG 파일만 업로드 가능합니다.');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('이미지 사이즈는 2MB보다 작아야 합니다.');
        }
        return isJpgOrPng && isLt2M;
    }

    const onUploadChange = (e) => {
        console.log(e.file.status);
        if (e.file.status === 'uploading') {
            return setLoading(true);
        }
        if (e.file.status === 'done') {
            const reader = new FileReader();
            reader.addEventListener('load', () => callback(reader.result));
            reader.readAsDataURL(e.file.originFileObj);
            
            setLoading(false);
            setImageUrl(reader.result)
        }
        
    }

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>파트너 정보</Title>} bordered column={1} extra={<Button onClick={() => router.push('/user/partner/list')}>목록으로 돌아가기</Button>}>
                    <Descriptions.Item label="파트너명">
                        <InputValue 
                        value={partner} 
                        onChange={(e) => onDataChange(e, 'partner')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="이메일 주소">
                        <InputValue
                        value={email} 
                        onChange={() => {}}
                        bordered={modiStatus} />
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
                        <InputValue
                        value={name} 
                        onChange={(e) => onDataChange(e, 'name')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="담당자 연락처">
                        <InputValue
                        value={phone} 
                        onChange={(e) => onDataChange(e, 'phone')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="주소">
                        <Input 
                        placeholder={modiStatus ? "우편번호" : null}
                        disabled={modiStatus}
                        bordered={modiStatus}
                        value={zonecode}
                        style={{width:100}} />
                        {modiStatus &&
                            <Button onClick={()=> setShowAddress(true)} style={{marginLeft:5}}>주소검색</Button>
                        }
                        <Input 
                        placeholder={modiStatus ? "기본주소" : null}
                        disabled={modiStatus}
                        bordered={modiStatus}
                        value={address}
                        style={{marginTop:5, marginBottom:5, display:'block'}} />
                        <Input 
                        placeholder={modiStatus ? "상세주소를 입력해주세요" : null}
                        value={address2} 
                        bordered={modiStatus}
                        onChange={(e) => onDataChange(e, 'address2')} />
                    </Descriptions.Item>
                    <Descriptions.Item label="대표 전화번호">
                        <InputValue
                        value={tel} 
                        onChange={(e) => onDataChange(e, 'tel')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="사업자 등록증">
                        {
                            modiStatus ?
                            <Upload 
                            listType="picture-card"
                            showUploadList={false}
                            action=""
                            beforeUpload={beforeUpload}
                            onChange={onUploadChange}>
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                                : 
                                <div>
                                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>}
                            </Upload>
                            : isImage ?
                            <Image width={100} src="/image/logo.png" />
                            : null
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 정보">
                        <HotelBtn onClick={() => router.push(`/hotel/${user.hotelid}`)}>{hotelName}</HotelBtn>
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
            <Modal
            visible={showAddress}
            onCancel={() => setShowAddress(false)}
            footer={() => {}}>
                <DaumPostcode onComplete={(e) => {
                    setZonecode(e.zonecode);
                    setAddress(e.address);
                    setShowAddress(false)
                }} />
            </Modal>
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