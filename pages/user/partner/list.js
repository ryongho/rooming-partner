import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { Space, Select, Table, Tag, DatePicker, Radio, Button, Input } from 'antd'
import Link from 'next/link'
import moment from 'moment'
import xlsx from 'xlsx'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../store/StoreProvider'

const PartnerList = observer(() => {
    const data = [{
        key: '1',
        partner: '가나다라',
        user_id: 'test1234',
        joinAt: new Date('2021-08-30'),
        name: '김루밍',
        phone: '010-1234-1234'
    }, {
        key: '2',
        partner: '파트너2',
        user_id: 'test1234',
        joinAt: new Date('2021-08-20'),
        name: '이루밍',
        phone: '010-1234-1234'
    }, {
        key: '3',
        partner: '파트너3',
        user_id: 'test1234',
        joinAt: new Date('2021-08-11'),
        name: '박루밍',
        phone: '010-1234-1234'
    }, {
        key: '4',
        partner: '파트너4',
        user_id: 'test1234',
        joinAt: new Date('2021-05-31'),
        name: '김루밍',
        phone: '010-1234-1234'
    }];

    const { user } = useStore();
    const [isAdmin, setIsAdmin] = useState(true);

    useEffect(() => {
        const callDetail = async() => {
            await user.callInfo(user.token);
        }
        callDetail();
        setIsAdmin(localStorage.getItem('rmaauth') == 1 ? false : true)
    }, [])

    const partnerData = [{
        partner: user.nickname,
        user_id: user.email,
        joinAt: moment(user.created_at).format('YYYY-MM-DD'),
        name: user.name,
        phone: user.info && user.info.data.phone
    }]

    const columns = [{
        title: '파트너명',
        dataIndex: 'partner',
        key: 'partner',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a < b ? 1 : a == b ? 0 : -1,
        render: (partner) => {
            if (isAdmin) return <Link href={`/user/partner/1`}><a>{partner}</a></Link>
            else return <Link href={'/user/partner/detail'}><a>{partner}</a></Link>
        }
    }, {
        title: '아이디',
        dataIndex: 'user_id',
        key: 'user_id',
        render: (user_id) => {
            if (isAdmin) return <Link href={`/user/partner/1`}><a>{user_id}</a></Link>
            else return <Link href={'/user/partner/detail'}><a>{user_id}</a></Link>
        }
    }, {
        title: '담당자명',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '연락처',
        dataIndex: 'phone',
        key: 'phone',
    }, {
        title: '가입일',
        dataIndex: 'joinAt',
        key: 'joinAt',
        render: (joinAt) => {
            return moment(joinAt).format('YYYY-MM-DD')
        },
        // sortDirections: ['descend', 'ascend'],
        // sorter: (a, b) => a < b ? 1 : a == b ? 0 : -1,
    }];

    const onCategory = (e) => {
        console.log(e)
    }

    const onSearch = (e) => {
        console.log(e)
    }

    const onExcelDown = () => {

    }

    return (
        <Wrapper>
        {isAdmin &&
        <>
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
                        <FilterLabel>가입일</FilterLabel>
                        <DatePicker />
                    </Filter>
                </FilterWrap>
                <SearchWrap>
                    <FilterLabel>검색</FilterLabel>
                    <SearchBar placeholder="숙소명 또는 파트너명을 입력해주세요" onSearch={onSearch} />
                </SearchWrap>
            </TopBox>

            <TableTop>
                <TotalNum>총 {data.length}명</TotalNum>
                <Space>
                    <Button onClick={onExcelDown}>엑셀 다운로드</Button>
                </Space>
            </TableTop>
        </>
        }
            <Table 
            columns={columns} 
            dataSource={isAdmin ? data : partnerData} 
            pagination={{ position: ['bottomCenter'] }} />
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


export default PartnerList