import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { 
    postHotelRegist,
    getHotelList,
    postImagesUpload,
    getHotelListByPartners
} from '../libs/hotel'

enableStaticRendering(typeof window === 'undefined')

export default class HotelStore {
    constructor() {
        makeObservable(this, {
            addInfo: action,
            callList: action,
            list: observable,
            imagesUpload: action,
            callListPartner: action,
            partnerList: observable
        })
    }

    addInfo = async (data, token, callback) => {
        try {
            const result = await postHotelRegist(data, token)
            if (result.status === 200) {
                callback(true, result)
            }
        } catch (err) {
            callback(false)
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
            callback(false, err)
            console.log(err)
        }
    }


    list = []
    // row = 10
    // start_no = 0
    callList = async (row, start_no, token) => {
        const params = {
            row: row,
            start_no: start_no
        }

        try {
            const result = await getHotelList(params, token)
            if (result.status === 200) {
                this.list = result.data
            }
        } catch (error) {
            console.log(error)
        }
    }

    partnerList = []
    callListPartner = async (token) => {
        try {
            const result = await getHotelListByPartners(token)
            if (result.status === 200) {
                this.partnerList = result.data
            }
        } catch (err) {
            console.log(err)
        }
    }
}