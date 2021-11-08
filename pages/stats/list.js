import styled from 'styled-components'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import moment from 'moment'
import { Space, Select, Table, Tag, DatePicker, Radio, Button, Input } from 'antd'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const StatsList = () => {

    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(true);

    const { RangePicker } = DatePicker;

    const data = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: 'Page D',
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: 'Page E',
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: 'Page F',
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: 'Page G',
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
      ];

    return (
        <Wrapper>      
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <Bar dataKey="uv" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <TopBox>
                <FilterWrap>
                    <Filter>
                        <FilterLabel>날짜 선택</FilterLabel>
                        <RangePicker placeholder={['시작일', '마지막일']} />
                    </Filter>
                </FilterWrap>
            </TopBox>

            <TableTop>
                <TotalNum>예약 총 {data.length}건</TotalNum>
                <TotalNum>회원가입자 총 {data.length}명</TotalNum>
            </TableTop>
            
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


export default StatsList