import styled from "styled-components"
import { Descriptions, Select, Input, Button, message, DatePicker, Checkbox, Radio } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import UploadImgs from '../../components/atom/UploadImgs'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/StoreProvider'
import moment from 'moment'

const GoodsWrite = observer(() => {

    const router = useRouter();
    const { goods, user, room } = useStore()
    
    const times = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
    const options = ['룸서비스', '사진 무한 촬영', '조식 패키지', '파티 용품 제공']
    const [roomId, setRoomId] = useState()
    const [name, setName] = useState()
    const [sale, setSale] = useState('Y')
    const [start, setStart] = useState()
    const [end, setEnd] = useState()
    const [type, setType] = useState(0)
    const [price, setPrice] = useState()
    const [salePrice, setSalePrice] = useState()
    const [rate, setRate] = useState()
    const [minNight, setMinNight] = useState()
    const [maxNight, setMaxNight] = useState()
    const [checkIn, setCheckIn] = useState()
    const [checkOut, setCheckOut] = useState()
    const [option, setOption] = useState([])
    const [breakfast, setBreakfast] = useState()
    // const [parking, setParking] = useState()
    const [imgList, setImgList] = useState([])
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState('')


    useEffect(() => {
    
        const callRoomList = async() => {
            await room.callRoomList({hotel_id: user.hotelid}, user.token)
            // await console.log('rooms', room.list)
        }
        callRoomList()
        
    }, [])

    const onWrite = async() => {
        if (!roomId) {
            return message.warning('객실을 선택해 주세요')
        }
        if (!name) {
            return message.warning('상품명을 입력해 주세요')
        }
        if (!start) {
            return message.warning('상품 판매 게시일을 입력해 주세요')
        }
        if (!end) {
            return message.warning('상품 판매 종료일을 입력해 주세요')
        }
        if (!price) {
            return message.warning('상품 원가를 입력해 주세요')
        }
        if (!checkIn) {
            return message.warning('체크인 시간을 입력해 주세요')
        }
        if (!checkOut) {
            return message.warning('체크아웃 시간을 입력해 주세요')
        }
        if (imgList.length < 1) {
            return message.warning('상품 이미지를 입력해 주세요')
        }

        // success
        const data = {
            hotel_id: user.hotelid,
            room_id: roomId,
            goods_name: name,
            start_date: start,
            end_date: end,
            type: type,
            price: price,
            sale_price: salePrice,
            rate: rate,
            min_nights: minNight,
            max_nights: maxNight,
            checkin: checkIn,
            checkout: checkOut,
            breakfast: breakfast,
            content: content,
            sale: sale,
        }

        if (imgList.length > 0) {
            data.images = imgList.join();
        }
        if (option) {
            data.options = option.join();
        }

        // console.log(data, user.token)

        await goods.addInfo(data, user.token, (success, result) => {
            // console.log('success result : ',success, result);
            if (success && result.insert_id) {
                message.success('게시 완료')
                window.location.href = `/goods/quantity/${result.insert_id}`
            }
        })
    }
    
    const onUploadChange = async (e) => {

        setLoading(true)
        let file = e.target.files[0];

        if (file.size / 1024 / 1024 > 1) {
            message.error('이미지 사이즈는 1MB보다 작아야 합니다')
            setLoading(false)
            return
        }
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

    useEffect(() => {
        setRate((price - salePrice) / price * 100);
    }, [salePrice, price])

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>상품 정보 입력</Title>} bordered column={1} extra={<Button onClick={() => router.push('/goods/list')}>목록으로 돌아가기</Button>}>
                    <Descriptions.Item label="상품명">
                        <InputValue
                        value={name} 
                        onChange={e => setName(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 판매 게시일">
                        <DatePicker
                        onChange={e => setStart(moment(e).format('YYYY-MM-DD'))} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 판매 종료일">
                        <DatePicker
                        onChange={e => setEnd(moment(e).format('YYYY-MM-DD'))} 
                        disabledDate={(e) => e < start} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 상태값">
                        <Radio.Group defaultValue={'Y'} onChange={(e) => setSale(e.target.value)} buttonStyle="solid">
                            <Radio.Button value="Y">활성화</Radio.Button>
                            <Radio.Button value="N">비활성화</Radio.Button>
                        </Radio.Group>
                        <GoodsInfo>※ 비활성화된 상품은 앱에서 비공개 처리 됩니다.</GoodsInfo>
                    </Descriptions.Item>
                    <Descriptions.Item label="객실 선택">
                        <RoomsWrap>
                            <SelectBar placeholder={'객실을 선택해 주세요'} onChange={(e) => setRoomId(e)}>
                                {room.list && 
                                room.list.slice().map(item => {
                                    return (
                                        <Select.Option key={`rooms_${item.id}`} value={item.id}>{item.name}</Select.Option>
                                    )
                                })}
                            </SelectBar>
                            <Button type="primary" size="small" onClick={() => router.push('/rooms/list')} style={{fontSize: '12px'}}>객실 추가 및 삭제</Button>
                        </RoomsWrap>
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 원가">
                        <InputValue
                        style={{width:'200px', textAlign:'right'}}
                        value={price} 
                        onChange={e => {
                            const numRegExp = /^[0-9]*$/;
                            if (!numRegExp.test(e.target.value)) return;
                            setPrice(e.target.value)}} /> 원
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 할인가">
                        <InputValue
                        style={{width:'200px', textAlign:'right'}}
                        value={salePrice} 
                        onChange={e => {
                            const numRegExp = /^[0-9]*$/;
                            if (!numRegExp.test(e.target.value)) return;setSalePrice(e.target.value)}} /> 원
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 할인율">
                        <InputValue
                        style={{width:'200px', textAlign:'right'}}
                        value={rate ? rate.toFixed(0) : null} 
                        /> %
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 이미지">
                        <UploadImgs 
                            imgList={imgList}
                            loading={loading}
                            onUploadChange={onUploadChange}
                            onRemoveImgs={onRemoveImgs} />
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="최소 박 수">
                        <Input
                        value={minNight} 
                        onChange={e => {
                        const numRegExp = /^[0-9]*$/;
                        if (!numRegExp.test(e.target.value)) return;
                        setMinNight(e.target.value)}}
                        style={{width:50}} /> 일
                    </Descriptions.Item>
                    <Descriptions.Item label="최대 박 수">
                        <Input
                        value={maxNight} 
                        onChange={e => {
                        const numRegExp = /^[0-9]*$/;
                        if (!numRegExp.test(e.target.value)) return;
                        setMaxNight(e.target.value)}}
                        style={{width:50}} /> 일
                    </Descriptions.Item>
                    <Descriptions.Item label="체크인 시간">
                        <SelectBar placeholder={'체크인 가능 시간을 선택하세요'} onChange={(e) => setCheckIn(e)} style={{width:250}}>
                            {times.map((time, idx) => {
                            return <Select.Option key={`in_${idx}`} value={time}>{time}</Select.Option>})}
                        </SelectBar>
                    </Descriptions.Item>
                    <Descriptions.Item label="체크아웃 시간">
                        <SelectBar placeholder={'체크아웃 가능 시간을 선택하세요'} onChange={(e) => setCheckOut(e)} style={{width:250}}>
                            {times.map((time, idx) => {
                            return <Select.Option key={`out_${idx}`} value={time}>{time}</Select.Option>})}
                        </SelectBar>
                    </Descriptions.Item>
                    <Descriptions.Item label="조식 정보">
                        <Radio.Group 
                        value={breakfast}
                        onChange={e => setBreakfast(e.target.value)}
                        buttonStyle="solid"
                        optionType="button"
                        options={[{
                            label: '조식 포함',
                            value: 'Y'
                        }, {
                            label: '조식 불포함',
                            value: 'N'
                        }]} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 정보">
                        <Input.TextArea
                        value={content} 
                        rows={4}
                        onChange={(e) => setContent(e.target.value)} />
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="주차 정보">
                        <Radio.Group 
                        value={parking}
                        onChange={e => setParking(e.target.value)}
                        buttonStyle="solid"
                        optionType="button"
                        options={[{
                            label: '주차 가능',
                            value: 'Y'
                        }, {
                            label: '주차 불가',
                            value: 'N'
                        }]} />
                    </Descriptions.Item> */}
                    <Descriptions.Item label="상품 옵션">
                        <Checkbox.Group options={options} value={option} onChange={e => setOption(e)} />
                    </Descriptions.Item>
                </Descriptions>
                
                <Empty />


                <ButtonWrap>
                    <Button type="primary" onClick={onWrite}>등록하기</Button>
                    <Button onClick={() => router.push('/goods/list')}>목록</Button>
                </ButtonWrap>
            </Detail>
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

const SelectBar = styled(Select)`
    width: 300px;
`

const RoomsWrap = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const ButtonWrap = styled.div`
    display: flex;
    justify-content: center;
    padding: 25px 0 10px;

    button:first-child {
        margin-right: 10px;
    }
`

const GoodsInfo = styled.div`
    margin-top: 15px;
    font-size: 12px;    
    color: #666;
`

const UploadLength = styled.div`
    font-size: 12px;
    color: #999
`

const Empty = styled.div`
    padding-top: 30px;
`

export default GoodsWrite