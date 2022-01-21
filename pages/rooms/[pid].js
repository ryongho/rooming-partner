import styled from 'styled-components'
import { Descriptions, Input, Button, message, Checkbox, Space, Select, Modal, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useStore } from '../../store/StoreProvider'
import ModiImgs from '../../components/atom/ModiImgs'
import { observer } from 'mobx-react-lite'

const RoomsDetail = observer(() => {

    const router = useRouter();

    const { hotel, user, room, goods } = useStore();

    const options = ['무료 wifi', '3인용 소파', 'TV', '헤어 드라이어', '에어컨', '소형 냉장고', 'CCTV', '욕조', '입욕제', '비데', '룸서비스']
    // const times = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
    const [isAdmin, setIsAdmin] = useState(true);
    const [modiStatus, setModiStatus] = useState(false)

    const [name, setName] = useState()
    const [people, setPeople] = useState()
    const [maxPeople, setMaxPeople] = useState()
    const [bed, setBed] = useState()
    const [bedNum, setBedNum] = useState()
    const [imgList, setImgList] = useState()
    const [fileList, setFileList] = useState()
    const [showDelete, setShowDelete] = useState(false)
    const [roomList, setRoomList] = useState([])
    const [option, setOption] = useState()
    const [facilityEtc, setFacilityEtc] = useState('');
    const [size, setSize] = useState()


    useEffect(() => {
        // 상세 정보 불러오기
        const callDetail = async() => {

            if (router.query.type) setModiStatus(true)
            else setModiStatus(false)

            await room.callInfo({id: router.query.pid}, user.token)
            await goods.callListByHotel({hotel_id: user.hotelid}, user.token)
            await hotel.callListPartner(user.token)
            await user.callInfo(user.token)
            
            if (room.info.data[0]) {
                setName(room.info.data[0].name)
                setPeople(room.info.data[0].peoples)
                setMaxPeople(room.info.data[0].max_peoples)
                setSize(room.info.data[0].size)
                setBed(room.info.data[0].bed)
                setBedNum(room.info.data[0].amount)
                setImgList(room.info.images)
                setOption(room.info.data[0].room_options?.split(",").filter(el => options.includes(el)))
                setFacilityEtc(room.info.data[0].room_options?.split(",").filter(el => !options.includes(el) && el !== ''))

                let list = Array.from(Array(10).keys());
                for (let i = 0; i <= list.length; i++) {
                    room.info.images.map(el => {
                        if (el.order_no == list[i] + 1) {
                            let removed = list.splice(i, 1, el);
                        }
                    })
                }
                setFileList(list)
            }

            if (goods.list.data) {
                let rooms = goods.list.data.slice().filter(el => el.room_id == router.query.pid)
                setRoomList(rooms)
            }
        }
        callDetail();
        
    }, [router])

    const onDataChange = (e, val) => {
        const numRegExp = /^[0-9]*$/;
        if (!router.query.type) return;

        if (val == 'people' || val == 'bedNum' || val == 'maxPeople') {
            if (!numRegExp.test(e.target.value)) return;
        }
        if (val == 'name') setName(e.target.value);
        if (val == 'people') setPeople(e.target.value);
        if (val == 'maxPeople') setMaxPeople(e.target.value);
        if (val == 'size') setSize(e.target.value);
        if (val == 'bed') setBed(e.target.value);
        if (val == 'bedNum') setBedNum(e.target.value);
    }
    
    const onModi = async () => {
        if (!router.query.type) router.push(`/rooms/${router.query.pid}?type=modi`);
        else {
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
            // if (!checkIn) {
            //     return message.warning('체크인 시간을 입력해 주세요')
            // }
            // if (!checkOut) {
            //     return message.warning('체크아웃 시간을 입력해 주세요')
            // }

            // success

            const data = {
                hotel_id: user.hotelid,
                id: router.query.pid,
                name: name,
                peoples: people,
                max_peoples: maxPeople,
                // checkin: checkIn,
                // checkout: checkOut,
                bed: bed,
                amount: bedNum,
                size: size
            }

            if (option) {
                let facile = option.join()
                if (facilityEtc) {
                    facile = facile + ',' + facilityEtc
                }
                data.options = facile
            }
            
            // console.log(data, user.token)
            await room.updateInfo(data, user.token, (success, result) => {
                if (success) {
                    message.success('수정 완료')
                    window.location.href=`/rooms/${router.query.pid}`
                }
            })
        }
    }

    const onDeleteLists = async (_id) => {
        const params = {
            room_id: _id
        }

        await room.deleteRoom(params, user.token, (status) => {
            if(status){
                // success
                router.push('/rooms/list');
            }
        })
    }


    const onUploadChange = async (e, item) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        
        if (file.size / 1024 / 1024 > 1) {
            message.error('이미지 사이즈는 1MB보다 작아야 합니다')
            setLoading(false)
            return
        }
        
        reader.onloadend = async (e) => {

            await room.imagesUpload(file, user.token, (success, data) => {
                if (success) {
                    let img_file = data.images.toString();
                    room.imagesUpdate(router.query.pid, item, img_file, user.token, (success, data) => {
                        if (success) {
                            // console.log('!!!!!!!!!!!!!imgs:', item, room.info.images)
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
        await room.imagesDel(router.query.pid, key, user.token)
        // console.log(key, fileList, room.info.images)
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
                        <Button onClick={() => router.push('/rooms/list')}>목록으로 돌아가기</Button>
                    </>
                }>
                    <Descriptions.Item label="객실명">
                        {modiStatus ?
                        <InputValue
                        value={name} 
                        onChange={(e) => onDataChange(e, 'name')}
                        bordered={modiStatus} />
                        : name}
                    </Descriptions.Item>
                    <Descriptions.Item label="기준 인원수">
                        {modiStatus ?
                        <InputValue
                        type="number"
                        value={people} 
                        onChange={e => onDataChange(e, 'people')}
                        bordered={modiStatus}
                        style={{width:50}} />
                        : people} 명
                    </Descriptions.Item>
                    <Descriptions.Item label="최대 인원수">
                        {modiStatus ?
                        <InputValue
                        type="number"
                        value={maxPeople} 
                        onChange={e => onDataChange(e, 'maxPeople')}
                        bordered={modiStatus}
                        style={{width:50}} />
                        : maxPeople} 명
                    </Descriptions.Item>
                    <Descriptions.Item label="객실 평수">
                        {modiStatus ?
                        <InputValue
                        type="number"
                        value={size} 
                        onChange={e => onDataChange(e, 'size')}
                        bordered={modiStatus}
                        style={{width:100}} />
                        : size} 평
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="체크인 시간">
                        {modiStatus ?
                            <SelectBar defaultValue={checkIn} onChange={(e) => onDataChange(e, 'checkIn')}>
                                {times.map((time, idx) => {
                                return <Select.Option key={`in_${idx}`} value={time}>{time}</Select.Option>})}
                            </SelectBar>
                            :
                            <div>{checkIn}시 이후</div>
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="체크아웃 시간">
                        {modiStatus ?
                            <SelectBar defaultValue={checkOut} onChange={(e) => onDataChange(e, 'checkOut')}>
                                {times.map((time, idx) => {
                                return <Select.Option key={`out_${idx}`}value={time}>{time}</Select.Option>})}
                            </SelectBar>
                            :
                            <div>{checkOut}시 이전</div>
                        }
                    </Descriptions.Item> */}
                    <Descriptions.Item label="침대 사이즈">
                    {modiStatus ?
                        <>
                        <InputValue
                        style={{width: '170px', marginRight: '10px'}}
                        placeholder={"침대 종류를 입력하세요"}
                        value={bed} 
                        onChange={e => onDataChange(e, 'bed')}
                        bordered={modiStatus} />
                        <InputValue
                        style={{width: '80px', marginRight: '5px'}}
                        value={bedNum} 
                        bordered={modiStatus}
                        onChange={e => onDataChange(e, 'bedNum')} />개
                        </>
                        : <>{bed} {bedNum}개</> }
                    </Descriptions.Item>
                    <Descriptions.Item label="객실 이미지">
                        <ModiImgs 
                        imgList={imgList}
                        fileList={fileList}
                        // loading={loading}
                        onUploadChange={onUploadChange}
                        onRemoveImgs={onRemoveImgs}
                        modiStatus={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="객실 내 시설">
                    {modiStatus ?
                        <>
                        <Checkbox.Group options={options} value={option} onChange={e => setOption(e)} />
                        <Tooltip title="콤마(,)로 구분해 입력 바랍니다.">
                            <span>기타 </span>
                            <InputValue 
                            value={facilityEtc} 
                            onChange={e => setFacilityEtc(e.target.value)} />
                        </Tooltip>
                        </>
                         : (option && !facilityEtc?.length > 0) ? option.join(', ') : (!option?.length > 0 && facilityEtc) ? facilityEtc.join(', ') : (option && facilityEtc) ? option.join(', ') + ', ' + facilityEtc.join(', ') : null}
                    </Descriptions.Item>
                </Descriptions>

                <Empty />

                <Descriptions 
                title={<Title>객실 외 관련 정보</Title>} 
                bordered 
                column={1} 
                labelStyle={{width: '280px', minWidth: '200px'}}
                extra={
                    <>
                        <Button type="primary" size="small" onClick={() => router.push(`/hotel/${user.hotelid}?type="modi"`)} style={{fontSize: '12px'}}>숙소 정보 수정</Button>
                        <span style={{paddingRight: '5px'}}></span>
                        {goods.list?.data && <Button type="primary" size="small" onClick={() => router.push('/goods/list')} style={{fontSize: '12px'}}>상품 정보 수정</Button>}
                    </>
                }>
                    <Descriptions.Item label="숙소 정보">
                        {hotel.partnerList?.data ?
                        <HotelBtn onClick={() => router.push(`/hotel/${user.hotelid}`)}>{hotel.partnerList.data[0]?.name}</HotelBtn>
                        : <Space>등록된 숙소가 없습니다.</Space>}
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="상품 정보">
                        {roomList.length > 0 ?
                            roomList.map(item => {
                                return (
                                    <RoomWrap key={`goods_${item.goods_id}`}>
                                        <HotelBtn onClick={() => router.push(`/goods/${item.goods_id}`)}>{item.goods_name}</HotelBtn>
                                    </RoomWrap>
                                )
                            }) : <Space>등록된 상품이 없습니다.</Space>
                        }
                    </Descriptions.Item>

                    <Descriptions.Item label="파트너 정보">
                        <HotelBtn onClick={() => router.push(`/user/partner/detail`)}>{user.info?.data.nickname}</HotelBtn>
                    </Descriptions.Item>
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onModi}>{modiStatus ? '수정완료' : '수정'}</Button>
                    {modiStatus ?
                    <Button onClick={() => router.replace(`/rooms/${router.query.pid}`, undefined, {shallow: true}).then(() => window.scrollTo(0,0))}>취소</Button>
                    : <Button onClick={() => router.push('/rooms/list')}>목록</Button>
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

const InputValue = styled(Input)`
    width: 400px;
`

const SelectBar = styled(Select)`
    width: 150px;
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

const RoomWrap = styled.div`
    display: flex;
`

const ButtonWrap = styled.div`
    display: flex;
    justify-content: center;
    padding: 25px 0 10px;

    button:first-child {
        margin-right: 10px;
    }
`

const Empty = styled.div`
    padding-top: 30px;
`

const SelectWrap = styled.div`
    margin-bottom: 10px;
    
    .ant-select {
        margin-right: 5px;
    }
`

const AddBtn = styled(Button)`
    border: none;
`

const DeleteBtn = styled(Button)`
    border: none;
`


export default RoomsDetail