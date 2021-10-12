import styled from 'styled-components'
import { Descriptions, Button } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const ReservedDetail = () => {
    const data = {
        key: '1',
        reservedNum: '1352056',
        name: '홍길동',
        phone: '01012345678',
        reservedName: '김철수',
        reservedPhone: '01022225555',
        category: 'hotel',
        hotel: '금강호텔',
        goods: '뜨끈뜨끈 온천욕을 즐겨봐요',
        room: '스위트 주니어 룸',
        checkin: new Date('2021-09-22'),
        checkout: new Date('2021-09-30'),
        howto: '도보로 이용',
        pay: '신용카드',
        amount: '102000' 
    }
    
    const router = useRouter();

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>예약 상세 정보</Title>} bordered column={1} extra={<Button onClick={() => router.push('/reserved/list')}>목록으로 돌아가기</Button>}>
                    <Descriptions.Item label="예약번호">
                        <Desc>{data.reservedNum}</Desc>
                    </Descriptions.Item>
                    <Descriptions.Item label="예약자">
                        <Desc>{data.name} / {data.phone}</Desc>
                    </Descriptions.Item>
                    <Descriptions.Item label="투숙객">
                        <Desc>{data.reservedName} / {data.reservedPhone}</Desc>
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 카테고리">
                        {data.category == 'hotel' ?
                            <Desc>호텔</Desc> : <Desc>리조트</Desc>
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소명">
                        <Desc>{data.hotel}</Desc>
                    </Descriptions.Item>
                    <Descriptions.Item label="상품명">
                        <Desc>{data.goods}</Desc>
                    </Descriptions.Item>
                    <Descriptions.Item label="객실명">
                        <Desc>{data.room}</Desc>
                    </Descriptions.Item>
                    <Descriptions.Item label="체크인 / 체크아웃">
                        <Desc>{moment(data.checkin).format('YYYY-MM-DD')} ~ {moment(data.checkout).format(('YYYY-MM-DD'))}</Desc>
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 방문 수단">
                        <Desc>{data.howto}</Desc>
                    </Descriptions.Item>
                    <Descriptions.Item label="결제정보">
                        <Desc>{data.pay} / {data.amount}원</Desc>
                    </Descriptions.Item>
                </Descriptions>
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

const Desc = styled.div`
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

export default ReservedDetail