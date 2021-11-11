import styled from 'styled-components'
import { Descriptions, Input, Button, message, DatePicker, Modal, Select, Checkbox, Radio } from 'antd'
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
    const options = ['주차가능', '레스토랑', '수영장', '스파', '피트니스', '무료 wifi', 'cctv', '소형냉장고']
    const [category, setCategory] = useState()
    const [name, setName] = useState()
    const [facility, setFacility] = useState([])
    const [address, setAddress] = useState()
    const [address2, setAddress2] = useState('')
    const [zonecode, setZonecode] = useState()
    const [tel, setTel] = useState()
    const [imgList, setImgList] = useState([])
    const [fileList, setFileList] = useState(Array.from(Array(10).keys()))
    const [loading, setLoading] = useState(false)
    // const [breakfast, setBreakfast] = useState()
    // const [parking, setParking] = useState()
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

    useEffect(() => {
        const callDetail = async() => {

            if (router.query.type) setModiStatus(true)
            else setModiStatus(false)

            await hotel.callInfo({id: user.hotelid}, user.token)
            await goods.callListPartner({id: user.hotelid}, user.token)
            await user.callInfo(user.token);

            // console.log(hotel.info, goods.partnerList.data)
            if (hotel.info.data[0]) {
                setCategory(hotel.info.data[0].type)
                setName(hotel.info.data[0].name)
                setFacility(hotel.info.data[0].options.split(","))
                setAddress(hotel.info.data[0].address.slice(0, hotel.info.data[0].address.length - 5))
                setAddress2(hotel.info.data[0].address_detail)
                setZonecode(hotel.info.data[0].address.slice(hotel.info.data[0].address.length - 5))
                setTel(hotel.info.data[0].tel)
                setImgList(hotel.info.images)

                setFileList(hotel.info.images)
                setCancel(hotel.info.data[0].refund_rule)
                setContent(hotel.info.data[0].content)
                setOwner(hotel.info.data[0].owner)
                setReg(hotel.info.data[0].reg_no)
                setOpenDate(hotel.info.data[0].open_date)
                setTraffic(hotel.info.data[0].traffic)
                setLevel(hotel.info.data[0].level)
                setFax(hotel.info.data[0].fax)
                setLongtitude(hotel.info.data[0].longtitude)
                setLatitude(hotel.info.data[0].latitude)
            }
        }
        callDetail();
    }, [router])

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
        if (val == 'zonecode') setZonecode(e.target.value);
        if (val == 'address') setAddress(e.target.value);
        if (val == 'address2') setAddress2(e.target.value);
        if (val == 'content') setContent(e.target.value);
        if (val == 'owner') setOwner(e.target.value);
        if (val == 'cancel') setCancel(e.target.value);
        if (val == 'reg') setReg(e.target.value);
        if (val == 'openDate') setOpenDate(e.target.value);
        if (val == 'traffic') setTraffic(e.target.value);
        if (val == 'level') setLevel(e.target.value);
        if (val == 'fax') setTraffic(e.target.value);
        if (val == 'longtitude') setLongtitude(e.target.value);
        if (val == 'latitude') setLatitude(e.target.value);
    }

    const onUploadChange = async (e, item) => {
        setLoading(true)
        let file = e.target.files[0];
        let reader = new FileReader();

        reader.onloadend = async(e) => {
            await hotel.imagesUpdate(user.hotelid, item, file, user.token, async (success, data) => {
                if (success) {
                    await hotel.callInfo({id: user.hotelid}, user.token)
                    console.log('!!!!!!!!!!!!!imgs:', hotel.info.images)
                    // setImgList(imgList.concat(data.images))
                    setLoading(false)
                    // console.log(imgList)
                }
            })
        }
        if (file) reader.readAsDataURL(file);

    }

    const onRemoveImgs = async(key) => {
        setImgList(imgList.filter((e, idx) => idx !== key))
        
        await hotel.imagesDel(user.hotelid, key, user.token)
    }
    
    const onModi = async () => {
        if (!router.query.type) router.push(`/hotel/${user.hotelid}?type=modi`);
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
            if (imgList.length < 1) {
                message.warning('숙소 사진을 입력해 주세요')
            }
            if (!cancel) {
                return message.warning('취소 및 환불 규정을 입력해 주세요')
            }

            // success
            // const images = imgList.join();

            const option = facility.join();

            let total_address = zonecode + ' ' + address

            const data = {
                id: user.hotelid,
                name: name,
                content: content,
                open_date: moment(openDate).format('YYYY-MM-DD'),
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
                options: option,
                refund_rule: cancel,
            }
            
            console.log(data)

            await hotel.updateInfo(data, user.token, (success, result) => {
                if (success) {
                    message.success('수정 완료')
                    window.location.href='/hotel/list'
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
                extra={<Button onClick={() => router.push('/hotel/list')}>목록으로 돌아가기</Button>}
                labelStyle={{width: '220px', minWidth: '180px'}}>
                    <Descriptions.Item label="숙소 카테고리" >
                        {hotel?.info?.data[0].type &&
                            modiStatus ?
                            <SelectBar defaultValue={hotel?.info?.data[0].type} onChange={(e) => onDataChange(e, 'category')}>
                                <Select.Option value={"호텔"}>호텔</Select.Option>
                                <Select.Option value={"모텔"}>모텔</Select.Option>
                                <Select.Option value={"펜션"}>펜션</Select.Option>
                                <Select.Option value={"콘도"}>콘도</Select.Option>
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
                            : <>{zonecode} {address}</>
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
                        placeholder={"숫자로 입력해 주세요"}
                        value={level} 
                        onChange={(e) => onDataChange(e, 'level')}
                        bordered={modiStatus} />
                        : level}
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 이미지">
                        <ModiImgs 
                        imgList={imgList}
                        loading={loading}
                        onUploadChange={onUploadChange}
                        onRemoveImgs={onRemoveImgs}
                        modiStatus={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="편의시설">
                        <Checkbox.Group options={options} value={facility} onChange={e => onDataChange(e, 'facility')} />
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
                        onChange={e => onDataChange(e, 'reg')}
                        bordered={modiStatus} />
                        : reg }
                    </Descriptions.Item>
                    <Descriptions.Item label="개업일">
                        {modiStatus ?
                        <DatePicker defaultValue={moment(openDate, 'YYYY-MM-DD')} onChange={(e) => onDataChange(e, 'opendate')} />
                        : openDate }
                    </Descriptions.Item>
                    <Descriptions.Item label="호텔 소개">
                        <Input.TextArea
                        value={content} 
                        rows={4}
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

                    <Descriptions.Item label="파트너 정보">
                        <HotelBtn onClick={() => router.push('/user/partner/detail')}>{user.info?.data?.nickname}</HotelBtn>
                    </Descriptions.Item>
                    <Descriptions.Item label="등록된 상품">
                        {goods.partnerList?.data != '' ?
                            goods.partnerList?.data?.map(item => {
                                return (
                                    <GoodsWrap>
                                        <GoodsBtn onClick={() => router.push(`/goods/${item.goods_id}`)}>{item.goods_name}</GoodsBtn>
                                    </GoodsWrap>
                                )
                            }) : <>등록된 상품이 없습니다.</>
                        }
                        {/* <GoodsInfo>※ 비활성화된 상품은 앱에서 비공개 처리 됩니다.</GoodsInfo> */}
                    </Descriptions.Item>
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onModi}>{modiStatus ? '수정완료' : '수정'}</Button>
                    {modiStatus ?
                    <Button onClick={() => router.replace('/hotel/1', undefined, {shallow: true}).then(() => window.scrollTo(0,0))}>취소</Button>
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