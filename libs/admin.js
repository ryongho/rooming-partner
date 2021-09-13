import axios from 'axios'
import baseUrl from './base.json'

const env = process.env.API_ENV || 'development';


export function postAdminLogin(data) {
    return axios({
        method: 'post',
        url: '/login',
        baseURL: baseUrl[env].baseUrl,
        data: data
    })
}