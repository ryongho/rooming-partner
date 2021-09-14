import styled from "styled-components"
import { Descriptions, Select, Input, Button, Checkbox, message, Modal, Upload, Space } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import DaumPostcode from 'react-daum-postcode';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/StoreProvider'

const HotelWrite = observer(() => {

    const router = useRouter();
    const { user, hotel } = useStore()

    const options = ['주차가능', '레스토랑', '수영장', '스파', '피트니스', '무료 wifi', 'cctv', '소형냉장고']
    const [category, setCategory] = useState()
    const [name, setName] = useState()
    const [facility, setFacility] = useState([])
    const [address, setAddress] = useState()
    const [address2, setAddress2] = useState()
    const [zonecode, setZonecode] = useState()
    const [tel, setTel] = useState()
    const [thumb, setThumb] = useState()
    const [imgList, setImgList] = useState([])
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState()
    const [breakfast, setBreakfast] = useState()
    const [parking, setParking] = useState()
    const [cancel, setCancel] = useState()

    const [fax, setFax] = useState('')
    const [latitude, setLatitude] = useState()
    const [longtitude, setLongtitude] = useState()
    const [openDate, setOpenDate] = useState()

    const [showAddress, setShowAddress] = useState(false)

    const onWrite = async () => {
        if (!name) {
            message.warning('숙소명을 입력해 주세요')
        }
        if (!address || !zonecode) {
            message.warning('숙소 주소를 입력해 주세요')
        }
        if (!tel) {
            message.warning('숙소 연락처를 입력해 주세요')
        }
        if (imgList.length < 1) {
            message.warning('숙소 사진을 입력해 주세요')
        }
        if (!cancel) {
            message.warning('취소 및 환불 규정을 입력해 주세요')
        }

        const data = {
            name: name,
            open_date: openDate,
            address: address + address2 + zonecode,
            tel: tel,
            fax: fax,
            traffic: traffic,
            images: imgList,
            latitude: latitude,
            longtitude: longtitude
        }

        await hotel.addInfo(data, user.token, (success) => {
            if (success) {
                message.success('게시 완료').then(() => router.push('/hotel/list').then(() => window.scrollTo(0,0)))
            }
        })
        
    }


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

    const onUploadThumb = (e) => {
        if (e.file.status === 'done') {
        const reader = new FileReader();
        reader.addEventListener('load', () => (setThumb(reader.result)));
        reader.readAsDataURL(e.file.originFileObj);
        }
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
            setImgList(reader.result)
        }
        
    }

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>숙소 정보 입력</Title>} bordered column={1} extra={<Button onClick={() => router.push('/hotel/list')}>목록으로 돌아가기</Button>}>
                    <Descriptions.Item label="숙소 카테고리">
                        <SelectBar defaultValue={"hotel"} onChange={(e) => setCategory(e)}>
                            <Select.Option value={"hotel"}>호텔</Select.Option>
                            <Select.Option value={"resort"}>리조트</Select.Option>
                        </SelectBar>
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소명">
                        <InputValue
                        value={name} 
                        onChange={e => setName(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 주소">
                        <Input 
                        placeholder={"우편번호"}
                        value={zonecode}
                        style={{width:100}} />
                        <Button onClick={()=> setShowAddress(true)} style={{marginLeft:5}}>주소검색</Button>
                        <Input 
                        placeholder={"기본주소"}
                        value={address}
                        style={{marginTop:5, marginBottom:5, display:'block'}} />
                        <Input 
                        placeholder={"상세주소를 입력해주세요"}
                        value={address2} 
                        onChange={(e) => setAddress2(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 연락처">
                        <InputValue
                        placeholder={"'-'없이 번호만 입력해 주세요"}
                        value={tel} 
                        onChange={(e) => {
                            const numRegExp = /^[0-9]*$/;
                            if (!numRegExp.test(e.target.value)) return;
                            setTel(e.target.value)}} />
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 사진">
                        <Upload
                        listType="picture-card"
                        showUploadList={false}
                        action="http://localhost:3000/"
                        beforeUpload={beforeUpload}
                        onChange={onUploadThumb}>
                            {thumb ? <img src={thumb} alt="avatar" style={{ width: '100%' }} /> : <UploadBtn>썸네일 업로드</UploadBtn>}
                        </Upload>

                        <Space>
                            <Upload 
                            listType="picture-card"
                            fileList={imgList}
                            showUploadList={false}
                            action=""
                            beforeUpload={beforeUpload}
                            onChange={onUploadChange}>
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                                : imgList.length >= 10 ? null :
                                <div>
                                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                    
                                    <UploadBtn>이미지 업로드</UploadBtn>
                                </div>}
                            </Upload>
                            <UploadLength>({imgList.length} / 10)</UploadLength>
                        </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="편의시설">
                        <Checkbox.Group options={options} value={facility} onChange={e => setFacility(e)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="조식 정보">
                        <Input.TextArea
                        value={breakfast} 
                        rows={4}
                        onChange={(e) => setBreakfast(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="주차 정보">
                        <Input.TextArea
                        value={parking} 
                        rows={4}
                        onChange={(e) => setParking(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="취소 및 환불 규정">
                        <Input.TextArea
                        value={cancel} 
                        rows={4}
                        onChange={(e) => setCancel(e.target.value)} />
                    </Descriptions.Item>
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onWrite}>등록하기</Button>
                    <Button onClick={() => router.push('/hotel/list')}>목록</Button>
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

const SelectBar = styled(Select)`
    width: 150px;
`

const UploadBtn = styled.div`
    margin-top: 8px;
`

const ButtonWrap = styled.div`
    display: flex;
    justify-content: center;
    padding: 25px 0 10px;

    button:first-child {
        margin-right: 10px;
    }
`

const UploadLength = styled.div`
    font-size: 12px;
    color: #999
`

export default HotelWrite