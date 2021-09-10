import styled from 'styled-components'
import { useState } from 'react'
import { Space, Select, Table, Tag, message, Radio, Button, Input, DatePicker, Popconfirm } from 'antd'
import { PlusSquareOutlined } from '@ant-design/icons';
import Link from 'next/link'
import moment from 'moment'
import xlsx from 'xlsx'
import router from 'next/router';


const RoomsList = () => {
    const data = [{
        key: '1',
        category: '호텔',
        goods: '여름날 치맥 파티',
        rooms: '스탠다드 트윈 시티뷰',
        hotel: '라마다 프라자 바이 윈덤 여수 호텔',
        createdAt: new Date('2021-09-05'),
        active: false,
    }, {
        key: '2',
        category: '호텔',
        goods: '여름날 치맥 파티',
        rooms: '스탠다드 트윈 시티뷰',
        hotel: '호텔1111',
        createdAt: new Date('2021-08-12'),
        active: true,
    }, {
        key: '3',
        category: '호텔',
        goods: '봄날 파전 파티',
        rooms: '주니어 스위트 룸',
        hotel: '호텔2222',
        createdAt: new Date('2021-09-26'),
        active: true,
    }, {
        key: '4',
        category: '호텔',
        goods: '겨울날 군고구마 파티',
        rooms: '디럭스 더블 오션뷰',
        hotel: '호텔3333',
        createdAt: new Date('2021-07-30'),
        active: false,
    }];

    const columns = [{
        title: '카테고리',
        dataIndex: 'category',
        key: 'category',
    }, {
        title: '객실명',
        dataIndex: 'rooms',
        key: 'rooms',
        render: (rooms) => {
            return (
                <Link href={`/rooms/1`}>{rooms}</Link>
            )
        },
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => { return (a < b) ? -1 : (a == b) ? 0 : 1 },
    }, {
        title: '객실 생성일',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => { return (a < b) ? -1 : (a == b) ? 0 : 1 },
        render: (createdAt) => {
            return (
                moment(createdAt).format('YYYY-MM-DD')
            )
        }
    }, {
        title: '상품 상태값',
        dataIndex: 'active',
        key: 'active',
        render: (active) => {
            return (
                active ? <Tag color="blue">활성화</Tag> : <Tag color="default">비활성화</Tag>
            )
        }
    }, {
        title: '숙소명',
        dataIndex: 'hotel',
        key: 'hotel',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => { return (a < b) ? -1 : (a == b) ? 0 : 1 },
    }, {
        title: '삭제',
        dataIndex: 'delete',
        render: (_, idx) => {
            return (<Popconfirm
                title='정말 삭제하시겠습니까?'
                okText='삭제'
                okType='danger'
                onConfirm={async () => {
                    console.log(idx.key)

                    // success
                    message.success('삭제 완료')
                }}
                cancelText='취소'>
            <Button type="danger">삭제</Button>
            </Popconfirm>)
        }
    }];

    const [isAdmin, setIsAdmin] = useState(true);


    const onCategory = (e) => {
        console.log(e)
    }

    const onSearch = () => {

    }

    const onExcelDown = () => {

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
                        <FilterLabel>객실 등록일</FilterLabel>
                        <DatePicker />
                    </Filter>
                    
                    <Filter>
                        <FilterLabel>상품 상태값</FilterLabel>
                        <Radio.Group defaultValue={"total"}>
                            <Radio.Button value="total" buttonStyle="solid">전체</Radio.Button>
                            <Radio.Button value="">활성화</Radio.Button>
                            <Radio.Button value="">비활성화</Radio.Button>
                        </Radio.Group>
                    </Filter>
                    
                </FilterWrap>
                <SearchWrap>
                    <FilterLabel>검색</FilterLabel>
                    <SearchBar placeholder="객실명 또는 숙소명을 입력해주세요" onSearch={onSearch} />
                </SearchWrap>
            </TopBox>

            <TableTop>
                <TotalNum>총 {data.length}건</TotalNum>
                <Space>
                    <Button type="primary" onClick={() => router.push('/rooms/write')}><PlusSquareOutlined /> 객실 등록</Button>
                    <Button onClick={onExcelDown}>엑셀 다운로드</Button>
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


export default RoomsList