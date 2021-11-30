import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { 
    postImagesUpload,
    postGoodsRegist,
    getGoodsListByPartners,
    getGoodsDetail,
    putGoodsUpdate,
    delGoodsImageDelete,
    putGoodsImageUpdate,
    getGoodsListByHotel,
    delGoods
} from '../libs/goods'

enableStaticRendering(typeof window === 'undefined')

export default class GoodsStore {

    constructor() {
        makeObservable(this, {
            addInfo: action,
            imagesUpload: action,
            callListPartner: action,
            partnerList: observable,
            callInfo: action,
            info: observable,
            updateInfo: action,
            imagesUpdate: action,
            imagesDel: action,
            callListByHotel: action,
            list: observable,
            deleteGoods: action
        })
    }

    addInfo = async(data, token, callback) => {
        try {
            const result = await postGoodsRegist(data, token)
            if (result.status === 200) {
                callback(true, result.data)
            }

        } catch (err) {
            callback(false, null)
        }
    }

    imagesUpload = async (file, token, callback) => {
        try {
            const result = await postImagesUpload(file, token)
            if (result.status === 200) {
                callback(true, result.data)
            }
        } catch (err) {
            // authFail(err)
            callback(false, null)
        }
    }

    imagesUpdate = async (goodsid, idx, file, token, callback) => {
        try {
            const params = {
                goods_id: goodsid,
                order_no: idx,
                file_name: file
            }
            const result = await putGoodsImageUpdate(params, token)
            if (result.status === 200) {
                callback(true, result.data)
            }
        } catch (err) {
            console.log(err)
            callback(false, err)
        }
    }

    imagesDel = async (goodsid, idx, token) => {
        try {
            const params = {
                goods_id: goodsid,
                order_no: idx
            }
            const result = await delGoodsImageDelete(params, token)
            if (result.status === 200) {
                console.log(result)
            }
        } catch (err) {
            console.log(err)
        }
    }

    list = []
    callListByHotel = async (params, token) => {
        try {
            const result = await getGoodsListByHotel(params, token)
            if (result.status === 200) {
                this.list = result.data
            }
        } catch (err) {
            console.log(err)
        }
    }
    
    partnerList = []
    callListPartner = async (token) => {
        try {
            const result = await getGoodsListByPartners(token)
            if (result.status === 200) {
                this.partnerList = result.data
            }
        } catch (err) {
            console.log(err)
        }
    }

    info = null
    callInfo = async (params, token) => {
        try {
            const result = await getGoodsDetail(params, token)
            if (result.status === 200) {
                this.info = result.data
            }
        } catch (err) {
            console.log('callInfo err ? ',err)
        }
    }

    updateInfo = async (params, token, callback) => {
        try {
            const result = await putGoodsUpdate(params, token)
            if (result.status === 200) {
                callback(true, result)
            }
        } catch (err) {
            callback(false, err)
            console.log(err)
        }
    }
    
    deleteGoods = async (params, token, callback) => {
        try {
            const result = await delGoods(params, token)
            if (result.status === 200) {
                callback(true, result)
            }
        } catch (err) {
            callback(false, err)
            console.log(err)
        }
    }
}