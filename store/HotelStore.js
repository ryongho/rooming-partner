import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { 
    postHotelRegist,
    getHotelList,
    postImagesUpload
} from '../libs/hotel'

enableStaticRendering(typeof window === 'undefined')

export default class HotelStore {
    constructor() {
        makeObservable(this, {
            addInfo: action,
            callList: action,
            list: observable,
            imagesUpload: action,
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
                callback(true, result)
            }
        } catch (err) {
            // authFail(err)
            callback(false, err)
            console.log(err)
        }
    }


    list = []
    row = 10
    id = 5
    callList = async (row, id, token) => {
        const params = {
            row: row,
            id: id
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
}