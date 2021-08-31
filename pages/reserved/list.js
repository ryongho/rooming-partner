import styled from 'styled-components'
import { PageHeader, Select, Table, Tag } from 'antd'
import { SearchOutlined } from '@ant-design/icons';

const ReservedList = () => {
    const data = [{
        key: '1',
        product: '숙소1',
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
        product: '숙소123123',
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
        product: '숙소1231239102',
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
        product: '숙소1020202020',
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
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.address.length - b.address.length,
    }, {
        title: '카테고리',
        dataIndex: 'category',
        key: 'category',
    }, {
        title: '상품명',
        dataIndex: 'product',
        key: 'product',
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


    return (
        <Wrapper>
            <TopBox>
                <Filter>
                    <FilterLabel>카테고리</FilterLabel>
                    <SelectBar defaultValue={"total"} onChange={onCategory}>
                        <Select.Option value={"total"}>전체</Select.Option>
                        <Select.Option value={"hotel"}>호텔</Select.Option>
                        <Select.Option value={"resort"}>리조트</Select.Option>
                    </SelectBar>
                </Filter>
            </TopBox>
            <Table columns={columns} dataSource={data} />
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
`

const TopBox = styled.div`
    padding: 15px 20px;
    background-color: #fff;
    margin-bottom: 15px;
`

const Filter = styled.div`
    display: flex;
    align-items: center;
`

const FilterLabel = styled.div`
    padding-right: 8px;
    font-weight: bold;
`

const SelectBar = styled(Select)`
    width: 150px;
`

export default ReservedList