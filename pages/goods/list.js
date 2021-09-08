import styled from 'styled-components'
import { useState } from 'react'
import { Space, Select, Table, Tag, message, Radio, Button, Input, Modal } from 'antd'
import { PlusSquareOutlined } from '@ant-design/icons';
import Link from 'next/link'
import moment from 'moment'
import xlsx from 'xlsx'
import router from 'next/router';


const GoodsList = () => {
    const data = [{
        key: '1',
        category: '호텔',
        goods: '여름날 치맥 파티',
        rooms: '스탠다드 트윈 시티뷰',
        hotel: '라마다 프라자 바이 윈덤 여수 호텔',
        price: '40000',
        sale_price: '34000',
        active: true,
    }, {
        key: '2',
        category: '호텔',
        goods: '여름날 치맥 파티',
        rooms: '스탠다드 트윈 시티뷰',
        hotel: '호텔1111',
        price: '60000',
        sale_price: '54000',
        active: true,
    }, {
        key: '3',
        category: '호텔',
        goods: '봄날 파전 파티',
        rooms: '스탠다드 트윈 시티뷰',
        hotel: '호텔2222',
        price: '55000',
        sale_price: '40000',
        active: false,
    }, {
        key: '4',
        category: '호텔',
        goods: '겨울날 군고구마 파티',
        rooms: '스탠다드 트윈 시티뷰',
        hotel: '호텔3333',
        price: '73000',
        sale_price: '24000',
        active: true,
    }];

    const columns = [{
        title: '카테고리',
        dataIndex: 'category',
        key: 'category',
    }, {
        title: '상품명',
        dataIndex: 'goods',
        key: 'goods',
        render: (goods) => {
            return (
                <Link href={`/goods/1`}>{goods}</Link>
            )
        },
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => { return (a < b) ? -1 : (a == b) ? 0 : 1 },
    }, {
        title: '객실명',
        dataIndex: 'rooms',
        key: 'rooms',
    }, {
        title: '숙소명',
        dataIndex: 'hotel',
        key: 'hotel',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => { return (a < b) ? -1 : (a == b) ? 0 : 1 },
    }, {
        title: '원가',
        dataIndex: 'price',
        key: 'price',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.price - b.price,
    }, {
        title: '할인가',
        dataIndex: 'sale_price',
        key: 'sale_price',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.sale_price - b.sale_price,
    }, {
        title: '상태값',
        dataIndex: 'active',
        key: 'active',
        render: (active, item) => {
            return (
                <Radio.Group defaultValue={active ? 'active' : 'notActive'} onChange={(e) => onChangeActive(e, item)}>
                    <Radio.Button value="active" buttonStyle="solid">활성화</Radio.Button>
                    <Radio.Button value="notActive">비활성화</Radio.Button>
                </Radio.Group>
            )
        }
    }];

    const [isAdmin, setIsAdmin] = useState(true);
    const [selectedList, setSelectedList] = useState([])
    const [showDelete, setShowDelete] = useState(false)

    console.log(selectedList)
    const onChangeActive = (e, item) => {
        console.log(item)
    }

    const onCategory = (e) => {
        console.log(e)
    }

    const onSearch = () => {

    }

    const onExcelDown = () => {

    }

    const onClickDelete = () => {
        if (selectedList.length < 1) {
            message.warning('삭제할 상품을 1개 이상 선택해 주세요')
        }

        setShowDelete(true);
    }

    const onDeleteLists = () => {
        // let lists = dataSource.filter((item) => item.key !== selectedList)
        // setDataSource(lists)
        setShowDelete(false);
    }

    return (
        <Wrapper>
            <TopBox>
                <FilterWrap>
                    <Filter>
                        <FilterLabel>카테고리</FilterLabel>
                        <SelectBar defaultValue={"total"} onChange={onCategory}>
                            <Select.Option value={"total"}>전체</Select.Option>
                            <Select.Option value={"hotel"}>호텔</Select.Option>
                            <Select.Option value={"resort"}>리조트</Select.Option>
                        </SelectBar>
                    </Filter>
                    
                    <Filter>
                        <FilterLabel>상태값</FilterLabel>
                        <Radio.Group defaultValue={"total"}>
                            <Radio.Button value="total" buttonStyle="solid">전체</Radio.Button>
                            <Radio.Button value="">활성화</Radio.Button>
                            <Radio.Button value="">비활성화</Radio.Button>
                        </Radio.Group>
                    </Filter>
                    
                </FilterWrap>
                <SearchWrap>
                    <FilterLabel>검색</FilterLabel>
                    <SearchBar placeholder="상품명 또는 숙소명을 입력해주세요" onSearch={onSearch} />
                </SearchWrap>
            </TopBox>

            <TableTop>
                {/* <TotalNum>총 {data.length}건</TotalNum> */}
                <Button type="danger" onClick={onClickDelete}>삭제</Button>
                <Space>
                    <Button type="primary" onClick={() => router.push('/goods/write')}><PlusSquareOutlined /> 상품 등록</Button>
                    <Button onClick={onExcelDown}>엑셀 다운로드</Button>
                </Space>
            </TableTop>
            <Table 
            rowSelection={{
                type: 'checkbox',
                onChange: (e) => {setSelectedList(e)},
                selectedRowKeys: selectedList
            }}
            columns={columns} dataSource={data} pagination={{ position: ['bottomCenter'] }}/>

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

const SearchWrap = styled(Filter)`
    margin-top: 15px;
`

const SearchBar = styled(Input.Search)`
    width: 45%;
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


export default GoodsList