import styled from 'styled-components'
import { useState } from 'react'
import { Upload, message, Button } from 'antd'
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';


const UploadImgs = ({ fileList, loading, onUploadChange, maxLength = 10, onRemoveImgs }) => {

    const [file, setFile] = useState()

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('JPG 및 PNG 파일만 업로드 가능합니다.');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('이미지 사이즈는 2MB보다 작아야 합니다.');
        }
        setFile(file)
        return isJpgOrPng && isLt2M;
    }

    
    return (
        <Wrapper>
            <Upload 
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
            </FileListWrap>
        </Wrapper>
    )
}

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
    width: 250px;
    height: 150px;
    border: 1px solid #eee;
    margin-right: 12px;
    margin-bottom: 8px;
    text-align: center;

    &:hover {
        .fileDel {
            opacity: 1;
            transition: all .3s;
        }
    }
`

const FilListImg = styled.img`
    max-width: 248px;
    height: 100%;
`

const DelBtnWrap = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    cursor: pointer;
    transition: all .3s;
    font-size: 20px;
`


export default UploadImgs