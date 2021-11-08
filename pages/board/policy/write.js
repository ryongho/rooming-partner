import styled from 'styled-components'
import { Descriptions, Input, Button, message, Radio } from 'antd'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import BoardEditor from '../../../components/atom/BoardEditor'


const PolicyWrite = () => {
    
    const router = useRouter();
    const editorRef = useRef()
    
    const [isAdmin, setIsAdmin] = useState(true);
    const [title, setTitle] = useState('')
    const [active, setActive] = useState('')

    const onUploadChange = async(file) => {
        console.log(file);
    }
    
    const onWrite = () => {
        let content = editorRef.current.getContentHTML()
        if (!title) {
            return message.warning('제목을 입력해 주세요')
        }
        if (content === '<p><br></p>') {
            return message.warning('내용을 입력해 주세요.')
        }    

        // success
        const data = {
            content: content,
            title: title,
            active: active
        }
    }


    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>공지사항 글 상세</Title>} bordered column={1} extra={<Button onClick={() => router.push('/board/policy/list')}>목록으로 돌아가기</Button>}>
                    <Descriptions.Item label="제목">
                        <InputValue 
                        value={title} 
                        onChange={e => setTitle(e.target.value)}
                        placeholder='제목을 입력해 주세요' />
                    </Descriptions.Item>
                    <Descriptions.Item label="내용">
                        <BoardEditor 
                            ref={editorRef}
                            onAddImage={onUploadChange} />
                    </Descriptions.Item>
                    <Descriptions.Item label="공지사항 상태">
                        <Radio.Group defaultValue={'Y'} onChange={(e) => setActive(e)}>
                            <Radio.Button value="Y" buttonStyle="solid">활성화</Radio.Button>
                            <Radio.Button value="N">비활성화</Radio.Button>
                        </Radio.Group>
                    </Descriptions.Item>
                </Descriptions>

                <Empty />

                <ButtonWrap>
                    <Button type="primary" onClick={onWrite}>등록하기</Button>
                    <Button onClick={() => router.push('/board/policy/list')}>목록</Button>
                </ButtonWrap>
            </Detail>

        </Wrapper>
    )
}


const Wrapper = styled.div`
    width: 100%;
    max-width: 1100px;
`

const Detail = styled.div`
    padding: 18px;
    margin-bottom: 80px;
    background-color: #fff;
`

const Title = styled.div`
    color: #666;
    font-size: 15px;
`

const InputValue = styled(Input)`
    width: 400px;
`

const ButtonWrap = styled.div`
    display: flex;
    justify-content: center;
    padding: 25px 0 10px;

    button:first-child {
        margin-right: 10px;
    }
`

const Empty = styled.div`
    padding-top: 30px;
`

export default PolicyWrite