import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { 
    postRoomRegist,
    postImagesUpload,
    getRoomListByHotel,
    getRoomListByPartners
} from '../libs/room'

enableStaticRendering(typeof window === 'undefined')

export default class RoomStore {
    constructor() {
        makeObservable(this, {
            addInfo: action,
            imagesUpload: action,
            callRoomList: action,
            rooms: observable,
            callListPartner: action,
            partnerList: observable
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

    rooms = null
    callRoomList = async(params, token) => {
        try {
            const result = await getRoomListByHotel(params, token)
            if (result.status === 200) {
                this.rooms = result.data.data
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
}