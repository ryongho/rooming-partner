import styled from 'styled-components'
import { useRef } from 'react'
import { Button } from 'antd'
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';


const UploadImgs = ({ modiStatus, imgList, loading, onUploadChange, maxLength = 10, onRemoveImgs }) => {

    const fileInputBtn = useRef()

    const onClickFileBtn = (e) => {
        e.preventDefault();
        fileInputBtn.current.click();
    }
    
    return (
        <Wrapper>
            {/* <Upload 
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={onUploadChange}>
                <UpBtnWrap>
                    {fileList.length >= maxLength ? null :
                    <UploadBtn>
                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                        이미지 업로드
                    </UploadBtn>
                    }
                    
                    <UploadLength style={fileList.length == 10 ? {color:'red'} : null}>({fileList.length} / 10)</UploadLength>
                </UpBtnWrap>
            </Upload> 

            <FileListWrap>
            {fileList?.map((item, key) => {
                return (
                    <ImgWrap>
                        <FilListImg src={`https://rooming-img.s3.ap-northeast-2.amazonaws.com/${item.file_name ? item.file_name : item}`} />
                        <DelBtnWrap className={'fileDel'} onClick={onRemoveImgs(item, key)}>
                            <DeleteOutlined />
                        </DelBtnWrap>
                    </ImgWrap>
                )})
            }
            </FileListWrap> */}
            {modiStatus &&
            <>
            <UploadInput type="file" accept="image/*" name="file" ref={fileInputBtn} onChange={onUploadChange} />
            <UpBtnWrap>
                {imgList.length >= maxLength ? null :
                <UploadBtn onClick={onClickFileBtn}>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    이미지 업로드
                </UploadBtn>
                }
                
                <UploadLength style={imgList.length == 10 ? {color:'red'} : null}>({imgList.length} / 10)</UploadLength>
            </UpBtnWrap>
            </>
            }
            <FileListWrap>
            {imgList?.map((item, key) => {
                return (
                    <ImgWrap key={key}>
                        <FilListImg src={`https://rooming-img.s3.ap-northeast-2.amazonaws.com/${item.file_name ? item.file_name : item}`} />
                        {/* <DelBtnWrap className={'fileDel'} onClick={() => onRemoveImgs(key)}>
                            <DeleteOutlinedIco />
                        </DelBtnWrap> */}
                    </ImgWrap>
                )})
            }
            </FileListWrap>
        </Wrapper>
    )
}

const UploadInput = styled.input`
    display: none;
`

const Wrapper = styled.div`
    .ant-upload-list {
        display: none;
    }
`

const UpBtnWrap = styled.div`
    display: flex;
    align-items: center;
`

const UploadBtn = styled(Button)`
    display: flex;
    align-items: center;
    margin-right: 10px;
    margin-bottom: 10px;
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

    &:hover {
        .fileDel {
            opacity: 1;
            transition: all .3s;
        }
    }

    &:last-child {
        clear: both;
    }
`

const FilListImg = styled.img`
    max-width: 100%;
    min-height: 150px;
`

const DelBtnWrap = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px 15px;
    background-color: rgba(10,10,10,.4);
    opacity: 0;
    cursor: pointer;
    transition: all .3s;
    font-size: 20px;
`

const DeleteOutlinedIco = styled(DeleteOutlined)`
    color: #fff;
`

export default UploadImgs