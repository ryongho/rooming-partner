import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { 
    getReservationListByHotel,
    getReservationDetail,
    putReservationConfirm,
    putReservationCancelByPartner
} from '../libs/reservation'

enableStaticRendering(typeof window === 'undefined')

export default class ReservationStore {
    constructor () {
        makeObservable(this, {
            callList: action,
            list: observable,
            callDetail: action,
            confirmReservation: action,
            cancelReservation: action
        })
    }

    list = [];
    callList = async(token) => {
        let now = new Date();
        let start_date = new Date(now.setFullYear(now.getFullYear() - 1));
        let end_date = new Date(now.setFullYear(now.getFullYear() + 2));

        const params = {
            start_date: start_date,
            end_date: end_date
        }


        try {
            const result = await getReservationListByHotel(params, token)
            if (result.status === 200) {
                this.list = result.data
            }
        } catch (err) {
            console.log('what ',err)
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
    
    confirmReservation = async (params, token, callback) => {
        try {
            const result = await putReservationConfirm(params, token)
            console.log('result', result);

            if (result.status === 200) {
                callback(true, result.data)
            }
        } catch (err) {
            callback(false, null)
            console.log(err)
        }
    }

    cancelReservation = async (params, token, callback) => {
        try {
            const result = await putReservationCancelByPartner(params, token)
            console.log('result', result);
            if (result.status === 200) {
                callback(true, result.data)
            }
        } catch (err) {
            callback(false, null)
            console.log(err)
        }
    }
}