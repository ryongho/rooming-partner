import axios from 'axios'
import baseUrl from './base.json'

const env = process.env.API_ENV || 'development';

export function getReservationList(params, token) {
    return axios({
        method: 'get',
        url: '/reservation/list?start_no=0&row=10&start_date=2021-01-01&end_date=2021-12-31',
        // baseURL: baseUrl[env].baseUrl,
        baseURL: 'https://rooming.link/api',
        // params: params,
        headers: {
            'Authorization': 'Bearer '+'21|s5ScUWoQAMNnhmZnl2enMPmnekqTJlLBczzUMXZV'
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