import styled from 'styled-components'
import { Descriptions, Input, Button, message, DatePicker, Modal, Select, Checkbox, Radio, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import DaumPostcode from 'react-daum-postcode';
import ModiImgs from '../../components/atom/ModiImgs'
import { useStore } from '../../store/StoreProvider'
import moment from 'moment'

const HotelDetail = () => {
    const { user, hotel, goods } = useStore();
    const router = useRouter();

    const [modiStatus, setModiStatus] = useState(false)
    const hotelCategory = ['호텔', '모텔', '펜션/풀빌라', '리조트', '글램핑/캠핑', '게스트하우스', '한옥', '공유숙박']
    const options = ['넷플릭스', '유튜브', '디즈니', '왓챠', '쿠팡플레이', '레스토랑', '피트니스', '야외수영장', '실내수영장', '사우나', '스파',  '공유키친', '세미나룸', '세탁실', '주차공간', '무료wifi', 'PC', '노트북', '안마의자', '비데', '욕조', '월풀', '반신욕기계']
    const [category, setCategory] = useState()
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
    const [imgList, setImgList] = useState()
    const [fileList, setFileList] = useState()
    const [parking, setParking] = useState()
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
    const [csInfo, setCsInfo] = useState()
    const [receiptInfo, setReceiptInfo] = useState()
    const [commonInfo, setCommonInfo] = useState()
    const [showAddress, setShowAddress] = useState(false)

    useEffect(() => {
        // 호텔 상세 정보 불러오기
        const callDetail = async() => {

            if (router.query.type) setModiStatus(true)
            else setModiStatus(false)

            await hotel.callInfo({id: user.hotelid}, user.token)
            await goods.callListPartner(user.token)
            await user.callInfo(user.token);

            if (hotel.info.data[0]) {
                setCategory(hotel.info.data[0].type)
                setName(hotel.info.data[0].name)
                setFacility(hotel.info.data[0].options?.split(",").filter(el => options.includes(el)))
                setFacilityEtc(hotel.info.data[0].options?.split(",").filter(el => !options.includes(el) && el !== ''))
                setAddress(hotel.info.data[0].address.slice(6, hotel.info.data[0].address.length))
                setAddress2(hotel.info.data[0].address_detail)
                setZonecode(hotel.info.data[0].address.slice(0, 5))
                setTel(hotel.info.data[0].tel)
                setBank(hotel.info.data[0].bank_name)
                setAccount(hotel.info.data[0].account_number)
                setAccountName(hotel.info.data[0].account_name)
                setImgList(hotel.info.images)

                let list = Array.from(Array(10).keys());
                for (let i = 0; i <= list.length; i++) {
                    hotel.info.images.map(el => {
                        if (el.order_no == list[i] + 1) {
                            let removed = list.splice(i, 1, el);
                        }
                    })
                }
                setFileList(list)
                setCancel(hotel.info.data[0].refund_rule)
                setContent(hotel.info.data[0].content)
                setOwner(hotel.info.data[0].owner)
                setReg(hotel.info.data[0].reg_no)
                setOpenDate(String(hotel.info.data[0].open_date))
                setTraffic(hotel.info.data[0].traffic)
                setLevel(hotel.info.data[0].level)
                setFax(hotel.info.data[0].fax)
                setLongtitude(hotel.info.data[0].longtitude)
                setLatitude(hotel.info.data[0].latitude)
                setParking(hotel.info.data[0].parking)
                setCsInfo(hotel.info.data[0].cs_info)
                setReceiptInfo(hotel.info.data[0].receipt_info)
                setCommonInfo(hotel.info.data[0].common_info)
            }
        }
        callDetail();
    }, [router])

    // 정보 변경시 change event
    const onDataChange = (e, val) => {
        const numRegExp = /^[0-9]*$/
        if (!router.query.type) return;
        if (val == 'tel') {
            if (!numRegExp.test(e.target.value)) return
            setTel(e.target.value);
        }
        if (val == 'category') setCategory(e);
        if (val == 'name') setName(e.target.value);
        if (val == 'facility') setFacility(e);
        if (val == 'facilityEtc') setFacilityEtc(e.target.value);
        if (val == 'zonecode') setZonecode(e.target.value);
        if (val == 'address') setAddress(e.target.value);
        if (val == 'address2') setAddress2(e.target.value);
        if (val == 'content') setContent(e.target.value);
        if (val == 'owner') setOwner(e.target.value);
        if (val == 'cancel') setCancel(e.target.value);
        if (val == 'bank') setBank(e.target.value);
        if (val == 'account') setAccount(e.target.value);
        if (val == 'accountName') setAccountName(e.target.value);
        if (val == 'reg') {
            const regExp = /^[0-9-]*$/;
            if (!regExp.test(e.target.value)) return;
            setReg(e.target.value);
        }
        if (val == 'traffic') setTraffic(e.target.value);
        if (val == 'level') setLevel(e.target.value);
        if (val == 'fax') setFax(e.target.value);
        if (val == 'longtitude') setLongtitude(e.target.value);
        if (val == 'latitude') setLatitude(e.target.value);
        if (val == 'csInfo') setCsInfo(e.target.value);
        if (val == 'receiptInfo') setReceiptInfo(e.target.value);
        if (val == 'commonInfo') setCommonInfo(e.target.value);
    }

    // 업로드 이미지 수정시 change event
    const onUploadChange = async (e, item) => {
        let file = e.target.files[0];
        let reader = new FileReader();

        if (file.size / 1024 / 1024 > 1) {
            message.error('이미지 사이즈는 1MB보다 작아야 합니다')
            setLoading(false)
            return
        }
        
        reader.onloadend = async (e) => {

            await hotel.imagesUpload(file, user.token, (success, data) => {
                if (success) {
                    let img_file = data.images.toString();
                    hotel.imagesUpdate(router.query.pid, item, img_file, user.token, (success, data) => {
                        if (success) {
                            setImgList(imgList.concat(img_file))
                            let copy = fileList.slice()
                            let removed = copy.splice(item - 1, 1, img_file)
                            setFileList(copy)
                        }
                    })
                }
            })
        }
        if (file) reader.readAsDataURL(file);
    }
    
    // 업로드 이미지 삭제 이벤트
    const onRemoveImgs = async(key) => {
        setImgList(imgList.filter((e, idx) => idx !== key))
        let copy = fileList.slice()
        let removed = copy.splice(key - 1, 1, key - 1)
        setFileList(copy)
        await hotel.imagesDel(router.query.pid, key, user.token)
    }

    // 수정완료 클릭시
    const onModi = async () => {
        if (!router.query.type) window.location.href =`/hotel/${user.hotelid}?type=modi`;
        else {
            if (!name) {
                return message.warning('숙소명을 입력해 주세요')
            }
            if (!zonecode || !address) {
                return message.warning('숙소 주소를 입력해 주세요')
            }
            if (!tel) {
                return message.warning('숙소 연락처를 입력해 주세요')
            }
            if (reg?.length > 12) {
                return message.warning('사업자 번호를 정확히 입력해 주세요')
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
                return message.warning('숙소 사진을 입력해 주세요')
            }
            if (!cancel) {
                return message.warning('취소 및 환불 규정을 입력해 주세요')
            }

            // success
            let total_address = zonecode + ' ' + address

            const data = {
                id: user.hotelid,
                name: name,
                content: content,
                open_date: openDate,
                address: total_address,
                address_detail: address2,
                tel: tel,
                fax: fax,
                level: level,
                owner: owner,
                reg_no: reg,
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

            if (facility) {
                let facile = facility.join()
                if (facilityEtc) {
                    facile = facile + ',' + facilityEtc
                }
                data.options = facile
            }

            await hotel.updateInfo(data, user.token, (success, result) => {
                if (success) {
                    message.success('수정 완료')
                    window.location.href=`/hotel/${user.hotelid}`
                }
            })
        }
    }

    return (
        <Wrapper>
            <Detail>
                <Descriptions 
                title={<Title>숙소 상세 정보</Title>} 
                bordered 
                column={1} 
                extra={
                    <>
                        {!router.query.type && <Button type="primary" onClick={onModi} style={{marginRight: '10px'}}>수정</Button>}
                        <Button onClick={() => router.push('/hotel/list')}>목록으로 돌아가기</Button>
                    </>
                }
                labelStyle={{width: '220px', minWidth: '180px'}}>
                    <Descriptions.Item label="숙소 카테고리" >
                        {hotel?.info?.data[0].type &&
                            modiStatus ?
                            <SelectBar defaultValue={hotel?.info?.data[0].type} onChange={(e) => onDataChange(e, 'category')}>

                                {hotelCategory.map((el, idx) => {
                                    return <Select.Option value={el} key={`category_${idx}`}>{el}</Select.Option>
                                })}
                            </SelectBar>
                            : hotel?.info?.data[0].type
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소명">
                        {modiStatus ?
                            <InputValue 
                            value={name} 
                            onChange={(e) => onDataChange(e, 'name')}
                            bordered={modiStatus} />
                            : name
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 주소">
                        {modiStatus ?
                            <>
                            <Input 
                            placeholder={modiStatus ? "우편번호" : null}
                            disabled={modiStatus}
                            bordered={modiStatus}
                            value={zonecode}
                            style={{width:100}} />
                            <Button onClick={()=> setShowAddress(true)} style={{marginLeft:5}}>주소검색</Button>
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
                            </>
                            : <>{zonecode} {address} {address2}</>
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 상세 위치">
                        {modiStatus ?
                        <>
                            <span>위도 : </span>
                            <Input 
                            placeholder={"위도"}
                            value={latitude}
                            style={{width:160, marginRight: '10px', marginLeft: '5px'}}
                            onChange={(e) => onDataChange(e, 'latitude')} />
                            <span>경도 : </span>
                            <Input 
                            placeholder={"경도"}
                            value={longtitude}
                            style={{width:160}}
                            onChange={(e) => onDataChange(e, 'longtitude')} />
                            <a href="https://www.google.com/maps/search/" target='_blank' style={{marginLeft: '15px'}}>
                                <Button>주소로 경도/위도 찾기</Button>
                            </a>
                        </>
                        : 
                        <>
                            <span>위도 : </span>
                            {latitude}
                            <span style={{marginLeft: '20px'}}>경도 : </span>
                            {longtitude}
                        </>
                        }
                        
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 연락처">
                        {modiStatus ?
                        <InputValue
                        placeholder={"'-'없이 번호만 입력해 주세요"}
                        value={tel} 
                        onChange={(e) => onDataChange(e, 'tel')}
                        bordered={modiStatus} />
                        : tel}
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 팩스">
                        {modiStatus ?
                        <InputValue
                        placeholder={"'-'없이 번호만 입력해 주세요"}
                        value={fax} 
                        onChange={(e) => onDataChange(e, 'fax')}
                        bordered={modiStatus} />
                        : fax}
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 등급">
                        {modiStatus ?
                        <InputValue
                        type={'number'}
                        placeholder={"1~5까지 숫자로 입력해 주세요"}
                        value={level} 
                        onChange={(e) => onDataChange(e, 'level')}
                        bordered={modiStatus} />
                        : level}
                    </Descriptions.Item>
                    <Descriptions.Item label="입금 계좌 은행명">
                        {modiStatus ?
                        <InputValue
                        placeholder={"은행명을 입력해 주세요"}
                        value={bank} 
                        onChange={(e) => onDataChange(e, 'bank')}
                        bordered={modiStatus} />
                        : bank}
                    </Descriptions.Item>
                    <Descriptions.Item label="입금 계좌번호">
                        {modiStatus ?
                        <InputValue
                        placeholder={"계좌번호를 입력해 주세요"}
                        value={account} 
                        onChange={(e) => onDataChange(e, 'account')}
                        bordered={modiStatus} />
                        : account}
                    </Descriptions.Item>
                    <Descriptions.Item label="예금주">
                        {modiStatus ?
                        <InputValue
                        placeholder={"예금주를 입력해 주세요"}
                        value={accountName} 
                        onChange={(e) => onDataChange(e, 'accountName')}
                        bordered={modiStatus} />
                        : accountName}
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 이미지">
                        <ModiImgs 
                        imgList={imgList}
                        fileList={fileList}
                        onUploadChange={onUploadChange}
                        onRemoveImgs={onRemoveImgs}
                        modiStatus={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="편의시설">
                    {modiStatus ?
                        <>
                        <Checkbox.Group options={options} value={facility} onChange={e => onDataChange(e, 'facility')} /> 
                        <Tooltip title="콤마(,)로 구분해 입력 바랍니다.">
                            <span>기타 </span>
                            <InputValue 
                            value={facilityEtc} 
                            onChange={e => onDataChange(e, 'facilityEtc')} />
                        </Tooltip>
                        </>
                        : (facility && !facilityEtc?.length > 0) ? facility.join(', ') : (!facility?.length > 0 && facilityEtc) ? facilityEtc.join(', ') : (facility && facilityEtc) ? facility.join(', ') + ', ' + facilityEtc.join(', ') : null}
                    </Descriptions.Item>
                    <Descriptions.Item label="주차 정보">
                    {modiStatus ?
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
                        : parking == 'Y' ? '주차 가능' : parking == 'N' ? '주차 불가' : parking == 'P' ? '유료 주차' : null}
                    </Descriptions.Item>
                    <Descriptions.Item label="대표자">
                        {modiStatus ?
                        <InputValue
                        value={owner} 
                        onChange={e => onDataChange(e, 'owner')}
                        bordered={modiStatus} />
                        : owner }
                    </Descriptions.Item>
                    <Descriptions.Item label="사업자 번호">
                        {modiStatus ? 
                        <InputValue
                        value={reg} 
                        maxLength={14}
                        onChange={e => onDataChange(e, 'reg')}
                        bordered={modiStatus} />
                        : reg }
                    </Descriptions.Item>
                    <Descriptions.Item label="개업일">
                        {modiStatus ?
                        <DatePicker 
                        defaultValue={moment(openDate)}
                        format={'YYYY-MM-DD'} 
                        value={moment(openDate)}
                        onChange={(e, str) => setOpenDate(str)} />
                        : openDate }
                    </Descriptions.Item>
                    <Descriptions.Item label="호텔 소개">
                        <Input.TextArea
                        value={content} 
                        rows={4}
                        maxLength={100}
                        onChange={(e) => onDataChange(e, 'content')} />
                    </Descriptions.Item>
                    <Descriptions.Item label="교통 정보">
                        <Input.TextArea
                        value={traffic} 
                        rows={4}
                        onChange={(e) => onDataChange(e, 'traffic')} />
                    </Descriptions.Item>
                    <Descriptions.Item label="취소 및 환불 규정">
                        <Input.TextArea
                        value={cancel} 
                        rows={4}
                        onChange={(e) => onDataChange(e, 'cancel')} />
                    </Descriptions.Item>
                    <Descriptions.Item label="고객센터 안내">
                        <Input.TextArea
                        value={csInfo} 
                        rows={4}
                        onChange={(e) => onDataChange(e, 'csInfo')} />
                    </Descriptions.Item>
                    <Descriptions.Item label="영수증 발급 안내">
                        <Input.TextArea
                        value={receiptInfo} 
                        rows={4}
                        onChange={(e) => onDataChange(e, 'receiptInfo')} />
                    </Descriptions.Item>
                    <Descriptions.Item label="공통 적용사항 안내">
                        <Input.TextArea
                        value={commonInfo} 
                        rows={4}
                        onChange={(e) => onDataChange(e, 'commonInfo')} />
                    </Descriptions.Item>

                    <Descriptions.Item label="파트너 정보">
                        <HotelBtn onClick={() => router.push('/user/partner/detail')}>{user.info?.data?.nickname}</HotelBtn>
                    </Descriptions.Item>
                    <Descriptions.Item label="등록된 상품">
                        {goods.partnerList?.data != '' ?
                            goods.partnerList?.data?.map(item => {
                                return (
                                    <GoodsWrap key={`goods_${item.goods_id}`}>
                                        <GoodsBtn onClick={() => router.push(`/goods/${item.goods_id}`)}>{item.goods_name}</GoodsBtn>
                                    </GoodsWrap>
                                )
                            }) : <>등록된 상품이 없습니다.</>
                        }
                    </Descriptions.Item>
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onModi}>{modiStatus ? '수정완료' : '수정'}</Button>
                    {modiStatus ?
                    <Button onClick={() => router.replace(`/hotel/${user.hotelid}`, undefined, {shallow: true}).then(() => window.scrollTo(0,0))}>취소</Button>
                    : <Button onClick={() => router.push('/hotel/list')}>목록</Button>
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

const SelectBar = styled(Select)`
    width: 150px;
`

const UploadLength = styled.div`
    margin-top: 5px;
    font-size: 12px;
    color: #999
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
const GoodsWrap = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 6px;
`

const GoodsBtn = styled(HotelBtn)`
    margin-right: 10px;
`

const GoodsInfo = styled.div`
    margin-top: 22px;
    font-size: 12px;    
    color: #666;
`

const ButtonWrap = styled.div`
    display: flex;
    justify-content: center;
    padding: 25px 0 10px;

    button:first-child {
        margin-right: 10px;
    }
`


export default HotelDetail