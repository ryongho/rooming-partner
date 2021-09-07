import styled from 'styled-components'
import { Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';


const UploadImgs = ({ fileList, loading, onUploadChange }) => {

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

    const previewUpload = (file) => {

    }
    
    return (
        <Upload 
        listType="picture-card"
        fileList={fileList}
        showUploadList={false}
        action="http://localhost:3000/"
        beforeUpload={beforeUpload}
        onPreview={previewUpload}
        onChange={onUploadChange}>
            {fileList.length >= 10 ? null :
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <UploadBtn>이미지 업로드</UploadBtn>
            </div>
            }
        </Upload>
    )
}

const UploadBtn = styled.div`
    margin-top: 8px;
`

export default UploadImgs