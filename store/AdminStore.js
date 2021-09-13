import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import {
    postAdminLogin,
    getAdmin,
    postAdmin,
    putAdmin,
    deleteAdmin,
} from '../libs/admin'

enableStaticRendering(typeof window === 'undefined')

export default class AdminStore {
    constructor () {
        makeObservable(this, {
            token: observable,
            name: observable,
            email: observable,
            auth: observable,
            login: action,
        })
    }

    token = typeof window == 'object' ? localStorage.getItem('rmatoken') ? localStorage.getItem('rmatoken') : null : null
    name = typeof window == 'object' ? localStorage.getItem('rmaname') ? localStorage.getItem('rmaname') : null : null
    email = typeof window == 'object' ? localStorage.getItem('rmaemail') ? localStorage.getItem('rmaemail') : null : null
    auth = typeof window == 'object' ? localStorage.getItem('rmaauth') ? localStorage.getItem('rmaauth') : null : null

    login = async (data, callback) => {
        try {
            const result = await postAdminLogin(data)
            if (result.status === 200) {
                this.token = result.data.token
                this.name = result.data.adminInfo.name
                this.email = result.data.adminInfo.email
                this.auth = result.data.adminInfo.auth
                await localStorage.setItem('rmatoken', result.data.token)
                await localStorage.setItem('rmaname', result.data.adminInfo.name)
                await localStorage.setItem('rmaemail', result.data.adminInfo.email)
                await localStorage.setItem('rmaauth', result.data.adminInfo.auth)
                callback(true, null)
            }
        } catch (error) {
            console.log('err', error);
            callback(false, error)
        }
    }
}