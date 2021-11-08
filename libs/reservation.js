import axios from 'axios'
import baseUrl from './base.json'

const env = process.env.API_ENV || 'development';

export function getReservationList(params, token) {
    return axios({
        method: 'get',
        url: '/reservation/list',
        baseURL: baseUrl[env].baseUrl,
        params: params,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}

export function getReservationDetail(params, token) {
    return axios({
        method: 'get',
        url: '/reservation/detail',
        baseURL: baseUrl[env].baseUrl,
        params: params,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}