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
    
    const options = ['룸서비스', '사진 무한 촬영', '조식 패키지', '파티 용품 제공']
    const [roomId, setRoomId] = useState()
    const [name, setName] = useState()
    const [start, setStart] = useState()
    const [end, setEnd] = useState()
    const [type, setType] = useState(0)
    const [price, setPrice] = useState()
    const [salePrice, setSalePrice] = useState()
    const [rate, setRate] = useState()
    const [minNight, setMinNight] = useState()
    const [maxNight, setMaxNight] = useState()
    const [option, setOption] = useState(false)
    const [breakfast, setBreakfast] = useState()
    // const [parking, setParking] = useState()
    const [imgList, setImgList] = useState([])
    const [loading, setLoading] = useState(false)


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
            return message.warning('상품 판매 개시일을 입력해 주세요')
        }
        if (!end) {
            return message.warning('상품 판매 종료일을 입력해 주세요')
        }
        if (!price) {
            return message.warning('상품 원가를 입력해 주세요')
        }
        // if (imgList.length < 1) {
        //     return message.warning('상품 사진을 입력해 주세요')
        // }

        const images = imgList.join();
        const optionList = option.join();

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
            options: optionList,
            images: images,
            breakfast: breakfast
        }

        console.log(data)
        await goods.addInfo(data, user.token, (success, result) => {
            if (success) {
                // console.log(result)
                message.success('게시 완료').then(() => router.push('/goods/list').then(() => window.scrollTo(0,0)))
            }
        })
    }
    
    const onUploadChange = async (e) => {

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


    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>상품 정보 입력</Title>} bordered column={1} extra={<Button onClick={() => router.push('/goods/list')}>목록으로 돌아가기</Button>}>
                    <Descriptions.Item label="상품명">
                        <InputValue
                        value={name} 
                        onChange={e => setName(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 판매 개시일">
                        <DatePicker
                        onChange={e => setStart(moment(e).format('YYYY-MM-DD'))} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 판매 종료일">
                        <DatePicker
                        onChange={e => setEnd(moment(e).format('YYYY-MM-DD'))} 
                        disabledDate={(e) => e < start} />
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
                            <Button type="primary" size="small" onClick={() => router.push('/rooms/1?type="modi"')} style={{fontSize: '12px'}}>객실 추가 및 삭제</Button>
                        </RoomsWrap>
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 원가">
                        <InputValue
                        value={price} 
                        onChange={e => {
                            const numRegExp = /^[0-9]*$/;
                            if (!numRegExp.test(e.target.value)) return;
                            setPrice(e.target.value)}} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 할인가">
                        <InputValue
                        value={salePrice} 
                        onChange={e => {
                            const numRegExp = /^[0-9]*$/;
                            if (!numRegExp.test(e.target.value)) return;setSalePrice(e.target.value)}} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 할인율">
                        <InputValue
                        value={rate} 
                        onChange={e => {
                            const numRegExp = /^[0-9]*$/;
                            if (!numRegExp.test(e.target.value)) return;setRate(e.target.value)}} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 이미지">
                        <UploadImgs 
                            imgList={imgList}
                            loading={loading}
                            onUploadChange={onUploadChange}
                            onRemoveImgs={onRemoveImgs}
                            modiStatus={true} />
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
                    <Descriptions.Item label="옵션">
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

const UploadLength = styled.div`
    font-size: 12px;
    color: #999
`

const Empty = styled.div`
    padding-top: 30px;
`

// export async function getServerSideProps(context) {
//     let content = null
//     try {
//         const result = await getBridgeContent({ bridgeIdx: context.params.pid })
//         if (result.status === 200) {
//             content = result.data.content
//         }
//     } catch (err) {
        
//     } finally {
//         return {
//             props: {
//                 content: content,
//                 pid: context.params.pid
//             }
//         }
//     }
// }

export default GoodsWrite