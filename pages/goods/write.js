import styled from "styled-components"
import { Descriptions, Select, Input, Button, message, DatePicker, Checkbox } from 'antd'
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
    const [fileList, setFileList] = useState([])
    const [imgList, setImgList] = useState([])
    const [loading, setLoading] = useState(false)


    useEffect(() => {
    
        const callRoomList = async() => {
            await room.callRoomList({hotel_id: user.hotelid}, user.token)
            // await console.log('rooms', room.rooms)
        }
        callRoomList()
        
    }, [])

    const onWrite = async() => {
        if (!name) {
            return message.warning('상품명을 입력해 주세요')
        }
        if (!price) {
            return message.warning('상품 원가를 입력해 주세요')
        }
        if (!salePrice) {
            return message.warning('할인가를 입력해 주세요')
        }
        if (!rate) {
            return message.warning('할인율을 입력해 주세요')
        }
        if (imgList.length < 1) {
            return message.warning('상품 사진을 입력해 주세요')
        }

        const images = imgList.join();
        const optionList = option.join();

        // success
        const data = {
            hotel_id: user.hotelid,
            roomId: roomId,
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
            parking: "",
            breakfast: ""
        }

        console.log(data)
        await goods.addInfo(data, user.token, (success, result) => {
            if (success) {
                // console.log(result)
                message.success('게시 완료').then(() => router.push('/hotel/list').then(() => window.scrollTo(0,0)))
            }
        })
    }
    
    const onUploadChange = async (e) => {
        if (e.file.status === 'uploading') {
            setLoading(true);

            await goods.imagesUpload(e.file.originFileObj, user.token, (success, data) => {
                if (success) {
                    setFileList(fileList.concat(e.file.originFileObj))
                    setLoading(false);
                    setImgList(imgList.concat(data.images))
                    console.log(fileList, imgList)
                }
            })
        }
    }
    
    const onRemoveImgs = async(file) => {
        let idx = fileList.indexOf(file);
        imgList.splice(idx, 1);
        await setImgList(imgList)
        await setFileList(fileList.filter(e => e !== file))
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
                    <Descriptions.Item label="상품 판매 개시일">
                        <DatePicker
                        onChange={e => setEnd(moment(e).format('YYYY-MM-DD'))} />
                    </Descriptions.Item>
                    <Descriptions.Item label="객실 선택">
                        <RoomsWrap>
                            <SelectBar placeholder={'객실을 선택해 주세요'} onChange={(e) => setRoomId(e)}>
                                {room.rooms && 
                                room.rooms.slice().map(item => {
                                    return (
                                        <Select.Option value={item.id}>{item.name}</Select.Option>
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
                            fileList={fileList}
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