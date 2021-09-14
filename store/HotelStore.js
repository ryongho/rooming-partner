import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { 
    postHotelRegist,
    getHotelList
} from '../libs/hotel'

enableStaticRendering(typeof window === 'undefined')

export default class HotelStore {
    constructor() {
        makeObservable(this, {
            addInfo: action,
            callList: action,
            list: observable
        })
    }

    addInfo = async (data, token, callback) => {
        try {
            const result = await postHotelRegist(data, token)
            if (result.status === 200) {
                callback(true, result.data)
            }
        } catch (err) {
            callback(false)
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