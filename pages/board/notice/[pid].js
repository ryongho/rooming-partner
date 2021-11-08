import styled from 'styled-components'
import { Descriptions, Input, Button, message, Modal, Radio } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import BoardEditor from '../../../components/atom/BoardEditor'


const InputWrap = ({ dataTitle, modiStatus }) => {

    const router = useRouter();
    const [title, setTitle] = useState(dataTitle)

    useEffect(() => {
        setTitle(dataTitle)
    }, [router])

    return(
        <InputValue 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            bordered={modiStatus} />
    )
    
}

const NoticeDetail = () => {
    const data = {
        key: '1',
        title: '자주묻는 질문1',
        createdAt: new Date('2021-09-26'),
        active: 'Y',
        desc: '<p>안녕하세요</p>'
    }

    const router = useRouter();
    const editorRef = useRef()
    
    const [isAdmin, setIsAdmin] = useState(true);
    const [modiStatus, setModiStatus] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [active, setActive] = useState(data.active)

    useEffect(() => {
        setActive(data.active)

        if (router.query.type) setModiStatus(true)
        else setModiStatus(false)
    }, [router])


    const onUploadChange = async(file) => {
        console.log(file);
    }
    
    const onModi = () => {
        if (!router.query.type) router.push('/board/notice/1?type=modi');
        else {
            let content = editorRef.current.getContentHTML()
            if (!title) {
                return message.warning('제목을 입력해 주세요')
            }
            if (content === '<p><br></p>') {
                return message.warning('내용을 입력해 주세요.')
            }    

            // success
        }
    }

    const onDeleteLists = () => {

        // success
        router.push('/goods/list');
    }


    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>공지사항 글 상세</Title>} bordered column={1} extra={
                    <>
                        <Button type="danger" onClick={() => setShowDelete(true)} style={{marginRight: '8px'}}>삭제</Button>
                        <Button onClick={() => router.push('/board/notice/list')}>목록으로 돌아가기</Button>
                    </>
                }>
                    <Descriptions.Item label="제목">
                        <InputWrap modiStatus={modiStatus} dataTitle={data.title} />
                    </Descriptions.Item>
                    <Descriptions.Item label="내용">
                    {!modiStatus ?
                        <TextDefault dangerouslySetInnerHTML={{__html: data.desc}} />
                        :
                        <BoardEditor 
                            ref={editorRef}
                            onAddImage={onUploadChange}
                            defaultValue={data.desc} />}
                    </Descriptions.Item>
                    <Descriptions.Item label="글 공개 상태">
                    {modiStatus ?
                        <Radio.Group defaultValue={data.active} onChange={(e) => setActive(e)}>
                            <Radio.Button value="Y" buttonStyle="solid">활성화</Radio.Button>
                            <Radio.Button value="N">비활성화</Radio.Button>
                        </Radio.Group>
                    : <TextDefault>{active == "Y" ? "활성화" : "비활성화"}</TextDefault>
                    }
                    </Descriptions.Item>
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onModi}>{modiStatus ? '수정완료' : '수정'}</Button>
                    {modiStatus ?
                    <Button onClick={() => router.replace('/board/notice/1', undefined, {shallow: true}).then(() => window.scrollTo(0,0))}>취소</Button>
                    : <Button onClick={() => router.push('/board/notice/list')}>목록</Button>
                    }
                </ButtonWrap>
            </Detail>

            <Modal
            visible={showDelete}
            okText={'네'}
            cancelText={'아니오'}
            onOk={onDeleteLists}
            onCancel={() => setShowDelete(false)}
            >
                정말 삭제하시겠습니까?
            </Modal>
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

const TextDefault = styled.div`
    padding-left: 10px;
`

export default NoticeDetail