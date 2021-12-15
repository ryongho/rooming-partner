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
    
    const options = ['무료 wifi', '3인용 소파', 'TV', '헤어 드라이어', '에어컨', '소형 냉장고', 'CCTV', '욕조', '입욕제', '비데', '룸서비스']
    const times = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']

    const [hotelId, setHotelId] = useState()
    const [name, setName] = useState()
    const [bed, setBed] = useState()
    const [bedNum, setBedNum] = useState()
    const [fileList, setFileList] = useState([])
    const [imgList, setImgList] = useState([])
    const [loading, setLoading] = useState(false)
    const [people, setPeople] = useState()
    const [maxPeople, setMaxPeople] = useState()
    const [checkIn, setCheckIn] = useState()
    const [checkOut, setCheckOut] = useState()
    const [option, setOption] = useState([])
    const [square, setSquare] = useState()

    const onWrite = async() => {
        if (!name) {
            return message.warning('객실명을 입력해 주세요')
        }
        if (!people) {
            return message.warning('기준 인원수를 입력해 주세요')
        }
        if (!maxPeople) {
            return message.warning('최대 인원수를 입력해 주세요')
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
        

        // success
        const data = {
            hotel_id: hotelId,
            name: name,
            bed: bed,
            amount: bedNum,
            peoples: people,
            max_peoples: maxPeople,
            checkin: checkIn,
            checkout: checkOut,
            square: square
        }

        if (imgList.length > 0) {
            data.images = imgList.join();
        }

        if (option) {
            data.options = option.join();
        }

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
                        type="number"
                        onChange={e => {
                            const numRegExp = /^[0-9]*$/;
                            if (!numRegExp.test(e.target.value)) return;setBedNum(e.target.value)
                        }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="기준 인원수">
                        <Input
                        type="number"
                        value={people} 
                        onChange={e => {
                        const numRegExp = /^[0-9]*$/;
                        if (!numRegExp.test(e.target.value)) return;
                        setPeople(e.target.value)}}
                        style={{width:50}} /> 명
                    </Descriptions.Item>
                    <Descriptions.Item label="최대 인원수">
                        <Input
                        type="number"
                        value={maxPeople} 
                        onChange={e => {
                        const numRegExp = /^[0-9]*$/;
                        if (!numRegExp.test(e.target.value)) return;
                        setMaxPeople(e.target.value)}}
                        style={{width:50}} /> 명
                    </Descriptions.Item>
                    <Descriptions.Item label="객실 평수">
                        <Input
                        type="number"
                        value={square} 
                        onChange={e => {
                        const numRegExp = /^[0-9]*$/;
                        if (!numRegExp.test(e.target.value)) return;
                        setSquare(e.target.value)}}
                        style={{width:100}} /> 평
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
                    <Descriptions.Item label="숙소 편의시설">
                        <Checkbox.Group options={options} value={option} onChange={e => setOption(e)} />
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
    padding-bottom: 80px;
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