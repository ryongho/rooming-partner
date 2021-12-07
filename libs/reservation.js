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

export function getReservationListByHotel(params, token) {
    return axios({
        method: 'get',
        url: '/reservation/list_by_hotel',
        baseURL: baseUrl[env].baseUrl,
        params: params,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token,
            'withCredentials': 'true'
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

export function putReservationCancelByPartner(params, token) {
    return axios({
        method: 'put',
        url: '/reservation/cancel_by_partner',
        baseURL: baseUrl[env].baseUrl,
        params: params,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}

export function putReservationConfirm(params, token) {
    return axios({
        method: 'put',
        url: '/reservation/confirm',
        baseURL: baseUrl[env].baseUrl,
        params: params,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}