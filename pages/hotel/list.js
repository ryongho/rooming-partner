import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { Space, Select, Table, Tag, DatePicker, Radio, Button, Input, message } from 'antd'
import { PlusSquareOutlined } from '@ant-design/icons';
import Link from 'next/link'
import moment from 'moment'
import xlsx from 'xlsx'
import router from 'next/router';
import { useStore } from '../../store/StoreProvider'
import { observer } from 'mobx-react-lite'

const HotelList = observer(() => {
    const data = [{
        key: '1',
        category: '호텔',
        hotel: '라마다 프라자 바이 윈덤 여수 호텔',
        partner: '파트너1',
        createdAt: new Date('2021-09-05'),
    }, {
        key: '2',
        category: '호텔',
        hotel: '호텔1234',
        partner: '파트너2',
        createdAt: new Date('2021-08-12')
    }, {
        key: '3',
        category: '호텔',
        hotel: '호텔1234',
        partner: '파트너3',
        createdAt: new Date('2021-09-26')
    }, {
        key: '4',
        category: '호텔',
        hotel: '호텔1234',
        partner: '파트너4',
        createdAt: new Date('2021-07-30')
    }];

    const columns = [{
        title: '카테고리',
        dataIndex: 'type',
        key: 'type',
    }, {
        title: '숙소명',
        dataIndex: 'name',
        key: 'name',
        render: (name) => {
            return (
                <Link href={`/hotel/1`}>{name}</Link>
            )
        },
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => { return (a < b) ? -1 : (a == b) ? 0 : 1 },
    }, {
        title: '파트너명',
        dataIndex: 'owner',
        key: 'owner',
    }, {
        title: '등록일',
        dataIndex: 'created_at',
        key: 'created_at',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => { return (a < b) ? -1 : (a == b) ? 0 : 1 },
        render: (created_at) => {
            return (
                moment(created_at).format('YYYY-MM-DD')
            )
        }
    }];

    const { hotel, user } = useStore();

    const [isAdmin, setIsAdmin] = useState(true);

    useEffect(() => {
        setIsAdmin(user.auth == 1 ? false : true)
        const callList = async () => {
            await hotel.callListPartner(user.token)
            console.log(user.token, hotel.partnerList)
        }

        callList()
    }, [])

    const onCategory = (e) => {
        console.log(e)
    }

    const onSearch = () => {

    }

    const onExcelDown = () => {

    }

    const onWriteHotel = () => {
        if (user.hotelid) {
            return message.error("숙소는 업체당 1개씩만 등록 가능합니다.")
        } else router.push('/hotel/write')
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
                        <FilterLabel>숙소 등록일</FilterLabel>
                        <DatePicker />
                    </Filter>
                    
                </FilterWrap>
                <SearchWrap>
                    <FilterLabel>검색</FilterLabel>
                    <SearchBar placeholder="숙소명 또는 파트너명을 입력해주세요" onSearch={onSearch} />
                </SearchWrap>
            </TopBox>

            <TableTop>
                <TotalNum>총 {data.length}건</TotalNum>
                <Space>
                    <Button type="primary" onClick={onWriteHotel}><PlusSquareOutlined /> 숙소 등록</Button>
                    {/* <Button onClick={onExcelDown}>엑셀 다운로드</Button> */}
                </Space>
            </TableTop>
            <Table columns={columns} dataSource={hotel.partnerList.data} pagination={{ position: ['bottomCenter'] }}/>
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



export default HotelList