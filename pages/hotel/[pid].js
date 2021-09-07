import styled from 'styled-components'
import { Descriptions, Input, Button, message, Image, Modal, Upload, Select, Checkbox, Radio } from 'antd'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import DaumPostcode from 'react-daum-postcode';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import UploadImgs from '../../components/atom/UploadImgs'

const HotelDetail = () => {
    const data = {
        key: '1',
        category: '호텔',
        hotel: '라마다 프라자 바이 윈덤 여수 호텔',
        facility: ['주차가능', '무료 wifi'],
        zonecode: '1234',
        address: '주소',
        address2: '',
        tel: '0212341234',
        imgList: [{
            uid: "-1",
            name: "image.png",
            status: "done",
            url:
              "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          },
          {
            uid: "-2",
            name: "image.png",
            status: "done",
            url:
              "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          }],
        breakfast: '제공되는 조식 없음',
        parking: '300대 주차 가능',
        cancel: '예약 당일 취소 가능',
        partner: '파트너1234',
        goods: [{
            idx: 0,
            name: '여름날 치맥 파티',
        }, {
            idx: 1,
            name: '겨울날 군고구마 파티'
        }]
    }

    const router = useRouter();
    const options = ['주차가능', '레스토랑', '수영장', '스파', '피트니스', '무료 wifi']

    const [isAdmin, setIsAdmin] = useState(true);
    const [modiStatus, setModiStatus] = useState(false)

    const [category, setCategory] = useState(data.category)
    const [hotel, setHotel] = useState(data.hotel)
    const [facility, setFacility] = useState(data.facility)
    const [address, setAddress] = useState(data.address)
    const [address2, setAddress2] = useState(data.address2)
    const [zonecode, setZonecode] = useState(data.zonecode)
    const [tel, setTel] = useState(data.tel)
    const [loading, setLoading] = useState(false)
    const [imgList, setImgList] = useState(data.imgList)
    const [breakfast, setBreakfast] = useState(data.breakfast)
    const [parking, setParking] = useState(data.parking)
    const [cancel, setCancel] = useState(data.cancel)
    const [showAddress, setShowAddress] = useState(false)

    useEffect(() => {
        console.log(router.query.type)
        if (router.query.type) setModiStatus(true)
        else setModiStatus(false)
    }, [router])

    const onDataChange = (e, val) => {
        const numRegExp = /^[0-9]*$/
        if (!router.query.type) return;
        if (val == 'tel') {
            if (!numRegExp.test(e.target.value)) return
            setTel(e.target.value);
        }
        if (val == 'category') setCategory(e);
        if (val == 'hotel') setHotel(e.target.value);
        if (val == 'facility') setFacility(e);
        if (val == 'zonecode') setZonecode(e.target.value);
        if (val == 'address') setAddress(e.target.value);
        if (val == 'address2') setAddress2(e.target.value);
        if (val == 'breakfast') setBreakfast(e.target.value);
        if (val == 'parking') setParking(e.target.value);
        if (val == 'cancel') setCancel(e.target.value);
    }

    const onUploadChange = async(e) => {
        console.log(e.file);
        // if (e.file.status === 'uploading') {
        //     return setLoading(true);
        // }
        // e.preview = await getBase64(e.originFileObj);
        
        setImgList(e)
        // if (e.file.status === 'done') {
        //     const reader = new FileReader();
        //     reader.addEventListener('load', (result) => {
        //         console.log('result', result)
        //     });
        //     reader.readAsDataURL(e.file.originFileObj);
            
        // }
        
    }
    
    const onModi = () => {
        if (!router.query.type) router.push('/hotel/1?type=modi');
        else {
            if (!hotel) {
                return message.warning('숙소명을 입력해 주세요')
            }
            if (!zonecode || !address) {
                return message.warning('숙소 주소를 입력해 주세요')
            }
            if (!tel) {
                return message.warning('숙소 연락처를 입력해 주세요')
            }
            if (imgList.length < 1) {
                message.warning('숙소 사진을 입력해 주세요')
            }
            if (!cancel) {
                return message.warning('취소 및 환불 규정을 입력해 주세요')
            }

            // success
        }
    }

    return (
        <Wrapper>
            <Detail>
                <Descriptions title={<Title>숙소 상세 정보</Title>} bordered column={1} extra={<Button onClick={() => router.push('/hotel/list')}>목록으로 돌아가기</Button>}>
                    <Descriptions.Item label="숙소 카테고리">
                        <SelectBar defaultValue={"hotel"} onChange={(e) => setCategory(e)}>
                            <Select.Option value={"hotel"}>호텔</Select.Option>
                            <Select.Option value={"resort"}>리조트</Select.Option>
                        </SelectBar>
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소명">
                        <InputValue 
                        value={hotel} 
                        onChange={(e) => onDataChange(e, 'hotel')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 주소">
                        <Input 
                        placeholder={modiStatus ? "우편번호" : null}
                        disabled={modiStatus}
                        bordered={modiStatus}
                        value={zonecode}
                        style={{width:100}} />
                        {modiStatus &&
                            <Button onClick={()=> setShowAddress(true)} style={{marginLeft:5}}>주소검색</Button>
                        }
                        <Input 
                        placeholder={modiStatus ? "기본주소" : null}
                        disabled={modiStatus}
                        bordered={modiStatus}
                        value={address}
                        style={{marginTop:5, marginBottom:5, display:'block'}} />
                        <Input 
                        placeholder={modiStatus ? "상세주소를 입력해주세요" : null}
                        value={address2} 
                        bordered={modiStatus}
                        onChange={(e) => onDataChange(e, 'address2')} />
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 연락처">
                        <InputValue
                        placeholder={"'-'없이 번호만 입력해 주세요"}
                        value={tel} 
                        onChange={(e) => onDataChange(e, 'tel')}
                        bordered={modiStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="숙소 사진">
                        {modiStatus ?
                        <UploadImgs 
                        fileList={imgList}
                        loading={loading}
                        onUploadChange={onUploadChange} />
                        :
                        <ImgWrap>
                            {imgList.map(img => {
                                return (
                                    <img src={img.url} alt="avatar" />
                                )
                            })}
                        </ImgWrap>
                        }
                        <UploadLength>({imgList.length} / 10)</UploadLength>
                    </Descriptions.Item>
                    <Descriptions.Item label="편의시설">
                        <Checkbox.Group options={options} value={facility} onChange={e => onDataChange(e, 'facility')} />
                    </Descriptions.Item>
                    <Descriptions.Item label="조식 정보">
                        <Input.TextArea
                        value={breakfast} 
                        rows={4}
                        onChange={(e) => onDataChange(e, 'breakfast')} />
                    </Descriptions.Item>
                    <Descriptions.Item label="주차 정보">
                        <Input.TextArea
                        value={parking} 
                        rows={4}
                        onChange={(e) => onDataChange(e, 'parking')} />
                    </Descriptions.Item>
                    <Descriptions.Item label="취소 및 환불 규정">
                        <Input.TextArea
                        value={cancel} 
                        rows={4}
                        onChange={(e) => onDataChange(e, 'cancel')} />
                    </Descriptions.Item>

                    <Descriptions.Item label="파트너">
                        <HotelBtn onClick={() => router.push('/user/partner/1')}>{data.partner}</HotelBtn>
                    </Descriptions.Item>
                    <Descriptions.Item label="등록된 상품">
                        {data.goods.map(item => {
                            return (
                                <GoodsWrap>
                                    <GoodsBtn onClick={() => router.push(`/goods/${item.idx}`)}>{item.name}</GoodsBtn>
                                    <Radio.Group defaultValue={"active"} onChange={(e) => onDataChange(e, 'active', item.idx)}>
                                        <Radio.Button value="active" buttonStyle="solid">활성화</Radio.Button>
                                        <Radio.Button value="notActive">비활성화</Radio.Button>
                                    </Radio.Group>
                                </GoodsWrap>
                            )
                        })}
                        <GoodsInfo>※ 비활성화된 상품은 앱에서 비공개 처리 됩니다.</GoodsInfo>
                    </Descriptions.Item>
                </Descriptions>
                <ButtonWrap>
                    <Button type="primary" onClick={onModi}>{modiStatus ? '수정완료' : '수정'}</Button>
                    {modiStatus ?
                    <Button onClick={() => router.replace('/hotel/1', undefined, {shallow: true}).then(() => window.scrollTo(0,0))}>취소</Button>
                    : <Button onClick={() => router.push('/hotel/list')}>목록</Button>
                    }
                </ButtonWrap>
            </Detail>
            <Modal
            visible={showAddress}
            onCancel={() => setShowAddress(false)}
            footer={() => {}}>
                <DaumPostcode onComplete={(e) => {
                    setZonecode(e.zonecode);
                    setAddress(e.address);
                    setShowAddress(false)
                }} />
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

const SelectBar = styled(Select)`
    width: 150px;
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

const GoodsBtn = styled(HotelBtn)`
    margin-right: 10px;
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


export default HotelDetail