import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { 
    postImagesUpload,
    postGoodsRegist,
    getGoodsListByPartners,
    getGoodsDetail
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
            info: observable
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

    
    partnerList = []
    callListPartner = async (params, token) => {
        try {
            const result = await getGoodsListByPartners(params, token)
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
            console.log(err)
        }
    }
}