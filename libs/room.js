import axios from 'axios'
import baseUrl from './base.json'

const env = process.env.API_ENV || 'development';


export function postRoomRegist(data, token) {
    return axios({
        method: 'post',
        url: '/room/regist',
        baseURL: baseUrl[env].baseUrl,
        data: data,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}


export function postImagesUpload(file, token) {
    let formData = new FormData()
    formData.append('img_01', file);
    formData.append('type', 'room');

    return axios({
        method: 'post',
        url: '/image/upload',
        baseURL: baseUrl[env].baseUrl,
        data: formData,
        headers: {
            'Authorization': 'Bearer '+token,
            'Content-Type': 'multipart/form-data'
        }
    })
}

export function getRoomListByHotel(params, token) {
    return axios({
        method: 'get',
        url: '/room/list_by_hotel',
        baseURL: baseUrl[env].baseUrl,
        params: params,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}


export function getRoomListByPartners(token) {
    return axios({
        method: 'get',
        url: '/room/list_by_partner',
        baseURL: baseUrl[env].baseUrl,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}