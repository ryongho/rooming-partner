import styled from "styled-components"
import { Descriptions, Select, Input, Button, Checkbox, message, Modal, DatePicker, Upload, Space } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import DaumPostcode from 'react-daum-postcode';
import UploadImgs from '../../components/atom/UploadImgs'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/StoreProvider'
import moment from 'moment'

const HotelWrite = observer(() => {

    const router = useRouter();
    const { user, hotel } = useStore()

    const options = ['주차가능', '레스토랑', '수영장', '스파', '피트니스', '무료 wifi', 'cctv', '소형냉장고']
    const [category, setCategory] = useState('호텔')
    const [name, setName] = useState()
    const [facility, setFacility] = useState([])
    const [address, setAddress] = useState()
    const [address2, setAddress2] = useState('')
    const [zonecode, setZonecode] = useState()
    const [tel, setTel] = useState()
    // const [fileList, setFileList] = useState([])
    const [imgList, setImgList] = useState([])
    const [loading, setLoading] = useState(false)
    const [cancel, setCancel] = useState()

    const [content, setContent] = useState('')
    const [owner, setOwner] = useState('')
    const [reg, setReg] = useState('')
    const [openDate, setOpenDate] = useState('')
    const [traffic, setTraffic] = useState('')
    const [level, setLevel] = useState('')
    const [fax, setFax] = useState('')
    const [longtitude, setLongtitude] = useState()
    const [latitude, setLatitude] = useState()

    const [showAddress, setShowAddress] = useState(false)

    const onWrite = async () => {

        if (!name) {
            return message.warning('숙소명을 입력해 주세요')
        }
        if (!address || !zonecode) {
            return message.warning('숙소 주소를 입력해 주세요')
        }
        if (!tel) {
            return message.warning('숙소 연락처를 입력해 주세요')
        }
        if (imgList.length < 1) {
            return message.warning('상품 사진을 입력해 주세요')
        }
        if (!cancel) {
            return message.warning('취소 및 환불 규정을 입력해 주세요')
        }

        const images = imgList.join();
        const option = facility.join();

        let total_address = zonecode + ' ' + address

        const data = {
            name: name,
            content: content,
            owner: owner,
            open_date: moment(openDate).format('YYYY-MM-DD'),
            reg_no: reg,
            address: total_address,
            address_detail: address2,
            tel: tel,
            fax: fax,
            level: level,
            traffic: traffic,
            images: images,
            latitude: latitude,
            longtitude: longtitude,
            type: category,
            options: option,
            refund_rule: cancel
        }

        // console.log(data)

        await hotel.addInfo(data, user.token, (success, result) => {
            if (success) {
                message.success('게시 완료').then(() => window.location.href='/hotel/list')
            }
        })
        
    }


    const onUploadChange = async (e) => {
        // if (e.file.status === 'uploading') {
        //     setLoading(true);
        //     await hotel.imagesUpload(e.file.originFileObj, user.token, (success, data) => {
        //         if (success) {
        //             setFileList(fileList.concat(e.file.originFileObj))
        //             setLoading(false);
        //             setImgList(imgList.concat(data.images))
        //             console.log(fileList, imgList)
        //         }
        //     })
        // }
        
        setLoading(true)
        let file = e.target.files[0];
        let reader = new FileReader();

        reader.onloadend = async(e) => {
            await hotel.imagesUpload(file, user.token, (success, data) => {
                if (success) {
                    setImgList(imgList.concat(data.images))
                    setLoading(false)
                }
            })
        }
        if (file) reader.readAsDataURL(file);
    }
    
    const onRemoveImgs = async(key) => {
        // let idx = fileList.indexOf(file);
        // imgList.splice(idx, 1);
        // await setImgList(imgList)
        // await setFileList(fileList.filter(e => e !== file))

        await setImgList(imgList.filter((e, idx) => idx !== key))
    }

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>숙소 정보 입력</Title>} bordered column={1} extra={<Button onClick={() => router.push('/hotel/list')}>목록으로 돌아가기</Button>}>
                    <Descriptions.Item label="숙소 카테고리">
                        <SelectBar placeholder={"선택하세요"} onChange={(e) => setCategory(e)}>
                            <Select.Option value={"호텔"}>호텔</Select.Option>
                            <Select.Option value={"모텔"}>모텔</Select.Option>
                            <Select.Option value={"펜션"}>펜션</Select.Option>
                            <Select.Option value={"콘도"}>콘도</Select.Option>
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
                    <Descriptions.Item label="숙소 상세 위치">
                        <InputLabel>위도 : </InputLabel>
                        <Input 
                        placeholder={"위도"}
                        value={latitude}
                        style={{width:100, marginRight: '10px'}}
                        onChange={(e) => setLatitude(e.target.value)} />
                        <InputLabel>경도 : </InputLabel>
                        <Input 
                        placeholder={"경도"}
                        value={longtitude}
                        style={{width:100, marginRight: '20px'}}
                        onChange={(e) => setLongtitude(e.target.value)} />
                        
                        <a href="https://www.google.com/maps/search/" target='_blank'>
                            <Button>주소로 경도/위도 찾기</Button>
                        </a>
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
                    <Descriptions.Item label="숙소 팩스">
                        <InputValue
                        placeholder={"'-'없이 번호만 입력해 주세요"}
                        value={fax} 
                        onChange={(e) => {
                            const numRegExp = /^[0-9]*$/;
                            if (!numRegExp.test(e.target.value)) return;
                            setFax(e.target.value)}} />
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 등급">
                        <InputValue
                        placeholder={"숫자로 입력해 주세요"}
                        value={level} 
                        onChange={(e) => {
                            const numRegExp = /^[0-9]*$/;
                            if (!numRegExp.test(e.target.value)) return;
                            setLevel(e.target.value)}} />
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 이미지">
                        <UploadImgs 
                            imgList={imgList}
                            loading={loading}
                            onUploadChange={onUploadChange}
                            onRemoveImgs={onRemoveImgs}
                            modiStatus={true} />
                    </Descriptions.Item>
                    <Descriptions.Item label="편의시설">
                        <Checkbox.Group options={options} value={facility} onChange={e => setFacility(e)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="대표자">
                        <InputValue
                        value={owner} 
                        onChange={e => setOwner(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="사업자 번호">
                        <InputValue
                        value={reg} 
                        onChange={e => setReg(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="개업일">
                        <DatePicker onChange={(e) => setOpenDate(e)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="호텔 소개">
                        <Input.TextArea
                        value={content} 
                        rows={4}
                        onChange={(e) => setContent(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="교통 정보">
                        <Input.TextArea
                        value={traffic} 
                        rows={4}
                        onChange={(e) => setTraffic(e.target.value)} />
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="조식 정보">
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
                    </Descriptions.Item> */}
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
    padding-bottom: 80px;
`

const Detail = styled.div`
    padding: 18px;
    background-color: #fff;
`

const Title = styled.div`
    color: #666;
    font-size: 15px;
`

const InputValue = styled(Input)`
    width: 400px;
`

const InputLabel = styled.span`
`

const SelectBar = styled(Select)`
    width: 150px;
`

const ButtonWrap = styled.div`
    display: flex;
    justify-content: center;
    padding: 25px 0 10px;

    button:first-child {
        margin-right: 10px;
    }
`

export default HotelWrite