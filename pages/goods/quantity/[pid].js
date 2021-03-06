import styled from "styled-components"
import { Descriptions, Select, Input, Button, message, DatePicker, Checkbox, Radio, Calendar, Switch, InputNumber, Spin } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../store/StoreProvider'
import moment from 'moment'
import { toJS } from "mobx"
import _ from "lodash"

const GoodsQuantity = observer(() => {

    const router = useRouter();
    const { goods, user } = useStore()
    
    const [start, setStart] = useState(moment())
    const [end, setEnd] = useState(moment())
    const [count, setCount] = useState(0)
    const [selectedDates, setSelectedDates] = useState([])
    const [isEditMode, setIsEditMode] = useState()
    const [spin, setSpin] = useState(true)
    

    useEffect(() => {
        const callGoodsInfo = async() => {
            if(router.query.pid && user.token){
                await goods.callInfo({id: router.query.pid}, user.token)
                setTimeout(() => {
                    setSpin(false)
                }, 500)
            }
        }
        callGoodsInfo()
        
    }, [router])

    useEffect(() => {
        const callGoodsInfo = async() => {
            if(goods?.info?.data[0].start_date){
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
                
                setStart(moment(goods?.info?.data[0].start_date))
                setEnd(moment(goods?.info?.data[0].end_date))
                setSelectedDates(dates)
            }
        }
        callGoodsInfo()
        
    }, [goods?.info?.data])


    const onWrite = async() => {
        if (!start) {
            return message.warning('?????? ?????? ???????????? ????????? ?????????')
        }
        if (!end) {
            return message.warning('?????? ?????? ???????????? ????????? ?????????')
        }

        setSpin(true)
        let quantityList = []

        _.forEach(selectedDates, (value, key) => {
            const row = {
                goods_id: router.query.pid,
                qty: value,
                date: key
            }
            quantityList.push(row)
        });

        await goods.updateQuantity(quantityList, user.token, async (success) => {
            if (success) {
                const goodsDetail = goods?.info?.data[0]
        
                const data = {
                    hotel_id: user.hotelid,
                    room_id: goodsDetail.room_id,
                    goods_id: router.query.pid,
                    goods_name: goodsDetail.goods_name,
                    start_date: start.format('YYYY-MM-DD'),
                    end_date: end.format('YYYY-MM-DD'),
                    price: goodsDetail.price,
                    sale_price: goodsDetail.sale_price,
                    min_nights: goodsDetail.min_nights,
                    max_nights: goodsDetail.max_nights,
                    breakfast: goodsDetail.breakfast,
                    parking: goodsDetail.parking,
                    sale: goodsDetail.sale,
                    options: goodsDetail.options,
                    content: goodsDetail.content,
                    checkin: goodsDetail.checkin,
                    checkout: goodsDetail.checkout,
                }    
                
                await goods.updateInfo(data, user.token, (success, result) => {
                    if (success) {
                        setSpin(false)
                        message.success('?????? ??????')
                        if (location.search) window.location.href=`/goods/${router.query.pid}`
                        else window.location.href='/goods/list';
                    }
                })
            }
        })

    }

    const dateCellRender = (value, _selectedDates) => {
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
                    `?????? ${selectedDates[dateStr]}???`)
            :
                ''
        )
    }

    const onSetAll = (start, end) => {
        let countNum;
        !count ? countNum = 0 : countNum = count;
        let _start = moment(start.format('YYYY-MM-DD'))
        let diff = end.diff(start, 'days')
        let dates = {}
        for (let i = 0; i < diff+1; i++) {
            let _date = i === 0 ? _start.format('YYYY-MM-DD') : _start.add(1, 'd').format('YYYY-MM-DD')

            dates[_date] = countNum
        }
        setSelectedDates(dates)
    }

    const changeDate = (e, type = '') => {
        if(!e) return
        const dateStr = e.format('YYYY-MM-DD')
        
        let _start = type === 'start' ? moment(dateStr) : moment(start.format('YYYY-MM-DD'));
        let _end = type === 'start' ? moment(end.format('YYYY-MM-DD')) : moment(dateStr);

        let diff = _end.diff(_start, 'days')
        let dates = {}
        for (let i = 0; i < diff+1; i++) {
            let _date = i === 0 ? _start.format('YYYY-MM-DD') :  _start.add(1, 'd').format('YYYY-MM-DD')

            dates[_date] = selectedDates[_date] ? selectedDates[_date] : 0
        }
        setSelectedDates(dates)
        if(type === 'start'){
            setStart(moment(dateStr))
        }else{
            setEnd(moment(dateStr))
        }
    }
    

    return (
        <Spin spinning={spin} tip="Loading...">
            <Wrapper>
                <Detail>
                    <Descriptions title={<Title>?????? ?????? ??????</Title>} bordered column={1} extra={<Button onClick={() => router.push('/goods/list')}>???????????? ????????????</Button>}>
                        <Descriptions.Item label="?????????">
                            <InputValue
                                disabled
                                value={goods?.info?.data[0]?.goods_name} />
                        </Descriptions.Item>
                        <Descriptions.Item label="?????? ????????? ~ ?????? ?????????">
                            <StartDate 
                                value={start}
                                onChange={(e)=>changeDate(e, 'start')} />
                            ~
                            <EndDate
                                value={end}
                                onChange={e => changeDate(e)} 
                                disabledDate={(e) => e < start} />
                        </Descriptions.Item>
                        <Descriptions.Item label="?????? ??????">
                            <CountWrap>
                                <Count>
                                    <CountInput
                                        max={100}
                                        min={0}
                                        value={count}
                                        autoFocus
                                        disabled={isEditMode}
                                        onChange={e => setCount(e)} 
                                        /> ???
                                </Count>

                                <Button type="primary" disabled={isEditMode} onClick={()=>onSetAll(start, end)} >????????????</Button>
                                <ModiButton type="primary" onChange={e=>{setIsEditMode(e)}} />?????? ?????? ??????
                            </CountWrap>
                        </Descriptions.Item>
                    </Descriptions>
                    <Empty />

                    <Calendar dateCellRender={(value)=>dateCellRender(value, selectedDates)} />

                    <ButtonWrap>
                        <Button type="primary" onClick={onWrite}>??????</Button>
                        <Button onClick={() => router.push('/goods/list')}>??????</Button>
                    </ButtonWrap>
                </Detail>
            </Wrapper>
        </Spin>
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
    padding: 10px 0;

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