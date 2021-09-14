import axios from 'axios'
import baseUrl from './base.json'

const env = process.env.API_ENV || 'development';

export function postGoodsRegist(data, token) {
    return axios({
        method: 'post',
        url: '/goods/regist',
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
    formData.append('type', 'goods');

    return axios({
        method: 'post',
        url: '/image/upload',
        baseUrl: baseUrl[env].baseUrl,
        data: formData,
        headers: {
            'Authorization': 'Bearer '+token,
            'Content-Type': 'multipart/form-data'
        }
    })
}