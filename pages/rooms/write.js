import styled from "styled-components"
import { Descriptions, Select, Input, Button, message, Checkbox, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import UploadImgs from '../../components/atom/UploadImgs'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/StoreProvider'

const GoodsWrite = observer(() => {

    const router = useRouter();
    const { user, room } = useStore()
    
    const options = ['무료 wifi', '3인용 소파', 'TV', '헤어 드라이어', '에어컨', '소형 냉장고', 'CCTV', '욕조', '입욕제', '비데', '룸서비스']

    const [hotelId, setHotelId] = useState()
    const [name, setName] = useState()
    const [bed, setBed] = useState()
    const [bedNum, setBedNum] = useState()
    const [imgList, setImgList] = useState([])
    const [loading, setLoading] = useState(false)
    const [people, setPeople] = useState()
    const [maxPeople, setMaxPeople] = useState()
    const [option, setOption] = useState([])
    const [facilityEtc, setFacilityEtc] = useState('');
    const [size, setSize] = useState()

    // 등록하기 버튼 클릭 이벤트
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
            size: size
        }

        if (imgList.length > 0) {
            data.images = imgList.join();
        }

        if (option) {
            let facile = option.join()
            if (facilityEtc.length > 1) {
                facile = facile + ',' + facilityEtc
            }
            data.options = facile
        }

        await room.addInfo(data, user.token, (success, result) => {
            if (success) {
                message.success('게시 완료')
                window.location.href='/rooms/list'
            }
        })
    }

    useEffect(() => {
        // 유저 정보, 호텔 아이디 불러오기
        const callInfo = async() => {
            await user.callInfo(user.token)
            await setHotelId(user.hotelid)
        }
        callInfo()
    }, [])
    
    // 이미지 업로드 이벤트
    const onUploadChange = async (e) => {
        setLoading(true)
        let file = e.target.files[0];
        let reader = new FileReader();
        
        if (file.size / 1024 / 1024 > 1) {
            message.error('이미지 사이즈는 1MB보다 작아야 합니다')
            setLoading(false)
            return
        }

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

    // 업로드 이미지 삭제
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
                        value={size} 
                        onChange={e => {
                        const numRegExp = /^[0-9]*$/;
                        if (!numRegExp.test(e.target.value)) return;
                        setSize(e.target.value)}}
                        style={{width:100}} /> 평
                    </Descriptions.Item>
                    <Descriptions.Item label="객실 이미지">
                        <UploadImgs 
                            imgList={imgList}
                            loading={loading}
                            onUploadChange={onUploadChange}
                            onRemoveImgs={onRemoveImgs} />
                    </Descriptions.Item>
                    <Descriptions.Item label="객실 내 시설">
                        <Checkbox.Group options={options} value={option} onChange={e => setOption(e)} />
                        <Tooltip title="콤마(,)로 구분해 입력 바랍니다.">
                            <span>기타 </span>
                            <InputValue 
                            value={facilityEtc} 
                            onChange={e => setFacilityEtc(e.target.value)} />
                        </Tooltip>
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

const ButtonWrap = styled.div`
    display: flex;
    justify-content: center;
    padding: 25px 0 10px;

    button:first-child {
        margin-right: 10px;
    }
`


export default GoodsWrite