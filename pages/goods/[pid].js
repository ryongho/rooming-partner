import styled from 'styled-components'
import { Descriptions, Input, Button, message, Select, DatePicker, Checkbox, Radio, Modal, Calendar } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import ModiImgs from '../../components/atom/ModiImgs'
import { useStore } from '../../store/StoreProvider'
import moment from 'moment';
import { observer } from 'mobx-react-lite'

const GoodsDetail = observer(() => {

    const router = useRouter();
    const { user, goods, room } = useStore();

    const [isAdmin, setIsAdmin] = useState(true);
    const [modiStatus, setModiStatus] = useState(false)
    
    const options = ['룸서비스', '사진 무한 촬영', '조식 패키지', '파티 용품 제공']
    const [roomId, setRoomId] = useState()
    const [name, setName] = useState()
    const [content, setContent] = useState()
    const [sale, setSale] = useState()
    const [start, setStart] = useState()
    const [end, setEnd] = useState()
    const [price, setPrice] = useState()
    const [salePrice, setSalePrice] = useState()
    const [rate, setRate] = useState()
    const [minNight, setMinNight] = useState()
    const [maxNight, setMaxNight] = useState()
    const [option, setOption] = useState()
    const [breakfast, setBreakfast] = useState()
    const [parking, setParking] = useState()
    const [fileList, setFileList] = useState()
    const [imgList, setImgList] = useState()
    const [loading, setLoading] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [selectedDates, setSelectedDates] = useState([])

    useEffect(() => {
        const callDetail = async() => {
            if (router.query.type) setModiStatus(true)
            else setModiStatus(false)

            await goods.callInfo({id: router.query.pid}, user.token)
            await room.callRoomList({hotel_id: user.hotelid}, user.token)
            
            console.log(goods?.info?.data[0])
            if (goods?.info?.data[0]) {
                setRoomId(goods.info.data[0].room_id)
                setName(goods.info.data[0].goods_name)
                setContent(goods.info.data[0].content)
                setSale(goods.info.data[0].sale)
                setStart(goods.info.data[0].start_date)
                setEnd(goods.info.data[0].end_date)
                setPrice(goods.info.data[0].price)
                setSalePrice(goods.info.data[0].sale_price)
                setRate((goods.info.data[0].price - goods.info.data[0].sale_price) / goods.info.data[0].price * 100)
                setMinNight(goods.info.data[0].min_nights)
                setMaxNight(goods.info.data[0].max_nights)
                setOption(goods.info.data[0].options?.split(","))
                setBreakfast(goods.info.data[0].breakfast)
                // setParking(goods.info.data[0].parking)
                setImgList(goods.info.images)
                let list = Array.from(Array(10).keys());
                for (let i = 0; i <= list.length; i++) {
                    goods.info.images.map(el => {
                        if (el.order_no == list[i] + 1) {
                            let removed = list.splice(i, 1, el);
                        }
                    })
                }
                setFileList(list)

                let dates = {}
                
                const params = {
                    goods_id: parseInt(router.query.pid),
                    start_date: goods?.info?.data[0].start_date,
                    end_date: goods?.info?.data[0].end_date,
                }
                await goods.callQuantityList(params, (result)=>{
                    result.qty_info.map((goods)=>{
                        dates[goods.date] = goods.qty
                    })
                })
                
                setSelectedDates(dates)
            }
        }
        callDetail();
    }, [router])

    useEffect(() => {
        setRate((price - salePrice) / price * 100);
    }, [salePrice, price])

    const dateCellRender = (value) => {
        const dateStr = value.format('YYYY-MM-DD')
        const _dates = Object.keys(selectedDates)
        const selected = _dates.includes(dateStr)

        return( selected ? `수량 ${selectedDates[dateStr]}개` : '' )
    }

    const onDataChange = (e, val) => {
        const numRegExp = /^[0-9]*$/;
        if (!router.query.type) return;

        if (val == 'bedNum' || val == 'price' || val == 'salePrice' || val == 'minNight' || val == 'maxNight') {
            if (!numRegExp.test(e.target.value)) return;
        }
        if (val == 'name') setName(e.target.value);
        if (val == 'content') setContent(e.target.value);
        if (val == 'sale') setSale(e.target.value);
        if (val == 'price') setPrice(e.target.value);
        if (val == 'salePrice') setSalePrice(e.target.value);
        // if (val == 'rate') {
        //     if (!rateRegExp.test(e.target.value)) return;
        //     setRate(e.target.value);
        // }
        if (val == 'minNight') setMinNight(e.target.value);
        if (val == 'maxNight') setMaxNight(e.target.value);
        if (val == 'parking') setParking(e);
    }

    const onUploadChange = async(e, item) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        
        reader.onloadend = async (e) => {

            await goods.imagesUpload(file, user.token, (success, data) => {
                if (success) {
                    let img_file = data.images.toString();
                    goods.imagesUpdate(router.query.pid, item, img_file, user.token, (success, data) => {
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

    const onRemoveImgs = async(key) => {
        setImgList(imgList.filter((e, idx) => idx !== key))
        let copy = fileList.slice()
        let removed = copy.splice(key - 1, 1, key - 1)
        setFileList(copy)
        await goods.imagesDel(router.query.pid, key, user.token)
    }

    const onModi = async() => {
        if (!router.query.type) router.push(`/goods/${router.query.pid}?type=modi`);
        else {
            if (!name) {
                return message.warning('상품명을 입력해 주세요')
            }
            if (!roomId) {
                return message.warning('객실을 선택해 주세요')
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

            // success

            const data = {
                hotel_id: user.hotelid,
                room_id: roomId,
                goods_id: router.query.pid,
                goods_name: name,
                start_date: start,
                end_date: end,
                price: price,
                sale_price: salePrice,
                min_nights: minNight,
                max_nights: maxNight,
                breakfast: breakfast,
                parking: parking,
                sale: sale,
                content: content
            }

            if (option) {
                data.options = option.join();
            }
            
            await goods.updateInfo(data, user.token, (success, result) => {

                if (success) {
                    message.success('수정 완료')
                    window.location.href=`/goods/${router.query.pid}`
                }
            })
        }
    }

    const onDeleteLists = async (_id) => {
        const params = {
            goods_id: _id
        }
        await goods.deleteGoods(params, user.token, (status) => {
            if(status){
                // success
                router.push('/goods/list');
            }
        })
    }

    return (
        <Wrapper>
            <Detail>
                <Descriptions 
                title={<Title>상품 상세 정보</Title>} 
                bordered 
                column={1} 
                labelStyle={{width: '200px', minWidth: '180px'}}
                extra={
                    <>
                        {!router.query.type && <Button type="primary" onClick={onModi} style={{marginRight: '10px'}}>수정</Button>}
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
                    <Descriptions.Item label="상품 판매 게시일">
                        {modiStatus ?
                        <DatePicker
                        defaultValue={moment(start)}
                        onChange={e => setStart(moment(e).format('YYYY-MM-DD'))} />
                        : start?.substring(0, 10)}
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 판매 종료일">
                    {modiStatus ?
                        <DatePicker
                        defaultValue={moment(end)}
                        onChange={e => setEnd(moment(e).format('YYYY-MM-DD'))} />
                        : end?.substring(0, 10)}
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 상태값">
                        <GoodsWrap>
                            {modiStatus ?
                            <Radio.Group defaultValue={sale == 'Y' ? 'Y' : 'N'} onChange={(e) => onDataChange(e, 'sale')} buttonStyle="solid">
                                <Radio.Button value="Y">활성화</Radio.Button>
                                <Radio.Button value="N">비활성화</Radio.Button>
                            </Radio.Group> : sale == 'Y' ? '활성화' : '비활성화' }
                        </GoodsWrap>
                        <GoodsInfo>※ 비활성화된 상품은 앱에서 비공개 처리 됩니다.</GoodsInfo>
                    </Descriptions.Item>
                    <Descriptions.Item label="객실 선택">
                        <RoomsWrap>
                        {modiStatus ?
                            <SelectBar 
                            defaultValue={roomId} 
                            onChange={(e) => setRoomId(e)}
                            style={{width:'230px'}}>
                                {room.list && 
                                room.list.slice().map(item => {
                                    return (
                                        <Select.Option key={`rooms_${item.id}`} value={item.id}>{item.name}</Select.Option>
                                    )
                                })}
                            </SelectBar>
                            : <a href={`/rooms/${roomId}`}>{goods.info?.data[0]?.room_name}</a>}
                            <Button type="primary" size="small" onClick={() => router.push('/rooms/list')} style={{fontSize: '12px'}}>객실 추가 및 수정</Button>
                        </RoomsWrap>
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 원가">
                    {modiStatus ?
                        <InputValue
                        value={price}
                        style={{width:'200px', textAlign:'right'}}
                        onChange={(e) => onDataChange(e, 'price')}
                        bordered={modiStatus} />
                        : price } 원
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 할인가">
                    {modiStatus ?
                        <InputValue
                        value={salePrice} 
                        style={{width:'200px', textAlign:'right'}}
                        onChange={(e) => onDataChange(e, 'salePrice')}
                        bordered={modiStatus} />
                        : salePrice } 원
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 할인율">
                    {modiStatus ?
                        <InputValue
                        value={rate.toFixed(0)} 
                        style={{width:'200px', textAlign:'right'}}
                        bordered={modiStatus} />
                        : rate?.toFixed(0)} %
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 재고수량">
                        <CountWrap>
                            하단의 표시된 수량은 판매가능한 상품수입니다.
                            <Button type="primary" size="small" onClick={() => router.push(`/goods/quantity/${router.query.pid}?modi=true`)} style={{fontSize: '12px'}}>수량 수정</Button>
                        </CountWrap>
                        <Calendar defaultValue={moment(start)} dateCellRender={(value)=>dateCellRender(value, selectedDates)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 이미지">
                        <ModiImgs 
                        imgList={imgList}
                        fileList={fileList}
                        onUploadChange={onUploadChange}
                        onRemoveImgs={onRemoveImgs}
                        modiStatus={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="최소 박 수">
                    {modiStatus ?
                        <Input
                        value={minNight} 
                        onChange={e => onDataChange(e, 'minNight')}
                        style={{width:50}} /> : minNight } 일
                    </Descriptions.Item>
                    <Descriptions.Item label="최대 박 수">
                    {modiStatus ?
                        <Input
                        value={maxNight} 
                        onChange={e => onDataChange(e, 'maxNight')}
                        style={{width:50}} /> : maxNight } 일
                    </Descriptions.Item>
                    <Descriptions.Item label="조식 정보">
                    {modiStatus ?
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
                        : breakfast == 'Y' ? '조식 포함' : breakfast == 'N' ? '조식 불포함' : null}
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 정보">
                        <Input.TextArea
                        value={content} 
                        rows={4}
                        onChange={(e) => onDataChange(e, 'content')} />
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="주차 정보">
                    {modiStatus ?
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
                        : parking == 'Y' ? '주차 가능' : parking == 'N' ? '주차 불가' : null}
                    </Descriptions.Item> */}
                    <Descriptions.Item label="상품 옵션">
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
            onOk={()=>onDeleteLists(router.query.pid)}
            onCancel={() => setShowDelete(false)}
            >
                정말 삭제하시겠습니까?
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
    margin-top: 15px;
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


const CountWrap = styled.div`
    display: flex;
    justify-content: space-between;
`

export default GoodsDetail