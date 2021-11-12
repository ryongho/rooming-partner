import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { 
    getHotelDetail,
    postHotelRegist,
    getHotelList,
    postImagesUpload,
    getHotelListByPartners,
    putHotelUpdate,
    putHotelImageUpdate,
    delHotelImageDelete
} from '../libs/hotel'

enableStaticRendering(typeof window === 'undefined')

export default class HotelStore {
    constructor() {
        makeObservable(this, {
            callInfo: action,
            addInfo: action,
            callList: action,
            list: observable,
            imagesUpload: action,
            callListPartner: action,
            partnerList: observable,
            info: observable,
            imagesUpdate: action,
            updateInfo: action,
            imagesDel: action
        })
    }

    info = null
    callInfo = async (params, token) => {
        try {
            const result = await getHotelDetail(params, token)
            if (result.status === 200) {
                this.info = result.data
            }
        } catch (err) {
            console.log(false)
        }
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

    imagesUpdate = async (hotelid, idx, file, token, callback) => {
        try {
            const params = {
                hotel_id: hotelid,
                order_no: idx,
                file_name: file
            }
            const result = await putHotelImageUpdate(params, token)
            if (result.status === 200) {
                callback(true, result.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    imagesDel = async (hotelid, idx, token) => {
        try {
            const params = {
                hotel_id: hotelid,
                order_no: idx
            }
            const result = await delHotelImageDelete(params, token)
            if (result.status === 200) {
                console.log(result)
            }
        } catch (err) {
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

    updateInfo = async (params, token, callback) => {
        try {
            const result = await putHotelUpdate(params, token)
            if (result.status === 200) {
                callback(true, result)
            }
        } catch (err) {
            callback(false, err)
            console.log(err)
        }
    }

    
}