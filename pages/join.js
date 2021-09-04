import styled from 'styled-components'
import { useState } from 'react'
import { Descriptions, Input, Button, message, Upload, Modal } from 'antd'
import router from 'next/router'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import DaumPostcode from 'react-daum-postcode';

const Join = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [id, setId] = useState('')
    const [pw, setPw] = useState('')
    const [pw2, setPw2] = useState('')
    const [partner, setPartner] = useState('')
    const [address, setAddress] = useState('')
    const [address2, setAddress2] = useState('')
    const [zonecode, setZonecode] = useState('')
    const [tel, setTel] = useState('')
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState();
    const [showAddress, setShowAddress] = useState(false)

    const onJoin = () => {
        const idRegExp = /^[a-zA-Z0-9]{6,16}$/;
        const pwRegExp = /^[a-z0-9]{8,20}$/;

        if (!partner) {
            return message.warning('담당자명을 입력해 주세요')
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
        if (!id) {
            return message.warning('아이디를 입력해 주세요')
        }
        if (!idRegExp.test(id)) {
            return message.warning('아이디는 영문 대소문자, 숫자 6~16자리로 입력해야 합니다')
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

    }

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
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
            <JoinWrap>
                <Logo src="/image/logo.png" onClick={() => router.push('/')} />
                <JoinForm>
                    <Descriptions title="루밍 파트너 회원가입" bordered column={1}>
                        <Descriptions.Item label="담당자명">
                            <Input placeholder="담당자명을 입력해 주세요" value={name} onChange={e => setName(e.target.value)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="이메일 주소">
                            <Input placeholder="이메일 주소를 입력해 주세요" value={email} onChange={e => setEmail(e.target.value)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="담당자 연락처">
                            <Input placeholder="휴대폰 번호를 입력해 주세요" value={phone} onChange={e => {
                                const numRegExp = /^[0-9]*$/;
                                if (!numRegExp.test(e.target.value)) return;
                                setPhone(e.target.value)}} />
                        </Descriptions.Item>
                        <Descriptions.Item label="아이디">
                            <Input placeholder="영문, 숫자 조합 6자 이상 입력해 주세요" value={id} onChange={e => setId(e.target.value)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="비밀번호">
                            <Input type="password" placeholder="영문, 숫자 조합 8자 이상 입력해 주세요" value={pw} onChange={e => setPw(e.target.value)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="비밀번호 확인">
                            <Input type="password" placeholder="영문, 숫자 조합 8자 이상 입력해 주세요" value={pw2} onChange={e => setPw2(e.target.value)} />
                        </Descriptions.Item>

                        
                        <Descriptions.Item label="파트너명">
                            <Input placeholder="소속된 업체명을 입력해 주세요" value={partner} onChange={e => setPartner(e.target.value)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="주소">
                            <Input 
                            placeholder={"우편번호"}
                            disabled
                            value={zonecode}
                            style={{width:100}} />
                            <Button onClick={()=> setShowAddress(true)} style={{marginLeft:5}}>주소검색</Button>
                            <Input 
                            placeholder={"기본주소"}
                            disabled
                            value={address}
                            style={{marginTop:5, marginBottom:5, display:'block'}} />
                            <Input 
                            placeholder={"상세주소를 입력해주세요"}
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="대표 전화번호">
                            <Input
                            value={tel} 
                            onChange={(e) => setTel(e.target.value)} />
                        </Descriptions.Item>
                        <Descriptions.Item label="사업자 등록증">
                            <Upload 
                            listType="picture-card"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                            onChange={onUploadChange}>
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                                : 
                                <div>
                                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>}
                            </Upload>
                        </Descriptions.Item>
                    </Descriptions>

                    <BtnWrap>
                        <JoinBtn type="primary" onClick={onJoin}>가입하기</JoinBtn>
                        <JoinBtn onClick={() => {router.reload('/join')}}>취소</JoinBtn>
                    </BtnWrap>
                </JoinForm>
            </JoinWrap>
            
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