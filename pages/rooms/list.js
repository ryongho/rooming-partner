import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { Space, Select, Table, Tag, message, Radio, Button, Input, DatePicker, Popconfirm } from 'antd'
import { PlusSquareOutlined } from '@ant-design/icons';
import Link from 'next/link'
import moment from 'moment'
import router from 'next/router';
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/StoreProvider'


const RoomsList = observer(() => {

    const { room, user } = useStore();

    const [isAdmin, setIsAdmin] = useState(true);
    const [data, setData] = useState(null)

    useEffect(() => {
        // 관리자 모드 설정
        setIsAdmin(user.auth == 1 ? false : true)

        // 객실 리스트 정보 불러오기
        const callList = async () => {
            await room.callListPartner(user.token)
            setData(room.partnerList.data[0])
        }

        callList()
    }, [])

    const columns = [{
        title: '객실명',
        dataIndex: ['name', 'id'],
        key: 'name',
        render: (text, record) => {
            return (
                <Link href={`/rooms/${record.id}`}>{record.name}</Link>
            )
        },
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a < b ? 1 : a == b ? 0 : -1,
    }, {
        title: '침대 사이즈',
        dataIndex: 'bed',
        key: 'bed',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a < b ? 1 : a == b ? 0 : -1,
    }, {
        title: '침대 개수',
        dataIndex: 'amount',
        key: 'amount',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.amount - b.amount,
    }, {
        title: '기준 인원수',
        dataIndex: 'peoples',
        key: 'peoples',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.peoples - b.peoples,
    }, {
        title: '삭제',
        dataIndex: 'delete',
        render: (_, record) => {
            return (<Popconfirm
                title='정말 삭제하시겠습니까?'
                okText='삭제'
                okType='danger'
                onConfirm={async () => {
                    const params = {
                        room_id: record.id
                    }
                    
                    await room.deleteRoom(params, user.token, async (status) => {
                        if(status){
                            // success
                            message.success('삭제 완료')
                            await room.callListPartner(user.token)
                            setData(room.partnerList.data[0])
                            router.push('/rooms/list');
                        }
                    })

                }}
                cancelText='취소'>
            <Button type="danger">삭제</Button>
            </Popconfirm>)
        }
    }];

    // 검색 클릭 event
    const onSearch = async (word) => {
        if (word) {
            setData(data.filter(e => e.name.indexOf(word) !== -1))
        } else {
            message.warning('검색어를 입력해 주세요.');
            
            await room.callListPartner(user.token)
            setData(room.partnerList.data[0])
        }
    }

    // 객실 등록일 검색 event
    const onListDate = (e) => {
        if (e) {
            let selectDate = moment(e._d).format('YYYY-MM-DD');
            setData(data.filter(e => moment(e.created_at).format('YYYY-MM-DD') == selectDate))
        } else setData(room.partnerList.data[0])
    }

    return (
        <Wrapper>
            <TopBox>
                <FilterWrap>
                    {/* <Filter>
                        <FilterLabel>객실 등록일</FilterLabel>
                        <DatePicker onChange={onListDate} />
                    </Filter> */}
                    
                </FilterWrap>
                <SearchWrap>
                    <FilterLabel>검색</FilterLabel>
                    <SearchBar placeholder="객실명을 입력해주세요" onSearch={onSearch} />
                </SearchWrap>
            </TopBox>

            <TableTop>
                <TotalNum>총 {room.partnerList.data && room.partnerList.data[0]?.length}건</TotalNum>
                <Space>
                    <Button type="primary" onClick={() => router.push('/rooms/write')}><PlusSquareOutlined /> 객실 등록</Button>
                </Space>
            </TableTop>

            {room.partnerList.data &&
                <Table columns={columns} dataSource={data} pagination={{ position: ['bottomCenter'] }}/>
            }
        </Wrapper>
    )
})


const Wrapper = styled.div`
    width: 100%;
    padding-bottom: 80px;
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