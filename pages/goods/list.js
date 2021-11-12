import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { Space, Select, Table, Tag, message, Radio, Button, Input, Popconfirm } from 'antd'
import { PlusSquareOutlined } from '@ant-design/icons';
import Link from 'next/link'
import moment from 'moment'
import xlsx from 'xlsx'
import router from 'next/router';
import { useStore } from '../../store/StoreProvider'
import { observer } from 'mobx-react-lite'


const GoodsList = observer(() => {

    const columns = [{
        title: '상품명',
        dataIndex: ['goods_name', 'goods_id'],
        key: 'goods_name',
        render: (text, record) => {
            return (
                <Link href={`/goods/${record.goods_id}`}>{record.goods_name}</Link>
            )
        },
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a < b ? 1 : a == b ? 0 : -1,
    }, {
        title: '객실명',
        dataIndex: 'room_name',
        key: 'room_name',
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
    },
    //  {
    //     title: '상태값',
    //     dataIndex: 'active',
    //     key: 'active',
    //     render: (active) => {
    //         return (
    //             <>
    //                 {active ? 
    //                 <Tag color="blue">활성화</Tag>
    //                 : <Tag color="default">비활성화</Tag>}
    //             </>
    //         )
    //     }
    // },
     {
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

    const { user, goods } = useStore()
    const [isAdmin, setIsAdmin] = useState(true);
    const [data, setData] = useState(null)

    useEffect(() => {
        setIsAdmin(user.auth == 1 ? false : true)

        const callList = async () => {
            await goods.callListPartner({id: user.hotelid}, user.token)
            setData(goods.partnerList.data)
            // console.log(user.token, goods.partnerList.data)
        }

        callList()
    }, [])

    const onCategory = (e) => {
        console.log(e)
    }

    const onSearch = (word) => {
        if (word) {
            setData(data.filter(e => e.goods_name.indexOf(word) !== -1))
        } else message.warning('검색어를 입력해 주세요.')
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
                    </Filter>}
                    
                    {/* <Filter>
                        <FilterLabel>상태값</FilterLabel>
                        <Radio.Group defaultValue={"total"}>
                            <Radio.Button value="total" buttonStyle="solid">전체</Radio.Button>
                            <Radio.Button value="">활성화</Radio.Button>
                            <Radio.Button value="">비활성화</Radio.Button>
                        </Radio.Group>
                    </Filter> */}
                </FilterWrap>
                <SearchWrap>
                    <FilterLabel>검색</FilterLabel>
                    <SearchBar placeholder="상품명을 입력해주세요" onSearch={onSearch} />
                </SearchWrap>
            </TopBox>

            <TableTop>
                <TotalNum>총 {goods.partnerList?.data?.length}건</TotalNum>
                <Space>
                    <Button type="primary" onClick={() => router.push('/goods/write')}><PlusSquareOutlined /> 상품 등록</Button>
                    {/* <Button onClick={onExcelDown}>엑셀 다운로드</Button> */}
                </Space>
            </TableTop>
            <Table 
            // rowSelection={{
            //     type: 'checkbox',
            //     onChange: (e) => {setSelectedList(e)},
            //     selectedRowKeys: selectedList
            // }}
            columns={columns} dataSource={data} pagination={{ position: ['bottomCenter'] }}/>

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