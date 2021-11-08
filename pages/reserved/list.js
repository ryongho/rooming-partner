import styled from 'styled-components'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Space, Select, Table, Tag, DatePicker, Radio, Button, Input } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/StoreProvider'

const ReservedList = observer(() => {
    const data = [{
        key: '1',
        goods: '숙소1',
        num: 12312312,
        category: '호텔',
        name: '김루밍',
        checkin: '2021-08-31',
        checkout: '2021-09-01',
        price: '113000',
        duration: 3,
        reserved: '예약확정'
    }, {
        key: '2',
        goods: '숙소123123',
        num: 412315,
        category: '호텔',
        name: '이루밍',
        checkin: '2021-08-31',
        checkout: '2021-09-01',
        price: '113000',
        duration: 3,
        reserved: '예약확정'
    }, {
        key: '3',
        goods: '숙소1231239102',
        num: 83627,
        category: '리조트',
        name: '박루밍',
        checkin: '2021-08-31',
        checkout: '2021-09-01',
        price: '113000',
        duration: 3,
        reserved: '예약취소'
    }, {
        key: '4',
        goods: '숙소1020202020',
        num: 99999,
        category: '호텔',
        name: '홍길동',
        checkin: '2021-08-31',
        checkout: '2021-09-01',
        price: '113000',
        duration: 3,
        reserved: '예약확정'
    }];

    const { user, reservation } = useStore();

    useEffect(() => {
        const callList = async () => {
            await reservation.callList(user.token)
            // console.log(reservation.list.data)
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
        render: reservation_no => {
            return (
                <Link href={`/reserved/${reservation_no}`}><a>{reservation_no}</a></Link>
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
        render: (name, record) => {
            return (
                <Link href={`/reserved/${record.reservation_no}`}><a>{name}</a></Link>
            )
        },
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
    }];

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
                            <Select.Option value={"hotel"}>호텔</Select.Option>
                            <Select.Option value={"resort"}>리조트</Select.Option>
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
                            <Radio.Button value="">예약확정</Radio.Button>
                            <Radio.Button value="">예약취소</Radio.Button>
                        </Radio.Group>
                    </Filter>
                </FilterWrap>

                <SearchWrap>
                    <FilterLabel>검색</FilterLabel>
                    <SearchBar placeholder="예약자명 또는 상품명을 입력해주세요" onSearch={onSearch} />
                </SearchWrap>
            </TopBox>

            <TableTop>
                <TotalNum>총 {data.length}건</TotalNum>
                <Space>
                    <Button type="primary" onClick={onExcelDown}>엑셀 다운로드</Button>
                </Space>
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