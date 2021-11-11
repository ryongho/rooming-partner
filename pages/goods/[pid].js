import styled from 'styled-components'
import { Descriptions, Input, Button, message, Select, DatePicker, Checkbox, Radio, Modal } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { LoadingOutlined, PlusOutlined, PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import UploadImgs from '../../components/atom/UploadImgs'
import { useStore } from '../../store/StoreProvider'
import moment from 'moment';

const GoodsDetail = () => {
    const data = {
        key: '1',
        goods: '여름날 치맥 파티',
        active: true,
        rooms: '스탠다드 트윈',
        roomDetail: '',
        category: '호텔',
        hotel: '라마다 프라자 바이 윈덤 여수 호텔',
        facility: ['주차가능', '무료 wifi'],
        zonecode: '1234',
        address: '주소',
        address2: '',
        tel: '0212341234',
        thumb: '',
        imgList: [],
        breakfast: '제공되는 조식 없음',
        parking: '300대 주차 가능',
        cancel: '예약 당일 취소 가능',
        partner: '파트너1234',
    }

    const router = useRouter();
    const { user, goods, room } = useStore();

    const [isAdmin, setIsAdmin] = useState(true);
    const [modiStatus, setModiStatus] = useState(false)
    
    const options = ['룸서비스', '사진 무한 촬영', '조식 패키지', '파티 용품 제공']
    const [roomId, setRoomId] = useState()
    const [name, setName] = useState()
    const [start, setStart] = useState()
    const [end, setEnd] = useState()
    const [price, setPrice] = useState()
    const [salePrice, setSalePrice] = useState()
    const [rate, setRate] = useState()
    const [minNight, setMinNight] = useState()
    const [maxNight, setMaxNight] = useState()
    const [option, setOption] = useState(false)
    const [breakfast, setBreakfast] = useState()
    const [parking, setParking] = useState()
    const [fileList, setFileList] = useState([])
    const [imgList, setImgList] = useState([])
    const [loading, setLoading] = useState(false)
    const [showDelete, setShowDelete] = useState(false)

    useEffect(() => {
        const callDetail = async() => {
            if (router.query.type) setModiStatus(true)
            else setModiStatus(false)

            await goods.callInfo({id: router.query.pid}, user.token)
            await room.callRoomList({hotel_id: user.hotelid}, user.token)
            
            console.log(goods.info)

            if (goods.info.data[0]) {
                setRoomId(goods.info.data[0].room_id)
                setName(goods.info.data[0].goods_name)
                setStart(goods.info.data[0].start_date)
                setEnd(goods.info.data[0].end_date)
                setPrice(goods.info.data[0].price)
                setSalePrice(goods.info.data[0].sale_price)
                setRate(goods.info.data[0].grade)
                setMinNight(goods.info.data[0].min_nights)
                setMaxNight(goods.info.data[0].max_nights)
                setOption(goods.info.data[0].options.split(","))
                setBreakfast(goods.info.data[0].breakfast)
                setParking(goods.info.data[0].parking)
                setImgList(goods.info.images)
            }
        }
        callDetail();
    }, [router])

    const onDataChange = (e, val) => {
        const numRegExp = /^[0-9]*$/;
        if (!router.query.type) return;
        if (val == 'bedNum' || val == 'bedNum2' || val == 'bedNum3') {
            if (!numRegExp.test(e.target.value)) return;
        }
        if (val == 'goods') setGoods(e.target.value);
        if (val == 'active') setActive(e);
        if (val == 'rooms') setRooms(e);
        if (val == 'price') setPrice(e.target.value);
        if (val == 'salePrice') setSalePrice(e.target.value);
        if (val == 'rate') setRate(e.target.value);
        if (val == 'people') setDesc(e.target.value);
        if (val == 'desc') setPeople(e.target.value);
        if (val == 'checkIn') setCheckIn(e.target.value);
        if (val == 'checkOut') setCheckOut(e.target.value);
        if (val == 'bed') setBed(e.target.value);
        if (val == 'bed2') setBed2(e.target.value);
        if (val == 'bed3') setBed3(e.target.value);
        if (val == 'bedNum') setBedNum(e.target.value);
        if (val == 'bedNum2') setBedNum2(e.target.value);
        if (val == 'bedNum3') setBedNum3(e.target.value);
        if (val == 'roomsDesc') setRoomsDesc(e.target.value);
    }

    const onUploadChange = async(e) => {
        setLoading(true)
        let file = e.target.files[0];
        let reader = new FileReader();

        reader.onloadend = async(e) => {
            await goods.imagesUpload(file, user.token, (success, data) => {
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

    const onModi = () => {
        if (!router.query.type) router.push('/goods/1?type=modi');
        else {
            if (!goods) {
                return message.warning('상품명을 입력해 주세요')
            }
            if (!price) {
                message.warning('상품 원가를 입력해 주세요')
            }
            if (!salePrice) {
                message.warning('할인가를 입력해 주세요')
            }
            if (!rate) {
                message.warning('할인율을 입력해 주세요')
            }
            if (!desc) {
                message.warning('상품 정보를 입력해 주세요')
            }
            if (imgList.length < 1) {
                message.warning('상품 사진을 입력해 주세요')
            }

            // success
        }
    }

    const onDeleteLists = () => {

        // success
        router.push('/goods/list');
    }

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>상품 상세 정보</Title>} bordered column={1} 
                extra={
                    <>
                        <Button type="danger" onClick={() => setShowDelete(true)} style={{marginRight: '8px'}}>삭제</Button>
                        <Button onClick={() => router.push('/goods/list')}>목록으로 돌아가기</Button>
                    </>
                }>
                    <Descriptions.Item label="상품명">
                        {modiStatus ?
                        <InputValue
                        value={name} 
                        onChange={(e) => onDataChange(e, 'name')}
                        bordered={modiStatus} />
                        : name}
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 판매 개시일">
                        {modiStatus ?
                        <DatePicker
                        defaultValue={moment(start)}
                        onChange={e => setStart(moment(e).format('YYYY-MM-DD'))} />
                        : start}
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 판매 종료일">
                    {modiStatus ?
                        <DatePicker
                        defaultValue={moment(end)}
                        onChange={e => setEnd(moment(e).format('YYYY-MM-DD'))} />
                        :end}
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="상품 상태값">
                        <GoodsWrap>
                            <Radio.Group defaultValue={data.active ? "active" : "notActive"} onChange={(e) => onDataChange(e, 'active')}>
                                <Radio.Button value="active" buttonStyle="solid">활성화</Radio.Button>
                                <Radio.Button value="notActive">비활성화</Radio.Button>
                            </Radio.Group>
                        </GoodsWrap>
                        <GoodsInfo>※ 비활성화된 상품은 앱에서 비공개 처리 됩니다.</GoodsInfo>
                    </Descriptions.Item> */}
                    <Descriptions.Item label="객실 선택">
                        <RoomsWrap>
                        {modiStatus ?
                            <SelectBar defaultValue={goods.info?.data[0]?.room_name} onChange={(e) => setRooms(e)}>
                                {room.rooms && 
                                room.rooms.slice().map(item => {
                                    return (
                                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                    )
                                })}
                            </SelectBar>
                            : goods.info?.data[0]?.room_name }
                            <Button type="primary" size="small" onClick={() => router.push('/rooms/list')} style={{fontSize: '12px'}}>객실 추가 및 수정</Button>
                        </RoomsWrap>
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 원가">
                    {modiStatus ?
                        <InputValue
                        value={price}
                        onChange={(e) => onDataChange(e, 'price')}
                        bordered={modiStatus} />
                        : <>{price}원</> } 
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 할인가">
                    {modiStatus ?
                        <InputValue
                        value={salePrice} 
                        onChange={(e) => onDataChange(e, 'salePrice')}
                        bordered={modiStatus} />
                        : <>{salePrice}원</> }
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 할인율">
                    {modiStatus ?
                        <InputValue
                        value={rate} 
                        onChange={(e) => onDataChange(e, 'rate')}
                        bordered={modiStatus} />
                        : rate} %
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 이미지">
                        <UploadImgs 
                        imgList={imgList}
                        loading={loading}
                        onUploadChange={onUploadChange}
                        onRemoveImgs={onRemoveImgs}
                        modiStatus={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="최소 박 수">
                    {modiStatus ?
                        <Input
                        value={minNight} 
                        onChange={e => {
                        const numRegExp = /^[0-9]*$/;
                        if (!numRegExp.test(e.target.value)) return;
                        setMinNight(e.target.value)}}
                        style={{width:50}} /> : minNight }일
                    </Descriptions.Item>
                    <Descriptions.Item label="최대 박 수">
                    {modiStatus ?
                        <Input
                        value={maxNight} 
                        onChange={e => {
                        const numRegExp = /^[0-9]*$/;
                        if (!numRegExp.test(e.target.value)) return;
                        setMaxNight(e.target.value)}}
                        style={{width:50}} /> : maxNight }일
                    </Descriptions.Item>
                    <Descriptions.Item label="조식 정보">
                    {modiStatus ?
                        <Input.TextArea
                        value={breakfast} 
                        rows={4}
                        onChange={null} />
                        :breakfast }
                    </Descriptions.Item>
                    <Descriptions.Item label="주차 정보">
                    {modiStatus ?
                        <Input.TextArea
                        value={parking} 
                        rows={4}
                        onChange={null} />
                        : parking}
                    </Descriptions.Item>
                    <Descriptions.Item label="옵션">
                    {modiStatus ?
                        <Checkbox.Group options={options} value={option} onChange={e => setOption(e)} /> : goods.info?.data[0]?.options }
                    </Descriptions.Item>
                </Descriptions>

                <ButtonWrap>
                    <Button type="primary" onClick={onModi}>{modiStatus ? '수정완료' : '수정'}</Button>
                    {modiStatus ?
                    <Button onClick={() => router.replace(`/goods/${router.query.pid}`, undefined, {shallow: true}).then(() => window.scrollTo(0,0))}>취소</Button>
                    : <Button onClick={() => router.push('/goods/list')}>목록</Button>
                    }
                </ButtonWrap>
            </Detail>
            
            <Modal
            visible={showDelete}
            okText={'네'}
            cancelText={'아니오'}
            onOk={onDeleteLists}
            onCancel={() => setShowDelete(false)}
            >
                정말 삭제하시겠습니까?
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
    padding-left: 5px;
    color: #666;
    font-size: 15px;
`

const RoomsWrap = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const InputValue = styled(Input)`
    width: 400px;
`

const SelectBar = styled(Select)`
    width: 150px;
`

const InputBedWrap = styled.div`
    display: flex;
    margin-bottom: 8px;
`

const InputValueBed = styled(Input)`
    width: 190px;
    
    &:first-child {
        margin-right: 5px;
    }
`

const ImgWrap = styled.div`
    img {
        width: 100px;
        margin-right: 8px;
    }
`

const UploadBtn = styled.div`
    margin-top: 8px;
`

const UploadLength = styled.div`
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

const AddBtn = styled(Button)`
    border: none;
`

const DeleteBtn = styled(Button)`
    border: none;
`

const Empty = styled.div`
    padding-top: 30px;
`

export default GoodsDetail