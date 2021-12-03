import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { 
    getReservationList,
    getReservationDetail
} from '../libs/reservation'

enableStaticRendering(typeof window === 'undefined')

export default class ReservationStore {
    constructor () {
        makeObservable(this, {
            callList: action,
            list: observable,
            callDetail: action,
        })
    }

    list = [];
    callList = async(token) => {
        let now = new Date();
        let start_date = new Date(now.setFullYear(now.getFullYear() - 1));
        let end_date = new Date(now.setFullYear(now.getFullYear() + 1));

        const params = {
            row: '10',
            start_no: '0',
            start_date: '2021-01-01',
            end_date: '2021-12-31'
        }

        try {
            const result = await getReservationList(params, token)
            
            if (result.status === 200) {
                this.list = result.data
            }
        } catch (err) {
            
            console.log(err.response)
        }
    }

    callDetail = async (params, token, callback) => {
        try {
            const result = await getReservationDetail(params, token)
            if (result.status === 200) {
                callback(true, result.data)
            }
        } catch (err) {
            callback(false, null)
            console.log(err)
        }
    }

}