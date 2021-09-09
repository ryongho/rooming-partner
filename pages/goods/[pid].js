import styled from 'styled-components'
import { Descriptions, Input, Button, message, Select, Upload, Checkbox, Radio, Modal } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { LoadingOutlined, PlusOutlined, PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import UploadImgs from '../../components/atom/UploadImgs'

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

    const options = ['주차가능', '레스토랑', '수영장', '스파', '피트니스', '무료 wifi']
    const [isAdmin, setIsAdmin] = useState(true);
    const [modiStatus, setModiStatus] = useState(false)

    const [goods, setGoods] = useState(data.goods)
    const [active, setActive] = useState(data.active)
    const [rooms, setRooms] = useState(data.rooms)
    const [price, setPrice] = useState(data.price)
    const [salePrice, setSalePrice] = useState(data.salePrice)
    const [rate, setRate] = useState(data.rate)
    const [desc, setDesc] = useState(data.desc)
    const [thumb, setThumb] = useState(data.thumb)
    const [imgList, setImgList] = useState(data.imgList)
    const [thumbLoading, setThumbLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState()
    const [showDelete, setShowDelete] = useState(false)

    const times = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
    const [people, setPeople] = useState()
    const [checkIn, setCheckIn] = useState()
    const [checkOut, setCheckOut] = useState()
    const [bed, setBed] = useState()
    const [bed2, setBed2] = useState()
    const [bed3, setBed3] = useState()
    const [bedNum, setBedNum] = useState()
    const [bedNum2, setBedNum2] = useState()
    const [bedNum3, setBedNum3] = useState()
    const [roomsDesc, setRoomsDesc] = useState()
    const [showAddBed, setShowAddBed] = useState(0)

    useEffect(() => {
        console.log(router.query.type)
        if (router.query.type) setModiStatus(true)
        else setModiStatus(false)
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
        if (!router.query.type) return;
        if (e.file.status === 'uploading') {
            return setThumbLoading(true);
        }
        if (e.file.status === 'done') {
            const reader = new FileReader();
            reader.addEventListener('load', () => (setThumb(reader.result)));
            reader.readAsDataURL(e.file.originFileObj);
            setThumbLoading(false)
        }
    }

    const onUploadChange = async(e) => {
        setImgList(e.fileList)
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
            if (!thumb) {
                message.warning('상품 썸네일을 입력해 주세요')
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
                        <InputValue
                        value={goods} 
                        onChange={(e) => onDataChange(e, 'goods')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 상태값">
                        <GoodsWrap>
                            <Radio.Group defaultValue={data.active ? "active" : "notActive"} onChange={(e) => onDataChange(e, 'active')}>
                                <Radio.Button value="active" buttonStyle="solid">활성화</Radio.Button>
                                <Radio.Button value="notActive">비활성화</Radio.Button>
                            </Radio.Group>
                        </GoodsWrap>
                        <GoodsInfo>※ 비활성화된 상품은 앱에서 비공개 처리 됩니다.</GoodsInfo>
                    </Descriptions.Item>
                    <Descriptions.Item label="객실 선택">
                        <RoomsWrap>
                            <SelectBar defaultValue={rooms} onChange={(e) => setRooms(e)}>
                                <Select.Option value="스탠다드 트윈">스탠다드 트윈</Select.Option>
                                <Select.Option value="스탠다드 더블">스탠다드 더블</Select.Option>
                                <Select.Option value="스위트 주니어">스위트 주니어</Select.Option>
                            </SelectBar>
                            <Button type="primary" size="small" onClick={() => router.push('/rooms/1?type="modi"')} style={{fontSize: '12px'}}>객실 추가 및 삭제</Button>
                        </RoomsWrap>
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 원가">
                        <InputValue
                        value={price}
                        onChange={(e) => onDataChange(e, 'price')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 할인가">
                        <InputValue
                        value={salePrice} 
                        onChange={(e) => onDataChange(e, 'salePrice')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 할인율">
                        <InputValue
                        value={rate} 
                        onChange={(e) => onDataChange(e, 'rate')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 상세 설명">
                        <Input.TextArea
                        value={desc} 
                        rows={4}
                        onChange={(e) => onDataChange(e, 'desc')} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 썸네일">
                        {modiStatus ?
                            <Upload
                            listType="picture-card"
                            showUploadList={false}
                            action="http://localhost:3000/"
                            beforeUpload={beforeUpload}
                            onChange={onUploadThumb}>
                                {
                                    thumb ? <img src={thumb} style={{ width: '100%' }} /> 
                                    : 
                                    <div>
                                        {thumbLoading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <UploadBtn>썸네일 업로드</UploadBtn>
                                    </div>
                                }
                            </Upload>
                            :
                            thumb && <img src={thumb} style={{ width: '300px' }} />
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 사진">
                        {modiStatus ?
                            <>
                                <UploadImgs 
                                fileList={imgList}
                                loading={loading}
                                onUploadChange={onUploadChange} />
                                <UploadLength style={imgList.length == 10 ? {color:'red'} : null}>({imgList.length} / 10)</UploadLength>
                            </>
                            :
                            <ImgWrap>
                                {imgList.map(img => {
                                    return (
                                        <img src={img.thumbUrl} style={{ width: '300px' }} />
                                    )
                                })}
                            </ImgWrap>
                        }
                    </Descriptions.Item>
                </Descriptions>

                <Empty />

                <Descriptions title={<Title>객실 기본 정보</Title>} bordered column={1}>
                    <Descriptions.Item label="인원 제한수">
                        <InputValue
                        value={people} 
                        onChange={e => onDataChange(e, 'people')} />
                    </Descriptions.Item>
                    <Descriptions.Item label="체크인 시간">
                        <SelectBar onChange={(e) => onDataChange(e, 'checkIn')}>
                            {times.map(time => {
                            return <Select.Option value={time}>{time}</Select.Option>})}
                        </SelectBar>
                    </Descriptions.Item>
                    <Descriptions.Item label="체크아웃 시간">
                        <SelectBar onChange={(e) => onDataChange(e, 'checkOut')}>
                            {times.map(time => {
                            return <Select.Option value={time}>{time}</Select.Option>})}
                        </SelectBar>
                    </Descriptions.Item>
                    <Descriptions.Item label="침대 사이즈">
                        <InputValue
                        style={{width: '190px', marginRight: '5px'}}
                        placeholder={"침대 종류를 입력하세요"}
                        value={bed} 
                        onChange={e => onDataChange(e, 'bed')} />
                        <InputValue
                        style={{width: '190px'}}
                        placeholder={"침대 갯수를 입력하세요"}
                        value={bedNum} 
                        onChange={e => onDataChange(e, 'bedNum')} />
                        {(showAddBed == 1 || showAddBed == 2) &&
                        <>
                            <InputValue
                            style={{width: '190px', marginRight: '5px'}}
                            placeholder={"침대 종류를 입력하세요"}
                            value={bed2} 
                            onChange={e => onDataChange(e, 'bed2')} />
                            <InputValue
                            style={{width: '190px', marginRight: '5px'}}
                            placeholder={"침대 갯수를 입력하세요"}
                            value={bedNum2} 
                            onChange={e => onDataChange(e, 'bedNum2')} />
                        </>
                        }
                        {showAddBed == 2 &&
                        <>
                            <InputValue
                            style={{width: '190px', marginRight: '5px'}}
                            placeholder={"침대 종류를 입력하세요"}
                            value={bed3} 
                            onChange={e => onDataChange(e, 'bed3')} />
                            <InputValue
                            style={{width: '190px', marginRight: '5px'}}
                            placeholder={"침대 갯수를 입력하세요"}
                            value={bedNum3} 
                            onChange={e => onDataChange(e, 'bedNum3') } />
                        </>
                        }
                        {
                            (showAddBed == 0 || showAddBed == 1) ?
                            <AddBtn onClick={() => showAddBed == 0 ? setShowAddBed(1) : setShowAddBed(2)}><PlusSquareOutlined /></AddBtn>
                            : <DeleteBtn onClick={() => setShowAddBed(0)}><MinusSquareOutlined /></DeleteBtn>
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="기본 정보">
                        <Input.TextArea
                        value={roomsDesc} 
                        rows={4}
                        onChange={(e) => onDataChange(e, 'setRoomsDesc')} />
                    </Descriptions.Item>

                </Descriptions>

                <Empty />

                <Descriptions title={<Title>숙소 상세 정보</Title>} bordered column={1} extra={<Button type="primary" size="small" onClick={() => router.push('/hotel/1?type="modi"')} style={{fontSize: '12px'}}>숙소 정보 수정</Button>}>
                    <Descriptions.Item label="숙소 카테고리">
                        <InputValue value={data.category} />
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소명">
                        <HotelBtn onClick={() => router.push('/hotel/1')}>{data.hotel}</HotelBtn>
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 주소">
                        <Input 
                        disabled={true}
                        bordered={false}
                        value={data.zonecode}
                        style={{width:100}} />
                        <Input 
                        disabled={true}
                        bordered={false}
                        value={data.address}
                        style={{marginTop:5, marginBottom:5, display:'block'}} />
                        <Input 
                        value={data.address2} 
                        bordered={false}
                        onChange={null} />
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 연락처">
                        <InputValue
                        placeholder={"'-'없이 번호만 입력해 주세요"}
                        value={data.tel} 
                        onChange={null}
                        bordered={false} />
                    </Descriptions.Item>
                    <Descriptions.Item label="편의시설">
                        <Checkbox.Group options={options} value={data.facility} onChange={null} />
                    </Descriptions.Item>
                    <Descriptions.Item label="조식 정보">
                        <Input.TextArea
                        value={data.breakfast} 
                        rows={4}
                        onChange={null} />
                    </Descriptions.Item>
                    <Descriptions.Item label="주차 정보">
                        <Input.TextArea
                        value={data.parking} 
                        rows={4}
                        onChange={null} />
                    </Descriptions.Item>
                    <Descriptions.Item label="취소 및 환불 규정">
                        <Input.TextArea
                        value={data.cancel} 
                        rows={4}
                        onChange={null} />
                    </Descriptions.Item>

                    <Descriptions.Item label="파트너">
                        <HotelBtn onClick={() => router.push('/user/partner/1')}>{data.partner}</HotelBtn>
                    </Descriptions.Item>
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onModi}>{modiStatus ? '수정완료' : '수정'}</Button>
                    {modiStatus ?
                    <Button onClick={() => router.replace('/goods/1', undefined, {shallow: true}).then(() => window.scrollTo(0,0))}>취소</Button>
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
`

const Detail = styled.div`
    padding: 18px;
    margin-bottom: 80px;
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