import styled from 'styled-components'
import { Descriptions, Input, Button, message, Image, Modal, Upload } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import DaumPostcode from 'react-daum-postcode';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const PartnerDetail = () => {
    const data = {
        key: '1',
        partner: '가나다라',
        user_id: 'test1234',
        joinAt: '2021-08-31',
        name: '김루밍',
        phone: '01012341234',
        password: '',
        zonecode: '1234',
        address: '주소가',
        address2: '',
        email: 'test@rooming.com',
        tel: '0212341234',
        hotel: '라마다 프라자 바이 윈덤 여수 호텔',
        memo: '메모입니다.'
    }

    const router = useRouter();

    const [isAdmin, setIsAdmin] = useState(true);
    const [modiStatus, setModiStatus] = useState(false)

    const [partner, setPartner] = useState(data.partner)
    const [pw, setPw] = useState(data.pw)
    const [pw2, setPw2] = useState('')
    const [name, setName] = useState(data.name)
    const [phone, setPhone] = useState(data.phone)
    const [email, setEmail] = useState(data.email)
    const [address, setAddress] = useState(data.address)
    const [address2, setAddress2] = useState(data.address2)
    const [zonecode, setZonecode] = useState(data.zonecode)
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState();
    const [tel, setTel] = useState(data.tel)
    const [memo, setMemo] = useState(data.memo)
    const [showAddress, setShowAddress] = useState(false)

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
        if (val == 'email') setEmail(e.target.value);
        if (val == 'address') setAddress(e.target.value);
        if (val == 'address2') setAddress2(e.target.value);
        if (val == 'tel') setTel(e.target.value);
        if (val == 'memo') setMemo(e.target.value);
    }
    
    const onModi = () => {
        const pwRegExp = /^[a-z0-9]{8,20}$/;
        if (!router.query.type) router.push('/user/partner/1?type=modi');
        else {
            if (!partner) {
                return message.warning('파트너명을 입력해 주세요')
            }
            if (!name) {
                return message.warning('담당자명을 입력해 주세요')
            }
            if (!email) {
                return message.warning('이메일주소를 입력해 주세요')
            }
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

            // success
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
                    <Descriptions.Item label="아이디">
                        <InputValue
                        value={data.user_id} 
                        onChange={() => {}}
                        bordered={false} />
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
                    <Descriptions.Item label="이메일 주소">
                        <InputValue
                        value={email} 
                        onChange={(e) => onDataChange(e, 'email')}
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
                        <HotelBtn onClick={() => router.push('/hotel/1')}>{data.hotel}</HotelBtn>
                    </Descriptions.Item>
                    {isAdmin &&
                    <Descriptions.Item label="관리자 메모">
                        <Input.TextArea
                        value={memo} 
                        onChange={(e) => onDataChange(e, 'memo')} />
                    </Descriptions.Item>
                    }
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onModi}>{modiStatus ? '수정완료' : '수정'}</Button>
                    {modiStatus ?
                    <Button onClick={() => router.replace('/user/partner/1', undefined, {shallow: true}).then(() => window.scrollTo(0,0))}>취소</Button>
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
}

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