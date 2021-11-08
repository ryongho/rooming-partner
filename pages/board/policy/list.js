import styled from 'styled-components'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import moment from 'moment'
import { PlusSquareOutlined } from '@ant-design/icons';
import { Space, Select, Table, Tag, DatePicker, Radio, Button, Input } from 'antd'

const PolicyList = () => {
    const data = [{
        key: '1',
        title: '루밍 앱 약관',
        createdAt: new Date('2021-09-26'),
        state: 'Y'
    }, {
        key: '2',
        title: '루밍 앱 약관2',
        createdAt: new Date('2021-09-26'),
        state: 'Y'
    }, {
        key: '3',
        title: '루밍 앱 약관33333333',
        createdAt: new Date('2021-09-26'),
        state: 'Y'
    }, {
        key: '4',
        title: '루밍 앱 정책 1234 44444',
        createdAt: new Date('2021-09-30'),
        state: 'N'
    }];

    const columns = [{
        title: '제목',
        key: 'title',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a < b ? 1 : a == b ? 0 : -1,
        render: item => {
            return <Link href={`/board/policy/${item.key}`}>{item.title}</Link>
        },
    }, {
        title: '작성일',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a < b ? 1 : a == b ? 0 : -1,
        render: (created_at) => {
            return (
                moment(created_at).format('YYYY-MM-DD')
            )
        }
    }, {
        title: '공개 상태',
        dataIndex: 'state',
        key: 'state',
        render: (state, index) => {
            return state == 'Y' ? <Tag color={'success'} key={index}>활성화</Tag> : <Tag color={'error'} key={index}>비활성화</Tag>
        }
    }];

    const router = useRouter();
    const { Search } = Input;
    const [isAdmin, setIsAdmin] = useState(true);

    const onSearch = () => {

    }

    return (
        <Wrapper>
            <TopBox>
                <FilterWrap>
                    <Filter>
                        <FilterLabel>작성일</FilterLabel>
                        <DatePicker />
                    </Filter>
                    
                    <Filter>
                        <FilterLabel>공개 상태</FilterLabel>
                        <Radio.Group defaultValue={"total"}>
                            <Radio.Button value="total" buttonStyle="solid">전체</Radio.Button>
                            <Radio.Button value="Y">활성화</Radio.Button>
                            <Radio.Button value="N">비활성화</Radio.Button>
                        </Radio.Group>
                    </Filter>
                </FilterWrap>

                <SearchWrap>
                    <FilterLabel>검색</FilterLabel>
                    <SearchBar placeholder="제목을 입력해주세요" onSearch={onSearch} />
                </SearchWrap>
            </TopBox>

            <TableTop>
                <TotalNum>총 {data.length}건</TotalNum>
                <Space>
                    <Button type="primary" onClick={() => router.push('/board/policy/write')}><PlusSquareOutlined /> 약관 및 정책 등록</Button>
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

export default PolicyList