import styled from 'styled-components'
import { Descriptions, Input, Button, message, Space, Select, Modal } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { PlusSquareOutlined , MinusSquareOutlined } from '@ant-design/icons';

const RoomsDetail = () => {
    const data = {
        key: '1',
        name: '스탠다드 더블',
        people: 2,
        bed: '더블베드',
        bedNum: 1,
        bed2: '',
        bedNum2: '',
        bed3: '',
        bedNum3: '',
        roomDetail: '',
        goods: '여름날 치맥 파티',
        active: true,
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
        checkIn: '11:00',
        checkOut: '11:00'
    }

    const router = useRouter();

    const options = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
    const [isAdmin, setIsAdmin] = useState(true);
    const [modiStatus, setModiStatus] = useState(false)

    const [name, setName] = useState(data.name)
    const [people, setPeople] = useState(data.people)
    const [checkIn, setCheckIn] = useState(data.checkIn)
    const [checkOut, setCheckOut] = useState(data.checkOut)
    const [bed, setBed] = useState(data.bed)
    const [bed2, setBed2] = useState(data.bed2)
    const [bed3, setBed3] = useState(data.bed3)
    const [bedNum, setBedNum] = useState(data.bedNum)
    const [bedNum2, setBedNum2] = useState(data.bedNum2)
    const [bedNum3, setBedNum3] = useState(data.bedNum3)
    const [desc, setDesc] = useState(data.desc)
    const [goods, setGoods] = useState(data.goods)
    const [showDelete, setShowDelete] = useState(false)
    const [showAddBed, setShowAddBed] = useState(0)

    useEffect(() => {
        console.log(router.query.type)
        if (router.query.type) setModiStatus(true)
        else setModiStatus(false)
    }, [router])

    const onDataChange = (e, val) => {
        const numRegExp = /^[0-9]*$/;
        if (!router.query.type) return;

        if (val == 'people' || val == 'bedNum' || val == 'bedNum2' || val == 'bedNum3') {
            if (!numRegExp.test(e.target.value)) return;
        }
        if (val == 'name') setName(e.target.value);
        if (val == 'people') setPeople(e.target.value);
        if (val == 'bed') setBed(e);
        if (val == 'bed2') setBed2(e);
        if (val == 'bed3') setBed3(e);
        if (val == 'bedNum') setBedNum(e);
        if (val == 'bedNum2') setBedNum2(e);
        if (val == 'bedNum3') setBedNum3(e);
        if (val == 'goods') setGoods(e.target.value);
        if (val == 'desc') setDesc(e.target.value);
    }
    
    const onModi = () => {
        if (!router.query.type) router.push('/rooms/1?type=modi');
        else {
            if (!name) {
                message.warning('객실명을 입력해 주세요')
            }
            if (!people) {
                message.warning('기준 인원수를 입력해 주세요')
            }
            if (!bed || !bedNum) {
                message.warning('침대 사이즈를 입력해 주세요')
            }
            if (!desc) {
                message.warning('객실 기본정보를 입력해 주세요')
            }
            if (!checkIn) {
                message.warning('체크인 시간을 입력해 주세요')
            }
            if (!checkOut) {
                message.warning('체크아웃 시간을 입력해 주세요')
            }

            // success
        }
    }

    const onDeleteLists = () => {

        // success
        router.push('/rooms/list');
    }

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>상품 상세 정보</Title>} bordered column={1} 
                extra={
                    <>
                        <Button type="danger" onClick={() => setShowDelete(true)} style={{marginRight: '8px'}}>삭제</Button>
                        <Button onClick={() => router.push('/rooms/list')}>목록으로 돌아가기</Button>
                    </>
                }>
                    <Descriptions.Item label="객실명">
                        <InputValue
                        value={name} 
                        onChange={(e) => onDataChange(e, 'name')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="기준 인원수">
                        <InputValue
                        value={people} 
                        onChange={e => onDataChange(e, 'people')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="체크인 시간">
                        {modiStatus ?
                            <SelectBar onChange={(e) => onDataChange(e, 'checkIn')}>
                                {options.map(time => {
                                return <Select.Option value={time}>{time}</Select.Option>})}
                            </SelectBar>
                            :
                            <div>{checkIn}시 이후</div>
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="체크아웃 시간">
                        {modiStatus ?
                            <SelectBar onChange={(e) => onDataChange(e, 'checkOut')}>
                                {options.map(time => {
                                return <Select.Option value={time}>{time}</Select.Option>})}
                            </SelectBar>
                            :
                            <div>{checkOut}시 이전</div>
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="침대 사이즈">
                    <InputValue
                        style={{width: '190px', marginRight: '5px'}}
                        placeholder={"침대 종류를 입력하세요"}
                        value={bed} 
                        onChange={e => onDataChange(e, 'bed')}
                        bordered={modiStatus} />
                        <InputValue
                        style={{width: '190px'}}
                        placeholder={"침대 갯수를 입력하세요"}
                        value={bedNum} 
                        bordered={modiStatus}
                        onChange={e => onDataChange(e, 'bedNum')} />개
                        {(showAddBed == 1 || showAddBed == 2) &&
                        <>
                            <InputValue
                            style={{width: '190px', marginRight: '5px'}}
                            placeholder={"침대 종류를 입력하세요"}
                            value={bed2} 
                            bordered={modiStatus}
                            onChange={e => onDataChange(e, 'bed2')} />
                            <InputValue
                            style={{width: '190px', marginRight: '5px'}}
                            placeholder={"침대 갯수를 입력하세요"}
                            value={bedNum2}
                            bordered={modiStatus} 
                            onChange={e => onDataChange(e, 'bedNum2')} />
                        </>
                        }
                        {showAddBed == 2 &&
                        <>
                            <InputValue
                            style={{width: '190px', marginRight: '5px'}}
                            placeholder={"침대 종류를 입력하세요"}
                            value={bed3} 
                            bordered={modiStatus}
                            onChange={e => onDataChange(e, 'bed3')} />
                            <InputValue
                            style={{width: '190px', marginRight: '5px'}}
                            placeholder={"침대 갯수를 입력하세요"}
                            value={bedNum3} 
                            bordered={modiStatus}
                            onChange={e => onDataChange(e, 'bedNum3')} />
                        </>
                        }
                        {
                            (showAddBed == 0 || showAddBed == 1) ?
                            <AddBtn onClick={() => showAddBed == 0 ? setShowAddBed(1) : setShowAddBed(2)}><PlusSquareOutlined /></AddBtn>
                            : <DeleteBtn onClick={() => setShowAddBed(0)}><MinusSquareOutlined /></DeleteBtn>
                        }
                    </Descriptions.Item>
                </Descriptions>

                <Empty />

                <Descriptions title={<Title>객실 외 관련 정보</Title>} bordered column={1} extra={
                    <>
                        <Button type="primary" size="small" onClick={() => router.push('/hotel/1?type="modi"')} style={{fontSize: '12px'}}>숙소 정보 수정</Button>
                        <span style={{paddingRight: '5px'}}></span>
                        {data.goods && <Button type="primary" size="small" onClick={() => router.push('/goods/1?type="modi"')} style={{fontSize: '12px'}}>상품 정보 수정</Button>}
                    </>
                }>
                    <Descriptions.Item label="숙소명">
                        <HotelBtn onClick={() => router.push('/hotel/1')}>{data.hotel}</HotelBtn>
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="등록된 상품">
                        {data.goods ?
                        <HotelBtn onClick={() => router.push('/goods/1')}>{data.goods}</HotelBtn>
                        : <Space>등록된 상품이 없습니다.</Space>
                        }
                    </Descriptions.Item>

                    <Descriptions.Item label="파트너">
                        <HotelBtn onClick={() => router.push('/user/partner/1')}>{data.partner}</HotelBtn>
                    </Descriptions.Item>
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onModi}>{modiStatus ? '수정완료' : '수정'}</Button>
                    {modiStatus ?
                    <Button onClick={() => router.replace('/rooms/1', undefined, {shallow: true}).then(() => window.scrollTo(0,0))}>취소</Button>
                    : <Button onClick={() => router.push('/rooms/list')}>목록</Button>
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