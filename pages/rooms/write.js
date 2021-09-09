import styled from "styled-components"
import { Descriptions, Select, Input, Button, message, Space } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';

const GoodsWrite = () => {

    const router = useRouter();
    
    const options = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
    const [name, setName] = useState()
    const [people, setPeople] = useState()
    const [checkIn, setCheckIn] = useState()
    const [checkOut, setCheckOut] = useState()
    const [bed, setBed] = useState()
    const [bed2, setBed2] = useState()
    const [bed3, setBed3] = useState()
    const [bedNum, setBedNum] = useState()
    const [bedNum2, setBedNum2] = useState()
    const [bedNum3, setBedNum3] = useState()
    const [desc, setDesc] = useState()
    const [showAddBed, setShowAddBed] = useState(0)

    const onWrite = () => {
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



    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>객실 정보 입력</Title>} bordered column={1} extra={<Button onClick={() => router.push('/rooms/list')}>목록으로 돌아가기</Button>}>
                    <Descriptions.Item label="객실명">
                        <InputValue
                        value={name} 
                        onChange={e => setName(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="인원 제한수">
                        <InputValue
                        value={people} 
                        onChange={e => {
                        const numRegExp = /^[0-9]*$/;
                        if (!numRegExp.test(e.target.value)) return;
                        setPeople(e.target.value)}} />
                    </Descriptions.Item>
                    <Descriptions.Item label="체크인 시간">
                        <SelectBar onChange={(e) => setCheckIn(e)}>
                            {options.map(time => {
                            return <Select.Option value={time}>{time}</Select.Option>})}
                        </SelectBar>
                    </Descriptions.Item>
                    <Descriptions.Item label="체크아웃 시간">
                        <SelectBar onChange={(e) => setCheckOut(e)}>
                            {options.map(time => {
                            return <Select.Option value={time}>{time}</Select.Option>})}
                        </SelectBar>
                    </Descriptions.Item>
                    <Descriptions.Item label="침대 사이즈">
                        <InputValue
                        style={{width: '190px', marginRight: '5px'}}
                        placeholder={"침대 종류를 입력하세요"}
                        value={bed} 
                        onChange={e => setBed(e.target.value)} />
                        <InputValue
                        style={{width: '190px'}}
                        placeholder={"침대 갯수를 입력하세요"}
                        value={bedNum} 
                        onChange={e => {
                            const numRegExp = /^[0-9]*$/;
                            if (!numRegExp.test(e.target.value)) return;setBedNum(e.target.value)
                        }} />
                        {(showAddBed == 1 || showAddBed == 2) &&
                        <>
                            <InputValue
                            style={{width: '190px', marginRight: '5px'}}
                            placeholder={"침대 종류를 입력하세요"}
                            value={bed2} 
                            onChange={e => setBed2(e.target.value)} />
                            <InputValue
                            style={{width: '190px', marginRight: '5px'}}
                            placeholder={"침대 갯수를 입력하세요"}
                            value={bedNum2} 
                            onChange={e => {
                                const numRegExp = /^[0-9]*$/;
                                if (!numRegExp.test(e.target.value)) return;setBedNum2(e.target.value)}} />
                        </>
                        }
                        {showAddBed == 2 &&
                        <>
                            <InputValue
                            style={{width: '190px', marginRight: '5px'}}
                            placeholder={"침대 종류를 입력하세요"}
                            value={bed3} 
                            onChange={e => setBed3(e.target.value)} />
                            <InputValue
                            style={{width: '190px', marginRight: '5px'}}
                            placeholder={"침대 갯수를 입력하세요"}
                            value={bedNum3} 
                            onChange={e => {
                                const numRegExp = /^[0-9]*$/;
                                if (!numRegExp.test(e.target.value)) return;setBedNum3(e.target.value)
                            }} />
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
                        value={desc} 
                        rows={4}
                        onChange={(e) => setDesc(e.target.value)} />
                    </Descriptions.Item>
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onWrite}>등록하기</Button>
                    <Button onClick={() => router.push('/rooms/list')}>목록</Button>
                </ButtonWrap>
            </Detail>
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

const AddBtn = styled(Button)`
    border: none;
`

const DeleteBtn = styled(Button)`
    border: none;
`

export default GoodsWrite