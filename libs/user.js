import axios from 'axios'
import baseUrl from './base.json'

const env = process.env.API_ENV || 'development';


export function postUserLogin(data) {
    return axios({
        method: 'post',
        url: '/login',
        baseURL: baseUrl[env].baseUrl,
        data: data
    })
}

export function putRegistPartner(data) {
    return axios({
        method: 'put',
        url: '/regist',
        baseURL: baseUrl[env].baseUrl,
        data: data
    })

}

export function getUserInfo(token) {
    return axios({
        method: 'get',
        url: '/user/info',
        baseURL: baseUrl[env].baseUrl,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}

export function postUserCheckEmail(params) {
    return axios({
        method: 'post',
        url: '/check_email',
        baseURL: baseUrl[env].baseUrl,
        params: params
    })
}
export function postUserCheckNick(params) {
    return axios({
        method: 'post',
        url: '/check_nickname',
        baseURL: baseUrl[env].baseUrl,
        params: params
    })
}

export function putUpdateMemberInfo(params, token) {
    return axios({
        method: 'put',
        url: '/user/update_info',
        baseURL: baseUrl[env].baseUrl,
        params: params,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}