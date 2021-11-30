import styled from "styled-components"
import { Descriptions, Select, Input, Button, message, DatePicker, Checkbox, Radio, Calendar, Switch, InputNumber } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../store/StoreProvider'
import moment from 'moment'
import { toJS } from "mobx"

const GoodsQuantity = observer(() => {

    const router = useRouter();
    const { goods, user, room } = useStore()
    
    const [roomId, setRoomId] = useState()
    const [name, setName] = useState()
    const [start, setStart] = useState(moment())
    const [end, setEnd] = useState(moment())
    const [count, setCount] = useState()
    const [selectedDates, setSelectedDates] = useState([])
    const [allCount, setAllCount] = useState()
    const [loading, setLoading] = useState(false)
    const [isEditMode, setIsEditMode] = useState()

    
    
    useEffect(() => {
        const callGoodsInfo = async() => {
            if(router.query.pid && user.token){
                await goods.callInfo({id: router.query.pid}, user.token)
            }
        }
        callGoodsInfo()
        
    }, [router])

    useEffect(() => {
        const callGoodsInfo = async() => {
            if(router.query.pid && user.token){
                await goods.callInfo({id: router.query.pid}, user.token)
            }
        }
        callGoodsInfo()
        
    }, [])

    useEffect(() => {
        const callGoodsInfo = async() => {
            if(goods?.info?.data[0].start_date){
                setStart(moment(goods?.info?.data[0].start_date))
                setEnd(moment(goods?.info?.data[0].end_date))
                let _start = start
                let diff = end.diff(start, 'days')
                let dates = {}
                for (let i = 0; i < diff+1; i++) {
                    let _date = ''
                    if(i === 0){
                        _date = _start.format('YYYY-MM-DD')
                    }else{

                        _date = _start.add(1, 'd').format('YYYY-MM-DD')
                    }

                    dates[_date] = 0
                }
                setSelectedDates(dates)
            }
        }
        callGoodsInfo()
        
    }, [goods?.info?.data])

    const onWrite = async() => {
        if (!start) {
            return message.warning('상품 판매 게시일을 입력해 주세요')
        }
        if (!end) {
            return message.warning('상품 판매 종료일을 입력해 주세요')
        }

        // await goods.addInfo(data, user.token, (success, result) => {
        //     if (success) {
        //         message.success('게시 완료')
        //         window.location.href = "/goods/list"
        //     }
        // })
    }

    const dateCellRender = (value) => {
        const dateStr = value.format('YYYY-MM-DD')
        const _dates = Object.keys(selectedDates)
        const selected = _dates.includes(dateStr)
        return(
            selected ?
                (isEditMode ?
                <InputNumber
                    value={selectedDates[dateStr]}
                    max={100}
                    min={0}
                    onChange={e => {
                        let _selectedDates = selectedDates
                        _selectedDates[dateStr] = e
                        setSelectedDates(_selectedDates)
                    }}
                />
                :
                    `수량 ${selectedDates[dateStr]}개`)
            :
                ''
        )
    }

    const onSetAll = () => {
        let _start = start
        let diff = end.diff(start, 'days')
        let dates = {}
        for (let i = 0; i < diff+1; i++) {
            let _date = ''
            if(i === 0){
                _date = _start.format('YYYY-MM-DD')
            }else{

                _date = _start.add(1, 'd').format('YYYY-MM-DD')
            }

            dates[_date] = count
        }
        setSelectedDates(dates)
        console.log('set ',dates);
    }
    

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>상품 수량 관리</Title>} bordered column={1} extra={<Button onClick={() => router.push('/goods/list')}>목록으로 돌아가기</Button>}>
                    <Descriptions.Item label="상품명">
                        <InputValue
                            disabled
                            value={goods?.info?.data[0]?.goods_name}
                            onChange={e => setName(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="판매 게시일 ~ 판매 종료일">
                        <StartDate 
                            value={start}
                            onChange={e => setStart(moment(e).format('YYYY-MM-DD'))} />
                        ~
                        <EndDate
                            value={end}
                            onChange={e => setEnd(moment(e).format('YYYY-MM-DD'))} 
                            disabledDate={(e) => e < start} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 수량">
                        <CountWrap>
                            <Count>
                                <CountInput
                                    max={100}
                                    min={0}
                                    value={count}
                                    autoFocus
                                    disabled={isEditMode}
                                    onChange={e => setCount(e)} 
                                    /> 개
                            </Count>

                            <Button type="primary" disabled={isEditMode} onClick={onSetAll} >일괄적용</Button>
                            <ModiButton type="primary" onChange={e=>{setIsEditMode(e)}} />부분 수량 수정
                        </CountWrap>
                    </Descriptions.Item>
                </Descriptions>
                <Empty />

                

                <Calendar dateCellRender={dateCellRender} disabledDate={(date)=>{
                    if(date < new Date()){
                        return false;
                    }
                    return true;
                }} />

                

                <ButtonWrap>
                    <Button type="primary" onClick={onWrite}>수정</Button>
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

const CountInput = styled(InputNumber)`
    width: 100px;
`

const Count = styled.div`
    flex: 1;
`

const CountWrap = styled.div`
    justify-content: space-around;
    align-items: center;
    display: flex;
    flex: 1;
`

const ModiButton = styled(Switch)`
    margin-left: 10px;
    margin-right: 6px;
`

const StartDate = styled(DatePicker)`
    margin-right: 10px;
`

const EndDate = styled(DatePicker)`
    margin-left: 10px;
`

export default GoodsQuantity