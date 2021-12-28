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

    const { hotel, user } = useStore();

    const [isAdmin, setIsAdmin] = useState(true);

    useEffect(() => {
        setIsAdmin(user.auth == 1 ? false : true)
        const callList = async () => {
            await user.callInfo(user.token)
            await hotel.callListPartner(user.token)
            // console.log(user.token, user.info)
        }

        callList()
    }, [])

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
                <Link href={`/hotel/${user.hotelid}`}>{name}</Link>
            )
        },
        // sortDirections: ['descend', 'ascend'],
        // sorter: (a, b) => a < b ? 1 : a == b ? 0 : -1,
    }, {
        title: '파트너명',
        dataIndex: 'owner',
        key: 'owner',
    }, {
        title: '등록일',
        dataIndex: 'created_at',
        key: 'created_at',
        // sortDirections: ['descend', 'ascend'],
        // sorter: (a, b) => a < b ? 1 : a == b ? 0 : -1,
        render: (created_at) => {
            return (
                moment(created_at).format('YYYY-MM-DD')
            )
        }
    }];

    const onCategory = (e) => {
        // console.log(e)
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
            {isAdmin &&
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
                        <FilterLabel>숙소 등록일</FilterLabel>
                        <DatePicker />
                    </Filter>
                    
                </FilterWrap>
                <SearchWrap>
                    <FilterLabel>검색</FilterLabel>
                    <SearchBar placeholder="숙소명 또는 파트너명을 입력해주세요" onSearch={onSearch} />
                </SearchWrap>
            </TopBox>
            }

            <TableTop>
                {/* <TotalNum>총 {hotel.partnerList.data && hotel.partnerList.data.length}건</TotalNum> */}
                <Space> </Space>
                <Space>
                    {!user.hotelid &&
                    <Button type="primary" onClick={onWriteHotel}><PlusSquareOutlined /> 숙소 등록</Button>}
                    {/* <Button onClick={onExcelDown}>엑셀 다운로드</Button> */}
                </Space>
            </TableTop>
            <Table columns={columns} dataSource={hotel.partnerList.data} pagination={false}/>
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
    margin-bottom: 5px;
`

const FilterLabel = styled.div`
    min-width: 77px;
    padding-right: 8px;
    font-weight: bold;
    color: #666;
`

const SearchWrap = styled(Filter)`
    margin-top: 10px;
`

const SearchBar = styled(Input.Search)`
    width: 80%;
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