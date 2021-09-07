import styled from "styled-components"
import { Descriptions, Radio, Input, Button, message, Upload, Space } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const GoodsWrite = () => {

    const router = useRouter();
    
    const [goods, setGoods] = useState()
    const [rooms, setRooms] = useState()
    const [price, setPrice] = useState()
    const [salePrice, setSalePrice] = useState()
    const [rate, setRate] = useState()
    const [desc, setDesc] = useState()
    const [thumb, setThumb] = useState()
    const [imgList, setImgList] = useState([])
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState()


    const onWrite = () => {
        if (!goods) {
            message.warning('상품명을 입력해 주세요')
        }
        if (!price) {
            message.warning('상품 원가를 입력해 주세요')
        }
        if (!salePrice) {
            message.warning('할인가를 입력해 주세요')
        }
        if (!rate) {
            message.warning('할인율을 입력해 주세요')
        }
        if (!desc) {
            message.warning('상품 정보를 입력해 주세요')
        }
        if (!thumb) {
            message.warning('상품 썸네일을 입력해 주세요')
        }
        if (imgList.length < 1) {
            message.warning('상품 사진을 입력해 주세요')
        }

        // success
    }


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
    
    const onUploadThumb = (e) => {
        if (e.file.status === 'done') {
        const reader = new FileReader();
        reader.addEventListener('load', () => (setThumb(reader.result)));
        reader.readAsDataURL(e.file.originFileObj);
        }
    }

    const onUploadChange = (e) => {
        console.log(e.file.status);
        if (e.file.status === 'uploading') {
            return setLoading(true);
        }
        if (e.file.status === 'done') {
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgList(reader.result));
            reader.readAsDataURL(e.file.originFileObj);
            
            setLoading(false);
        }
        
    }

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>숙소 정보 입력</Title>} bordered column={1} extra={<Button onClick={() => router.push('/goods/list')}>목록으로 돌아가기</Button>}>
                    <Descriptions.Item label="상품명">
                        <InputValue
                        value={goods} 
                        onChange={e => setGoods(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="객실 선택">
                        <RoomsWrap>
                            <Radio.Group defaultValue={"standard twin"} onChange={(e) => setRooms(e)}>
                                <Radio.Button value="standard twin" buttonStyle="solid">스탠다드 트윈</Radio.Button>
                                <Radio.Button value="standard double">스탠다드 더블</Radio.Button>
                                <Radio.Button value="suite junior">스위트 주니어</Radio.Button>
                            </Radio.Group>
                            <Button type="primary" size="small" onClick={() => router.push('/rooms/1?type="modi"')} style={{fontSize: '12px'}}>객실 추가 및 삭제</Button>
                        </RoomsWrap>
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 원가">
                        <InputValue
                        value={price} 
                        onChange={e => setPrice(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 할인가">
                        <InputValue
                        value={salePrice} 
                        onChange={e => setSalePrice(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 할인율">
                        <InputValue
                        value={rate} 
                        onChange={e => setRate(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 상세 설명">
                        <Input.TextArea
                        value={desc} 
                        rows={4}
                        onChange={(e) => setDesc(e.target.value)} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 사진">
                        <Upload
                        listType="picture-card"
                        showUploadList={false}
                        action="http://localhost:3000/"
                        beforeUpload={beforeUpload}
                        onChange={onUploadThumb}>
                            {thumb ? <img src={thumb} alt="avatar" style={{ width: '100%' }} /> : <UploadBtn>썸네일 업로드</UploadBtn>}
                        </Upload>
                        <Space>
                            <Upload 
                            listType="picture-card"
                            fileList={imgList}
                            showUploadList={false}
                            action="http://localhost:3000/"
                            beforeUpload={beforeUpload}
                            onChange={onUploadChange}>
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                                : imgList.length >= 10 ? null :
                                <div>
                                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                    
                                    <UploadBtn>이미지 업로드</UploadBtn>
                                </div>}
                            </Upload>
                            <UploadLength>({imgList.length} / 10)</UploadLength>
                        </Space>
                    </Descriptions.Item>
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onWrite}>등록하기</Button>
                    <Button onClick={() => router.push('/goods/list')}>목록</Button>
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

const RoomsWrap = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const UploadBtn = styled.div`
    margin-top: 8px;
`

const ButtonWrap = styled.div`
    display: flex;
    justify-content: center;
    padding: 25px 0 10px;

    button:first-child {
        margin-right: 10px;
    }
`

const UploadLength = styled.div`
    font-size: 12px;
    color: #999
`

export default GoodsWrite