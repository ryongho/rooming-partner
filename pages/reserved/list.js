import styled from 'styled-components'
import { useState } from 'react'
import { Space, Select, Table, Tag, DatePicker, Radio, Button, Input } from 'antd'

const ReservedList = () => {
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

    const onCategory = (e) => {
        console.log(e)
    }

    const columns = [{
        title: '예약번호',
        dataIndex: 'num',
        key: 'num',
    }, {
        title: '카테고리',
        dataIndex: 'category',
        key: 'category',
    }, {
        title: '상품명',
        dataIndex: 'goods',
        key: 'goods',
    }, {
        title: '예약자명',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '체크인',
        dataIndex: 'checkin',
        key: 'checkin',
        sorter: (a, b) => a.address.length - b.address.length,
    }, {
        title: '체크아웃',
        dataIndex: 'checkout',
        key: 'checkout',
        sorter: (a, b) => a.address.length - b.address.length,
    }, {
        title: '숙박수',
        dataIndex: 'duration',
        key: 'duration',
    }, {
        title: '예약상태',
        dataIndex: 'reserved',
        key: 'reserved',
        render: reserved => {
            let color;
            reserved == '예약확정' ? color = 'success' : color = 'error';
            return <Tag color={color} key={reserved}>{reserved}</Tag>
        }
    }, {
        title: '금액',
        dataIndex: 'price',
        key: 'price',
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
            </TopBox>

            <TableTop>
                <TotalNum>총 {data.length}건</TotalNum>
                <Space>
                    <Search placeholder="검색어를 입력해주세요" onSearch={onSearch} style={{ width: 400 }} />
                    <ExcelDownBtn type="primary" onClick={onExcelDown}>엑셀 다운로드</ExcelDownBtn>
                </Space>
            </TableTop>
            <Table columns={columns} dataSource={data} pagination={{ position: ['bottomCenter'] }}/>
        </Wrapper>
    )
}

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

const ExcelDownBtn = styled(Button)`
    margin-left: 20px;
`


export default ReservedList