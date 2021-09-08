import styled from 'styled-components'
import { useState } from 'react'
import { Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';


const UploadImgs = ({ fileList, loading, onUploadChange, maxLength = 10 }) => {

    const [previewImage, setPreviewImage] = useState('')

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

    const previewUpload = async(file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
          }
          setPreviewImage(file.url || file.preview)
    }
    
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }
    
    return (
        <>
            <Upload 
            listType="picture-card"
            fileList={fileList}
            action="http://localhost:3000/"
            beforeUpload={beforeUpload}
            onPreview={previewUpload}
            onChange={onUploadChange}
            onRemove={(file) => setPreviewImage('')}>
                {fileList.length >= maxLength ? null :
                <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <UploadBtn>이미지 업로드</UploadBtn>
                </div>
                }
            </Upload> 
            <img style={{ width: '100%' }} src={previewImage} />
        </>
    )
}

const UploadBtn = styled.div`
    margin-top: 8px;
`

export default UploadImgs