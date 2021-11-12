import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { 
    postRoomRegist,
    postImagesUpload,
    getRoomListByHotel,
    getRoomListByPartners,
    getRoomDetail,
    putRoomImageUpdate,
    delRoomImageDelete,
    putRoomUpdate
} from '../libs/room'

enableStaticRendering(typeof window === 'undefined')

export default class RoomStore {
    constructor() {
        makeObservable(this, {
            addInfo: action,
            imagesUpload: action,
            callRoomList: action,
            list: observable,
            callListPartner: action,
            partnerList: observable,
            imagesUpdate: action,
            imagesDel: action,
            info: observable,
            callInfo: action,
            updateInfo: action
        })
    }

    addInfo = async(data, token, callback) => {
        try {
            const result = await postRoomRegist(data, token)
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
            callback(false, err)
            console.log(err)
        }
    }

    imagesUpdate = async (id, idx, file, token, callback) => {
        try {
            const params = {
                room_id: id,
                order_no: idx,
                file_name: file
            }
            const result = await putRoomImageUpdate(params, token)
            if (result.status === 200) {
                callback(true, result.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    imagesDel = async (roomid, key, token) => {
        try {
            const params = {
                room_id: roomid,
                order_no: key
            }
            const result = await delRoomImageDelete(params, token)
            if (result.status === 200) {
                console.log(result)
            }
        } catch (err) {
            console.log(err)
        }
    }

    list = []
    callRoomList = async(params, token) => {
        try {
            const result = await getRoomListByHotel(params, token)
            if (result.status === 200) {
                this.list = result.data.data
                // callback(true, result)
            }
        } catch (err) {
            // callback(false, err)
        }
    }

    
    partnerList = []
    callListPartner = async (token) => {
        try {
            const result = await getRoomListByPartners(token)
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
            const result = await getRoomDetail(params, token)
            if (result.status === 200) {
                this.info = result.data
            }
        } catch (err) {
            console.log(err)
        }
    }

    info = null
    updateInfo = async (params, token, callback) => {
        try {
            const result = await putRoomUpdate(params, token)
            if (result.status === 200) {
                callback(true, result.data)
            }
        } catch (err) {
            console.log(err)
            callback(false, err)
        }
    }
}