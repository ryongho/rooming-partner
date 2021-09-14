import styled from 'styled-components'
import { useState } from 'react'
import { Upload, message, Button } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';


const UploadImgs = ({ fileList, loading, onUploadChange, maxLength = 10, previewImage, onRemoveImgs }) => {

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('JPG 및 PNG 파일만 업로드 가능합니다.');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('이미지 사이즈는 2MB보다 작아야 합니다.');
        }
        return isJpgOrPng && isLt2M;
    }

    
    return (
        <>
            <Upload 
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={onUploadChange}
            onRemove={onRemoveImgs}>
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
            {previewImage &&
                <img style={{ width: '150px' }} src={previewImage} />
            }
        </>
    )
}

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


export default UploadImgs