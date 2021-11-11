import styled from 'styled-components'
import { useRef } from 'react'
import { Button } from 'antd'
import { LoadingOutlined, PlusOutlined, DeleteOutlined, ScissorOutlined } from '@ant-design/icons';


const UploadImgs = ({ modiStatus, imgList, fileList, loading, onUploadChange, onRemoveImgs }) => {

    const fileInputBtn = useRef([])

    
    return (
        <Wrapper>
            {modiStatus &&
                <ModiWrap>
                {fileList?.map((item, idx) => {
                    return (
                        <UploadBox key={idx + 1}>
                            <UploadInput type="file" accept="image/*" name="file" ref={el => fileInputBtn.current[idx + 1] = el} onChange={(e) => onUploadChange(e, idx + 1)} />
                            {item.file_name ?
                                <ModiImgBox>
                                    <ModiListImg src={`https://rooming-img.s3.ap-northeast-2.amazonaws.com/${item.file_name}`} />
                                    <HoverBtnWrap className={'fileEdit'}>
                                        <EditBtnWrap onClick={() => fileInputBtn.current[idx + 1].click()}>
                                            <ScissorOutlinedIco />
                                        </EditBtnWrap>
                                        <DelBtnWrap onClick={() => onRemoveImgs(idx + 1)}>
                                            <DeleteOutlinedIco />
                                        </DelBtnWrap>
                                    </HoverBtnWrap>
                                </ModiImgBox>
                                :
                                <UploadBtn onClick={() => fileInputBtn.current[idx + 1].click()}>
                                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                    이미지 업로드
                                </UploadBtn>
                            }
                        </UploadBox>
                    )
                })}
                </ModiWrap>
            }

            {!modiStatus &&
                <FileListWrap>
                {imgList?.map((item, key) => {
                    return (
                        <ImgWrap key={key}>
                            <FileListImg src={`https://rooming-img.s3.ap-northeast-2.amazonaws.com/${item.file_name}`} />
                        </ImgWrap>
                    )})
                }
                </FileListWrap>
            }
            <UploadLength style={imgList?.length == 10 ? {color:'red'} : null}>({imgList?.length} / 10)</UploadLength>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
`

const ModiWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
`

const UploadBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 100px;
    border: 1px solid #eee;
    margin: 5px;
    overflow: hidden;
`

const UploadInput = styled.input`
    display: none;
`

const ModiImgBox = styled.div`
    position: relative;

    &:hover {
        .fileEdit {
            opacity: 1;
            transition: all .3s;
        }
    }
`

const ModiListImg = styled.img`
    max-width: 100%;
`

const HoverBtnWrap = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: all .3s;
`

const DelBtnWrap = styled.div`
    padding: 8px 10px;
    background-color: rgba(10,10,10,.3);
    cursor: pointer;
    font-size: 18px;
    border-radius: 3px;

    &:hover {
        background-color: rgba(10,10,10,.6);
    }
`

const DeleteOutlinedIco = styled(DeleteOutlined)`
    color: #fff;
`
const ScissorOutlinedIco = styled(ScissorOutlined)`
    color: #fff;
`

const EditBtnWrap = styled.div`
    padding: 8px 10px;
    margin-right: 5px;
    background-color: rgba(10,10,10,.3);
    cursor: pointer;
    font-size: 18px;
    border-radius: 3px;

    &:hover {
        background-color: rgba(10,10,10,.6);
    }
`

const UploadBtn = styled(Button)`
`

const UploadLength = styled.div`
    font-size: 12px;
    color: #999
`

const FileListWrap = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
`

const ImgWrap = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 150px;
    float: left;
    margin-right: 12px;
    margin-bottom: 8px;
    overflow: hidden;

    &:last-child {
        clear: both;
    }
`

const FileListImg = styled.img`
    max-width: 100%;
    min-height: 150px;
`

export default UploadImgs