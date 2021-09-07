import styled from 'styled-components'
import { Descriptions, Input, Button, message, Space, Upload, Checkbox, Radio, Modal } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import DaumPostcode from 'react-daum-postcode';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import UploadImgs from '../../components/atom/UploadImgs'

const GoodsDetail = () => {
    const data = {
        key: '1',
        goods: '여름날 치맥 파티',
        active: true,
        rooms: 'standard twin',
        roomDetail: '',
        category: '호텔',
        hotel: '라마다 프라자 바이 윈덤 여수 호텔',
        facility: ['주차가능', '무료 wifi'],
        zonecode: '1234',
        address: '주소',
        address2: '',
        tel: '0212341234',
        thumb: '',
        imgList: [],
        breakfast: '제공되는 조식 없음',
        parking: '300대 주차 가능',
        cancel: '예약 당일 취소 가능',
        partner: '파트너1234',
    }

    const router = useRouter();

    const options = ['주차가능', '레스토랑', '수영장', '스파', '피트니스', '무료 wifi']
    const [isAdmin, setIsAdmin] = useState(true);
    const [modiStatus, setModiStatus] = useState(false)

    const [goods, setGoods] = useState(data.goods)
    const [active, setActive] = useState(data.active)
    const [rooms, setRooms] = useState(data.rooms)
    const [price, setPrice] = useState(data.price)
    const [salePrice, setSalePrice] = useState(data.salePrice)
    const [rate, setRate] = useState(data.rate)
    const [desc, setDesc] = useState(data.desc)
    const [thumb, setThumb] = useState(data.thumb)
    const [imgList, setImgList] = useState(data.imgList)
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState()
    const [showDelete, setShowDelete] = useState(false)

    useEffect(() => {
        console.log(router.query.type)
        if (router.query.type) setModiStatus(true)
        else setModiStatus(false)
    }, [router])

    const onDataChange = (e, val) => {
        if (!router.query.type) return;
        if (val == 'goods') setGoods(e.target.value);
        if (val == 'active') setActive(e);
        if (val == 'rooms') setRooms(e);
        if (val == 'price') setPrice(e.target.value);
        if (val == 'salePrice') setSalePrice(e.target.value);
        if (val == 'rate') setRate(e.target.value);
        if (val == 'desc') setDesc(e.target.value);
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
        if (!router.query.type) return;

        if (e.file.status === 'done') {
        const reader = new FileReader();
        reader.addEventListener('load', () => (setThumb(reader.result)));
        reader.readAsDataURL(e.file.originFileObj);
        }
    }

    const onUploadChange = async(e) => {
        if (!router.query.type) return;
    }
    
    const onModi = () => {
        if (!router.query.type) router.push('/goods/1?type=modi');
        else {
            if (!goods) {
                return message.warning('상품명을 입력해 주세요')
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
    }

    const onDeleteLists = () => {

        // success
        router.push('/goods/list');
    }

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>상품 상세 정보</Title>} bordered column={1} 
                extra={
                    <>
                        <Button type="danger" onClick={() => setShowDelete(true)} style={{marginRight: '8px'}}>삭제</Button>
                        <Button onClick={() => router.push('/goods/list')}>목록으로 돌아가기</Button>
                    </>
                }>
                    <Descriptions.Item label="상품명">
                        <InputValue
                        value={goods} 
                        onChange={(e) => onDataChange(e, 'goods')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 상태값">
                        <GoodsWrap>
                            <Radio.Group defaultValue={data.active ? "active" : "notActive"} onChange={(e) => onDataChange(e, 'active')}>
                                <Radio.Button value="active" buttonStyle="solid">활성화</Radio.Button>
                                <Radio.Button value="notActive">비활성화</Radio.Button>
                            </Radio.Group>
                        </GoodsWrap>
                        <GoodsInfo>※ 비활성화된 상품은 앱에서 비공개 처리 됩니다.</GoodsInfo>
                    </Descriptions.Item>
                    <Descriptions.Item label="객실 선택">
                        <RoomsWrap>
                            <Radio.Group defaultValue={rooms} onChange={(e) => onDataChange(e, 'rooms')}>
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
                        onChange={(e) => onDataChange(e, 'price')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 할인가">
                        <InputValue
                        value={salePrice} 
                        onChange={(e) => onDataChange(e, 'salePrice')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 할인율">
                        <InputValue
                        value={rate} 
                        onChange={(e) => onDataChange(e, 'rate')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 상세 설명">
                        <Input.TextArea
                        value={desc} 
                        rows={4}
                        onChange={(e) => onDataChange(e, 'desc')} />
                    </Descriptions.Item>
                    <Descriptions.Item label="상품 사진">
                        {modiStatus ?
                        <>
                            <Upload
                            listType="picture-card"
                            showUploadList={false}
                            action="http://localhost:3000/"
                            beforeUpload={beforeUpload}
                            onChange={onUploadThumb}>
                                {thumb ? <img src={thumb} alt="avatar" style={{ width: '100%' }} /> : <UploadBtn>썸네일 업로드</UploadBtn>}
                            </Upload>
                            <Space>
                                <UploadImgs 
                                fileList={imgList}
                                loading={loading}
                                onUploadChange={onUploadChange} />
                                <UploadLength>({imgList.length} / 10)</UploadLength>
                            </Space>
                        </>
                            :
                            <ImgWrap>
                                {thumb &&
                                <img src={thumb} alt="avatar" />}
                                {imgList.map(img => {
                                    return (
                                        <img src={img.url} alt="avatar" />
                                    )
                                })}
                            </ImgWrap>
                        }
                    </Descriptions.Item>
                </Descriptions>

                <Empty />

                <Descriptions title={<Title>숙소 상세 정보</Title>} bordered column={1} extra={<Button type="primary" size="small" onClick={() => router.push('/hotel/1?type="modi"')} style={{fontSize: '12px'}}>숙소 정보 수정</Button>}>
                    <Descriptions.Item label="숙소 카테고리">
                        <InputValue value={data.category} />
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소명">
                        <HotelBtn onClick={() => router.push('/hotel/1')}>{data.hotel}</HotelBtn>
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 주소">
                        <Input 
                        disabled={true}
                        bordered={false}
                        value={data.zonecode}
                        style={{width:100}} />
                        <Input 
                        disabled={true}
                        bordered={false}
                        value={data.address}
                        style={{marginTop:5, marginBottom:5, display:'block'}} />
                        <Input 
                        value={data.address2} 
                        bordered={false}
                        onChange={null} />
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 연락처">
                        <InputValue
                        placeholder={"'-'없이 번호만 입력해 주세요"}
                        value={data.tel} 
                        onChange={null}
                        bordered={false} />
                    </Descriptions.Item>
                    <Descriptions.Item label="편의시설">
                        <Checkbox.Group options={options} value={data.facility} onChange={null} />
                    </Descriptions.Item>
                    <Descriptions.Item label="조식 정보">
                        <Input.TextArea
                        value={data.breakfast} 
                        rows={4}
                        onChange={null} />
                    </Descriptions.Item>
                    <Descriptions.Item label="주차 정보">
                        <Input.TextArea
                        value={data.parking} 
                        rows={4}
                        onChange={null} />
                    </Descriptions.Item>
                    <Descriptions.Item label="취소 및 환불 규정">
                        <Input.TextArea
                        value={data.cancel} 
                        rows={4}
                        onChange={null} />
                    </Descriptions.Item>

                    <Descriptions.Item label="파트너">
                        <HotelBtn onClick={() => router.push('/user/partner/1')}>{data.partner}</HotelBtn>
                    </Descriptions.Item>
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onModi}>{modiStatus ? '수정완료' : '수정'}</Button>
                    {modiStatus ?
                    <Button onClick={() => router.replace('/goods/1', undefined, {shallow: true}).then(() => window.scrollTo(0,0))}>취소</Button>
                    : <Button onClick={() => router.push('/goods/list')}>목록</Button>
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
    padding-left: 5px;
    color: #666;
    font-size: 15px;
`

const RoomsWrap = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const InputValue = styled(Input)`
    width: 400px;
`

const ImgWrap = styled.div`
    img {
        width: 100px;
        margin-right: 8px;
    }
`

const UploadBtn = styled.div`
    margin-top: 8px;
`

const UploadLength = styled.div`
    font-size: 12px;
    color: #999
`

const HotelBtn = styled.div`
    display: inline-block;
    color: #666;
    border-bottom: 1px solid #666;
    cursor: pointer;

    &:hover {
        color: blue;
        border-color: blue;
    }
`
const GoodsWrap = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 6px;
`

const GoodsInfo = styled.div`
    margin-top: 22px;
    font-size: 12px;    
    color: #666;
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

export default GoodsDetail