import styled from "styled-components"
import { Descriptions, Select, Input, Button, Checkbox, message, Modal, DatePicker, Radio, Tooltip, Space } from 'antd'
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

    const hotelCategory = ['호텔', '모텔', '펜션/풀빌라', '리조트', '글램핑/캠핑', '게스트하우스', '한옥', '공유숙박']
    const options = ['넷플릭스', '유튜브', '디즈니', '왓챠', '쿠팡플레이', '레스토랑', '피트니스', '야외수영장', '실내수영장', '사우나', '스파',  '공유키친', '세미나룸', '세탁실', '주차공간', '무료wifi', 'PC', '노트북', '안마의자', '비데', '욕조', '월풀', '반신욕기계']
    const [category, setCategory] = useState('호텔')
    const [name, setName] = useState()
    const [facility, setFacility] = useState([])
    const [facilityEtc, setFacilityEtc] = useState('');
    const [address, setAddress] = useState()
    const [address2, setAddress2] = useState('')
    const [zonecode, setZonecode] = useState()
    const [tel, setTel] = useState()
    const [bank, setBank] = useState()
    const [account, setAccount] = useState()
    const [accountName, setAccountName] = useState()
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
    const [parking, setParking] = useState()
    const [longtitude, setLongtitude] = useState()
    const [latitude, setLatitude] = useState()
    const [csInfo, setCsInfo] = useState()
    const [receiptInfo, setReceiptInfo] = useState()
    const [commonInfo, setCommonInfo] = useState()

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
        if (tel.length > 12) {
            return message.warning('숙소 연락처를 정확히 입력해 주세요')
        }
        if (!bank) {
            return message.warning('입금 은행명을 입력해 주세요')
        }
        if (!account) {
            return message.warning('입금 계좌번호를 입력해 주세요')
        }
        if (!accountName) {
            return message.warning('예금주를 입력해 주세요')
        }
        if (imgList.length < 1) {
            return message.warning('숙소 이미지를 입력해 주세요')
        }
        if (!cancel) {
            return message.warning('취소 및 환불 규정을 입력해 주세요')
        }


        let total_address = zonecode + ' ' + address

        const data = {
            name: name,
            content: content,
            owner: owner,
            open_date: openDate ? moment(openDate).format('YYYY-MM-DD') : null,
            reg_no: reg,
            address: total_address,
            address_detail: address2,
            tel: tel,
            fax: fax,
            level: level,
            traffic: traffic,
            latitude: latitude,
            longtitude: longtitude,
            type: category,
            refund_rule: cancel,
            parking: parking,
            bank_name: bank,
            account_number: account,
            account_name: accountName,
            cs_info: csInfo,
            receipt_info: receiptInfo,
            common_info: commonInfo
        }
        if (imgList.length > 0) {
            data.images = imgList.join();
        }
        if (facility) {
            let facile = facility.join()
            if (facilityEtc.length > 1) {
                facile = facile + ',' + facilityEtc
            }
            data.options = facile
        }
        // console.log(data)

        await hotel.addInfo(data, user.token, (success, result) => {
            if (success) {
                message.success('게시 완료').then(() => window.location.href='/hotel/list')
            }
        })
        
    }


    const onUploadChange = async (e) => {
        setLoading(true)
        let file = e.target.files[0];
        let reader = new FileReader();

        if (file.size / 1024 / 1024 > 1) {
            message.error('이미지 사이즈는 1MB보다 작아야 합니다')
            setLoading(false)
            return
        }

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
        await setImgList(imgList.filter((e, idx) => idx !== key))
    }

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>숙소 정보 입력</Title>} bordered column={1} extra={<Button onClick={() => router.push('/hotel/list')}>목록으로 돌아가기</Button>}>
                    <Descriptions.Item label="숙소 카테고리">
                        <SelectBar placeholder={"선택하세요"} onChange={(e) => setCategory(e)}>
                            {hotelCategory.map((el, idx) => {
                                return <Select.Option value={el} key={`category_${idx}`}>{el}</Select.Option>
                            })}
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
                        onChange={(e) => {
                            const rateRegExp = /^[0-9.]*$/;
                            if(!rateRegExp.test(e.target.value)) return
                            else setLatitude(e.target.value)
                            }} />
                        <InputLabel>경도 : </InputLabel>
                        <Input 
                        placeholder={"경도"}
                        value={longtitude}
                        style={{width:100, marginRight: '20px'}}
                        onChange={(e) => {
                            const rateRegExp = /^[0-9.]*$/;
                            if(!rateRegExp.test(e.target.value)) return
                            else setLongtitude(e.target.value)}} />
                        
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
                        type={'number'}
                        placeholder={"1~5까지 숫자로 입력해 주세요"}
                        value={level} 
                        onChange={(e) => {
                            const numRegExp = /^[0-9]*$/;
                            if (!numRegExp.test(e.target.value)) return;
                            setLevel(e.target.value)}} />
                    </Descriptions.Item>
                    <Descriptions.Item label="입금 계좌 은행명">
                        <InputValue
                        placeholder={"은행명을 입력해 주세요"}
                        value={bank} 
                        onChange={(e) => setBank(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="입금 계좌번호">
                        <InputValue
                        placeholder={"계좌번호를 입력해 주세요"}
                        value={account} 
                        onChange={(e) => setAccount(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="예금주">
                        <InputValue
                        placeholder={"예금주를 입력해 주세요"}
                        value={accountName} 
                        onChange={(e) => setAccountName(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 이미지">
                        <UploadImgs 
                            imgList={imgList}
                            loading={loading}
                            onUploadChange={onUploadChange}
                            onRemoveImgs={onRemoveImgs} />
                    </Descriptions.Item>
                    <Descriptions.Item label="편의시설">
                        <Checkbox.Group options={options} value={facility} onChange={e => setFacility(e)} />
                        <Tooltip title="콤마(,)로 구분해 입력 바랍니다.">
                            <span>기타 </span>
                            <InputValue 
                            value={facilityEtc} 
                            onChange={e => setFacilityEtc(e.target.value)} />
                        </Tooltip>
                    </Descriptions.Item>
                    <Descriptions.Item label="대표자">
                        <InputValue
                        value={owner} 
                        onChange={e => setOwner(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="사업자 번호">
                        <InputValue
                        value={reg} 
                        maxLength={14}
                        onChange={e => setReg(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="개업일">
                        <DatePicker onChange={(e) => setOpenDate(e)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="호텔 소개">
                        <Input.TextArea
                        value={content} 
                        rows={4}
                        maxLength={100}
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
                    </Descriptions.Item> */}
                    <Descriptions.Item label="주차 정보">
                        <Radio.Group 
                        value={parking}
                        onChange={e => setParking(e.target.value)}
                        buttonStyle="solid"
                        optionType="button"
                        options={[{
                            label: '유료 주차',
                            value: 'P'
                        }, {
                            label: '무료 주차',
                            value: 'Y'
                        }, {
                            label: '주차 불가',
                            value: 'N'
                        }]} />
                    </Descriptions.Item>
                    <Descriptions.Item label="취소 및 환불 규정">
                        <Input.TextArea
                        value={cancel} 
                        rows={4}
                        onChange={(e) => setCancel(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="고객센터 안내">
                        <Input.TextArea
                        value={csInfo} 
                        rows={4}
                        onChange={(e) => setCsInfo(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="영수증 발급 안내">
                        <Input.TextArea
                        value={receiptInfo} 
                        rows={4}
                        onChange={(e) => setReceiptInfo(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="공통 적용사항 안내">
                        <Input.TextArea
                        value={commonInfo} 
                        rows={4}
                        onChange={(e) => setCommonInfo(e.target.value)} />
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