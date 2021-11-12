import styled from "styled-components"
import { Descriptions, Select, Input, Button, message, Checkbox } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import UploadImgs from '../../components/atom/UploadImgs'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/StoreProvider'

const GoodsWrite = observer(() => {

    const router = useRouter();
    const { user, room } = useStore()
    
    const times = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']

    const [hotelId, setHotelId] = useState()
    const [name, setName] = useState()
    const [bed, setBed] = useState()
    const [bedNum, setBedNum] = useState()
    const [fileList, setFileList] = useState([])
    const [imgList, setImgList] = useState([])
    const [loading, setLoading] = useState(false)
    const [people, setPeople] = useState()
    const [checkIn, setCheckIn] = useState()
    const [checkOut, setCheckOut] = useState()

    const onWrite = async() => {
        if (!name) {
            return message.warning('객실명을 입력해 주세요')
        }
        if (!people) {
            return message.warning('기준 인원수를 입력해 주세요')
        }
        if (!bed || !bedNum) {
            return message.warning('침대 사이즈를 입력해 주세요')
        }
        if (!checkIn) {
            return message.warning('체크인 시간을 입력해 주세요')
        }
        if (!checkOut) {
            return message.warning('체크아웃 시간을 입력해 주세요')
        }
        if (imgList.length < 1) {
            return message.warning('객실 이미지를 입력해 주세요')
        }
        
        const images = imgList.join();

        // success
        const data = {
            hotel_id: hotelId,
            name: name,
            bed: bed,
            amount: bedNum,
            peoples: people,
            images: images,
            checkin: checkIn,
            checkout: checkOut,
        }

        console.log(data)

        await room.addInfo(data, user.token, (success, result) => {
            if (success) {
                message.success('게시 완료')
                window.location.href='/rooms/list'
            }
        })
    }

    useEffect(() => {
        const callInfo = async() => {
            await user.callInfo(user.token)
            await setHotelId(user.hotelid)
        }
        callInfo()
    }, [])
    

    const onUploadChange = async (e) => {
        // if (e.file.status === 'uploading') {
        //     setLoading(true);
        //     console.log(e)

        //     await room.imagesUpload(e.file.originFileObj, user.token, (success, data) => {
        //         if (success) {
        //             setFileList(fileList.concat(e.file.originFileObj))
        //             setLoading(false)
        //             setImgList(imgList.concat(data.images))
        //             // https://rooming-img.s3.ap-northeast-2.amazonaws.com/
        //         }
        //     })
        // }

        setLoading(true)
        let file = e.target.files[0];
        let reader = new FileReader();

        reader.onloadend = async(e) => {
            await room.imagesUpload(file, user.token, (success, data) => {
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
                <Descriptions title={<Title>객실 정보 입력</Title>} bordered column={1} extra={<Button onClick={() => router.push('/rooms/list')}>목록으로 돌아가기</Button>}>
                    <Descriptions.Item label="객실명">
                        <InputValue
                        value={name} 
                        onChange={e => setName(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="침대 사이즈">
                        <InputValue
                        style={{width: '190px', marginRight: '5px'}}
                        placeholder={"침대 종류를 입력하세요"}
                        value={bed} 
                        onChange={e => setBed(e.target.value)} />
                        <InputValue
                        style={{width: '190px'}}
                        placeholder={"침대 개수를 입력하세요"}
                        value={bedNum} 
                        onChange={e => {
                            const numRegExp = /^[0-9]*$/;
                            if (!numRegExp.test(e.target.value)) return;setBedNum(e.target.value)
                        }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="인원 제한수">
                        <Input
                        value={people} 
                        onChange={e => {
                        const numRegExp = /^[0-9]*$/;
                        if (!numRegExp.test(e.target.value)) return;
                        setPeople(e.target.value)}}
                        style={{width:50}} /> 명
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
                    <Descriptions.Item label="객실 이미지">
                        <UploadImgs 
                            imgList={imgList}
                            loading={loading}
                            onUploadChange={onUploadChange}
                            onRemoveImgs={onRemoveImgs} />
                    </Descriptions.Item>
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onWrite}>등록하기</Button>
                    <Button onClick={() => router.push('/rooms/list')}>목록</Button>
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

const UploadLength = styled.div`
    font-size: 12px;
    color: #999
`

export default GoodsWrite