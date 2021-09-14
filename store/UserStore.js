import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import {
    postUserLogin,
    putRegistPartner
} from '../libs/user'

enableStaticRendering(typeof window === 'undefined')

export default class UserStore {
    constructor () {
        makeObservable(this, {
            token: observable,
            name: observable,
            email: observable,
            auth: observable,
            login: action,
            logout: action,
            join: action,
        })
    }

    token = typeof window == 'object' ? localStorage.getItem('rmatoken') ? localStorage.getItem('rmatoken') : null : null
    name = typeof window == 'object' ? localStorage.getItem('rmaname') ? localStorage.getItem('rmaname') : null : null
    email = typeof window == 'object' ? localStorage.getItem('rmaemail') ? localStorage.getItem('rmaemail') : null : null
    auth = typeof window == 'object' ? localStorage.getItem('rmaauth') ? localStorage.getItem('rmaauth') : null : null

    login = async (data, callback) => {
        try {
            const result = await postUserLogin(data)
            if (result.status === 200) {
                this.token = result.data.token
                // this.name = result.data.userInfo.name
                // this.email = result.data.userInfo.email
                // this.auth = result.data.userInfo.auth
                await localStorage.setItem('rmatoken', result.data.token)
                // await localStorage.setItem('rmaname', result.data.userInfo.name)
                // await localStorage.setItem('rmaemail', result.data.userInfo.email)
                // await localStorage.setItem('rmaauth', result.data.userInfo.auth)
                callback(true, result.data)
            }
        } catch (error) {
            // console.log('err', error);
            callback(false)
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