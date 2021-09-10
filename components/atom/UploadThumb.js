import styled from 'styled-components'
import { useState } from 'react'
import { Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';


const UploadThumb = ({ thumb, onUploadThumb, thumbLoading }) => {
    
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
        <Upload
        listType="picture-card"
        showUploadList={false}
        action="http://localhost:3000/"
        beforeUpload={beforeUpload}
        onChange={onUploadThumb}>
            {
                thumb ? <img src={thumb} style={{ width: '100%' }} /> 
                : 
                <div>
                    {thumbLoading ? <LoadingOutlined /> : <PlusOutlined />}
                    <UploadBtn>썸네일 업로드</UploadBtn>
                </div>
            }
        </Upload>
    )
}

const UploadBtn = styled.div`
    margin-top: 8px;
`

export default UploadThumb