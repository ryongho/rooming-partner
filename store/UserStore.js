import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import {
    postUserLogin,
    putRegistPartner,
    getUserInfo,
    postUserCheckEmail,
    postUserCheckNick,
    putUpdateMemberInfo
} from '../libs/user'

enableStaticRendering(typeof window === 'undefined')

export default class UserStore {
    constructor () {
        makeObservable(this, {
            token: observable,
            name: observable,
            email: observable,
            auth: observable,
            nickname: observable,
            hotelid: observable,
            login: action,
            logout: action,
            join: action,
            callInfo: action,
            checkEmailDuplicate: action,
            checkNickDuplicate: action,
            info: observable,
            updateInfo: action
        })
    }

    token = typeof window == 'object' ? localStorage.getItem('rmatoken') ? localStorage.getItem('rmatoken') : null : null
    name = typeof window == 'object' ? localStorage.getItem('rmaname') ? localStorage.getItem('rmaname') : null : null
    email = typeof window == 'object' ? localStorage.getItem('rmaemail') ? localStorage.getItem('rmaemail') : null : null
    auth = typeof window == 'object' ? localStorage.getItem('rmaauth') ? localStorage.getItem('rmaauth') : null : null
    nickname = typeof window == 'object' ? localStorage.getItem('rmanick') ? localStorage.getItem('rmanick') : null : null
    hotelid = typeof window == 'object' ? localStorage.getItem('rmahotelid') ? localStorage.getItem('rmahotelid') : null : null

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
    
    info = null
    callInfo = async (token) => {
        try {
            const result = await getUserInfo(token)
            if (result.status === 200) {
                // console.log(result.data)
                this.info = result.data
                this.name = result.data.data.name
                this.email = result.data.data.email
                this.auth = result.data.data.user_type
                this.nickname = result.data.data.nickname
                this.hotelid = result.data.hotel_id
                await localStorage.setItem('rmaname', result.data.data.name)
                await localStorage.setItem('rmaemail', result.data.data.email)
                await localStorage.setItem('rmaauth', result.data.data.user_type)
                await localStorage.setItem('rmanick', result.data.data.nickname)
                await localStorage.setItem('rmahotelid', result.data.hotel_id)
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
        this.nickname = null
        this.hotelid = null
    }

    join = async (data, callback) => {
        try {
            const result = await putRegistPartner(data)
            if (result.status === 200) {
                // console.log(result)
                callback(true, result.data)
            }
        } catch (error) {
            callback(false)
        }
    }


  checkEmailDuplicate = async (params, callback) => {
    try {
        const result = await postUserCheckEmail(params)
        if (result.status === 200) {
            callback(true, result.data)
        }
    } catch (err) {
        callback(false, null)
    }
  }

  checkNickDuplicate = async (params, callback) => {
    try {
        const result = await postUserCheckNick(params)
        if (result.status === 200) {
            callback(true, result.data)
        }
    } catch (err) {
        callback(false, null)
    }
  }

  updateInfo = async (params, token, callback) => {
      try {
          const result = await putUpdateMemberInfo(params, token);
          if (result.status === 200) {
              callback(true, result.data)
          }
      } catch (err) {
          callback(false, err)
          console.log(err)
      }
  }
}