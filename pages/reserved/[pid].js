import styled from 'styled-components'
import { Descriptions, Button } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useStore } from '../../store/StoreProvider'
import { observer } from 'mobx-react-lite'

const ReservedDetail = observer(() => {
    
    const { user, reservation } = useStore();
    const router = useRouter();
    const [data, setData] = useState();

    useEffect(() => {
        // 상세 정보 불러오기
        const callDetail = async() => {
            await reservation.callDetail({id: router.query.pid}, user.token, (success, result) => {
                if (success) {
                    console.log(result.data)
                    setData(result.data[0])
                }
            });
        }
        callDetail();
    }, [])

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>예약 상세 정보</Title>} bordered column={1} extra={<Button onClick={() => router.push('/reserved/list')}>목록으로 돌아가기</Button>}>
                    {data &&
                    <>
                        <Descriptions.Item label="예약번호">
                            <Desc>{data.reservation_no}</Desc>
                        </Descriptions.Item>
                        <Descriptions.Item label="예약자">
                            <Desc>{data.name} / {data.phone ? `${data.phone.slice(0,3)}-${data.phone.slice(3,7)}-${data.phone.slice(7)}` : null}</Desc>
                        </Descriptions.Item>
                        {/* <Descriptions.Item label="투숙객">
                            <Desc>{data.reservedName} / {data.reservedPhone}</Desc>
                        </Descriptions.Item> */}
                        <Descriptions.Item label="숙소 카테고리">
                            <Desc>{data.shop_type}</Desc>
                        </Descriptions.Item>
                        <Descriptions.Item label="숙소">
                            <Desc>{data.hotel_name}</Desc>
                            <Desc>{data.address}</Desc>
                        </Descriptions.Item>
                        <Descriptions.Item label="상품명">
                            <Desc>{data.goods_name}</Desc>
                        </Descriptions.Item>
                        <Descriptions.Item label="객실명">
                            <Desc>{data.room_name}</Desc>
                        </Descriptions.Item>
                        {/* <Descriptions.Item label="숙박 인원수">
                            <Desc>{data.peoples}</Desc>
                        </Descriptions.Item> */}
                        <Descriptions.Item label="체크인 / 체크아웃">
                            <Desc>{data.start_date} {data.checkin} ~ {data.end_date} {data.checkout}</Desc>
                        </Descriptions.Item>
                        <Descriptions.Item label="숙소 방문 수단">
                            <Desc>{data.visit_way}</Desc>
                        </Descriptions.Item>
                        <Descriptions.Item label="예약 상태">
                            <Desc>
                                {data.status == 'P' && '입금확인요청'}
                                {data.status == 'W' && '예약대기'}
                                {data.status == 'S' && '예약확정'}
                                {data.status == 'C' && '취소완료'}
                                {data.status == 'X' && '취소신청'}
                            </Desc>
                        </Descriptions.Item>
                        <Descriptions.Item label="결제정보">
                            <Desc>무통장입금 / {data.sale_price == '' ? data.price : data.sale_price}원</Desc>
                        </Descriptions.Item>
                    </>
                    }
                </Descriptions>
            </Detail>
        </Wrapper>
    )
})


const Wrapper = styled.div`
    width: 100%;
    max-width: 1100px;
    padding-bottom: 100px;
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