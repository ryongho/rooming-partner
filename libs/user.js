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