import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { Checkbox, Select, Table, Tag, DatePicker, Radio, Button, Input } from 'antd'
import moment from 'moment'
import router from 'next/router';


const ReviewList = () => {
    const data = [{
        key: '1',
        goods: '즐겨요 뜨끈뜨끈 온천욕',
        desc: '온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요.',
        writer: '쓰니1',
        createdAt: new Date('2021-09-05'),
        rating: '4'
    }, {
        key: '2',
        goods: '즐겨요 뜨끈뜨끈 온천욕',
        desc: '온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요.',
        writer: '쓰니2',
        createdAt: new Date('2021-09-05'),
        rating: '5'
    }, {
        key: '3',
        goods: '즐겨요 뜨끈뜨끈 온천욕',
        desc: '온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요.',
        writer: '쓰니3',
        createdAt: new Date('2021-09-05'),
        rating: '4'
    }, {
        key: '4',
        goods: '즐겨요 뜨끈뜨끈 온천욕',
        desc: '온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요. 온천욕 다녀왔는데요.',
        writer: '쓰니4',
        createdAt: new Date('2021-09-05'),
        rating: '3.5'
    }, ];

    const columns = [{
        title: '상품명',
        dataIndex: 'goods',
        key: 'goods',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a < b ? 1 : a == b ? 0 : -1,
    }, {
        title: '리뷰내용',
        width: '40%',
        dataIndex: 'desc',
        key: 'desc',
        render: (desc) => {
            return (
                <ReviewDesc><div onClick={(e) => e.target.classList.toggle('visible')}>{desc}</div></ReviewDesc>
            )
        }
    }, {
        title: '작성자',
        dataIndex: 'writer',
        key: 'writer',
    }, {
        title: '작성일',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a < b ? 1 : a == b ? 0 : -1,
        render: (createdAt) => {
            return (
                moment(createdAt).format('YYYY-MM-DD')
            )
        }
    }, {
        title: '별점순',
        dataIndex: 'rating',
        key: 'rating',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.rating - b.rating,
        render: (rating) => {
            return <div>{rating} / 5</div>
        }
    }, {
        title: '블라인드',
        dataIndex: 'hidden',
        key: 'hidden',
        render: (_, idx) => {
            return (
            <Checkbox>블라인드 처리</Checkbox>)
        }
    }];

    const onSearch = () => {

    }


    return (
        <Wrapper>
            <TopBox>
                <FilterWrap>
                    <Filter>
                        <FilterLabel>블라인드 여부</FilterLabel>
                        <Radio.Group defaultValue={"total"}>
                            <Radio.Button value="total" buttonStyle="solid">전체</Radio.Button>
                            <Radio.Button value="N">블라인드 미적용</Radio.Button>
                            <Radio.Button value="Y">블라인드 적용</Radio.Button>
                        </Radio.Group>
                    </Filter>
                    
                    <Filter>
                        <FilterLabel>작성일</FilterLabel>
                        <DatePicker />
                    </Filter>
                    
                </FilterWrap>
                <SearchWrap>
                    <FilterLabel>검색</FilterLabel>
                    <SearchBar placeholder="작성자 또는 상품명을 입력해주세요" onSearch={onSearch} />
                </SearchWrap>
            </TopBox>

            <TableTop>
                <TotalNum>총 {data.length}건</TotalNum>
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

const ReviewDesc = styled.div`
    cursor: pointer;

    div {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; 
        -webkit-box-orient: vertical;
        color: var(--gray-1);

        &:hover {
            color: var(--black);
        }
    }

    .visible {
        display: block;
    }
`

export default ReviewList