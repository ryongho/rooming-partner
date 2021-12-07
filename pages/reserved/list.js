import styled from 'styled-components'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Space, Select, Table, Tag, DatePicker, Radio, Button, Input, Popconfirm, message } from 'antd'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useStore } from '../../store/StoreProvider'

const ReservedList = observer(() => {
    const { user, reservation } = useStore();
    const router = useRouter();



    useEffect(() => {
        const callList = async () => {
            if(user.token){
                await reservation.callList(user.token)
            }
        }

        callList()
    }, [])

    const onCategory = (e) => {
        console.log(e)
    }

    const columns = [{
        title: '예약번호',
        dataIndex: 'reservation_no',
        key: 'reservation_no',
        render: (reservation_no, record) => {
            return (
                <Link href={`/reserved/${record.reservation_id}`}><a>{reservation_no}</a></Link>
            )
        },
    }, {
        title: '카테고리',
        dataIndex: 'shop_type',
        key: 'shop_type',
    }, {
        title: '상품명',
        dataIndex: 'goods_name',
        key: 'goods_name',
    }, {
        title: '예약자명',
        dataIndex: 'name',
        key: 'name',
        render: name => {return name}
    }, {
        title: '체크인',
        dataIndex: 'start_date',
        key: 'start_date',
        sorter: (a, b) => a < b ? 1 : a == b ? 0 : -1,
    }, {
        title: '체크아웃',
        dataIndex: 'end_date',
        key: 'end_date',
        sorter: (a, b) => a.end_date.length - b.end_date.length,
    }, {
        title: '숙박수',
        dataIndex: 'nights',
        key: 'nights',
    }, {
        title: '예약상태',
        dataIndex: 'status',
        key: 'status',
        render: status => {
            if (status == 'W') return <Tag color={'success'}>예약대기</Tag>
            if (status == 'P') return <Tag color={'success'}>입금확인요청</Tag>
            if (status == 'S') return <Tag color={'processing'}>예약확정</Tag>
            if (status == 'C') return <Tag color={'default'}>취소완료</Tag>
            if (status == 'X') return <Tag color={'error'}>취소신청</Tag>
        }
    }, {
        title: '금액',
        dataIndex: ['price', 'sale_price'],
        key: 'price',
        render: (text, record) => {
            if (record.sale_price == '') return record.price
            else return record.sale_price
        }
    },{
        title: '예약확정',
        dataIndex: 'status',
        render: (status, record) => {
            return (<Popconfirm
                title='예약 확정하시겠습니까?'
                okText='예약확정'
                disabled={record.status !== "P"}
                onConfirm={async () => {
                    const params = {
                        reservation_id: record.reservation_id
                    }
                    await reservation.confirmReservation(params, user.token, async (status) => {
                        if(status){
                            // success
                            message.success('예약확정 완료')
                            await reservation.callList(user.token)
                            router.push('/reserved/list').then(()=> window.scrollTo(0,0));
                        }
                    })
                }}
                cancelText='취소'>
                <Button>예약확정</Button>
            </Popconfirm>)
        }
    },{
        title: '예약취소',
        dataIndex: 'status',
        render: (status, record) => {
            return (<Popconfirm
                title='예약 취소하시겠습니까?'
                okText='예약취소'
                okType='danger'
                onConfirm={async () => {
                    const params = {
                        id: record.reservation_id
                    }
                    await reservation.cancelReservation(params, user.token, async (status) => {
                        if(status){
                            // success
                            message.success('예약 취소 완료')
                            await reservation.callList(user.token)
                            router.push('/reserved/list').then(()=> window.scrollTo(0,0));
                        }
                    })
                }}
                cancelText='취소'>
                <Button>예약취소</Button>
            </Popconfirm>)
        }
    }
    ];

    const { RangePicker } = DatePicker;
    const { Search } = Input;
    const [isAdmin, setIsAdmin] = useState(true);

    const onSearch = () => {

    }

    const onExcelDown = () => {

    }

    return (
        <Wrapper>
            <TopBox>
                <FilterWrap>
                    {isAdmin &&
                    <Filter>
                        <FilterLabel>카테고리</FilterLabel>
                        <SelectBar defaultValue={"total"} onChange={onCategory}>
                            <Select.Option value={"total"}>전체</Select.Option>
                            <Select.Option value={"호텔"}>호텔</Select.Option>
                            <Select.Option value={"모텔"}>모텔</Select.Option>
                            <Select.Option value={"펜션"}>펜션</Select.Option>
                            <Select.Option value={"콘도"}>콘도</Select.Option>
                        </SelectBar>
                    </Filter>
                    }
                    
                    <Filter>
                        <FilterLabel>예약날짜</FilterLabel>
                        <RangePicker placeholder={['체크인', '체크아웃']} />
                    </Filter>
                    
                    <Filter>
                        <FilterLabel>예약상태</FilterLabel>
                        <Radio.Group defaultValue={"total"}>
                            <Radio.Button value="total" buttonStyle="solid">전체</Radio.Button>
                            <Radio.Button value="S">예약확정</Radio.Button>
                            <Radio.Button value="X">예약취소</Radio.Button>
                        </Radio.Group>
                    </Filter>
                </FilterWrap>

                <SearchWrap>
                    <FilterLabel>검색</FilterLabel>
                    <SearchBar placeholder="예약자명 또는 예약번호를 입력해주세요" onSearch={onSearch} />
                </SearchWrap>
            </TopBox>

            <TableTop>
                <TotalNum>총 {reservation?.list?.data?.length}건</TotalNum>
                {/* <Space>
                    <Button type="primary" onClick={onExcelDown}>엑셀 다운로드</Button>
                </Space> */}
            </TableTop>
            <Table columns={columns} dataSource={reservation.list.data} pagination={{ position: ['bottomCenter'] }}/>
        </Wrapper>
    )
})

const Wrapper = styled.div`
    width: 100%;
`

const TopBox = styled.div`
    width: 100%;
    padding: 15px 20px;
    background-color: #fff;
    margin-bottom: 15px;
`

const FilterWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
`

const Filter = styled.div`
    display: flex;
    align-items: center;
    padding-right: 35px;
`

const FilterLabel = styled.div`
    padding-right: 8px;
    font-weight: bold;
    color: #666;
`

const SelectBar = styled(Select)`
    width: 150px;
`

const TableTop = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 15px;
`

const TotalNum = styled.div`
    padding-left: 8px;
    color: #333;
    font-weight: bold;
`

const SearchWrap = styled(Filter)`
    margin-top: 15px;
`

const SearchBar = styled(Input.Search)`
    width: 45%;
`



export default ReservedList