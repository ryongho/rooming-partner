import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import {
    postUserLogin,
    putRegistPartner,
    getUserInfo
} from '../libs/user'

enableStaticRendering(typeof window === 'undefined')

export default class UserStore {
    constructor () {
        makeObservable(this, {
            token: observable,
            name: observable,
            email: observable,
            auth: observable,
            userid: observable,
            hotelid: observable,
            login: action,
            logout: action,
            join: action,
            callInfo: action,
        })
    }

    token = typeof window == 'object' ? localStorage.getItem('rmatoken') ? localStorage.getItem('rmatoken') : null : null
    name = typeof window == 'object' ? localStorage.getItem('rmaname') ? localStorage.getItem('rmaname') : null : null
    email = typeof window == 'object' ? localStorage.getItem('rmaemail') ? localStorage.getItem('rmaemail') : null : null
    auth = typeof window == 'object' ? localStorage.getItem('rmaauth') ? localStorage.getItem('rmaauth') : null : null
    userid = typeof window == 'object' ? localStorage.getItem('rmaid') ? localStorage.getItem('rmaid') : null : null

    login = async (data, callback) => {
        try {
            const result = await postUserLogin(data)
            if (result.status === 200) {
                this.token = result.data.token
                await localStorage.setItem('rmatoken', result.data.token)
                callback(true, result.data)
            }
        } catch (error) {
            // console.log('err', error);
            callback(false)
        }
    }
    
    hotelid = null
    callInfo = async (token) => {
        try {
            const result = await getUserInfo(token)
            if (result.status === 200) {
                this.name = result.data.data.name
                this.email = result.data.data.email
                this.auth = result.data.data.user_type
                this.userid = result.data.data.user_id
                this.hotelid = result.data.hotel_id
                await localStorage.setItem('rmaname', result.data.data.name)
                await localStorage.setItem('rmaemail', result.data.data.email)
                await localStorage.setItem('rmaauth', result.data.data.user_type)
                await localStorage.setItem('rmaid', result.data.data.user_id)
                
                // console.log(result.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    logout = async () => {
        await localStorage.clear()
        this.token = null
        this.name = null
        this.email = null
        this.auth = null
    }

    join = async (data, callback) => {
        try {
            const result = await putRegistPartner(data)
            if (result.status === 200) {
                console.log(result)
                callback(true, result.data)
            }
        } catch (error) {
            callback(false)
        }
    }

}