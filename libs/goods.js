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
        baseURL: baseUrl[env].baseUrl,
        data: formData,
        headers: {
            'Authorization': 'Bearer '+token,
            'Content-Type': 'multipart/form-data'
        }
    })
}


export function getGoodsListByPartners(token) {
    return axios({
        method: 'get',
        url: '/goods/list_by_partner',
        baseURL: baseUrl[env].baseUrl,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}

export function getGoodsDetail(params, token) {
    return axios({
        method: 'get',
        url: '/goods/detail',
        baseURL: baseUrl[env].baseUrl,
        params: params,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}

export function putGoodsUpdate(params, token) {
    return axios({
        method: 'put',
        url: '/goods/update',
        baseURL: baseUrl[env].baseUrl,
        params: params,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}

export function putGoodsImageUpdate(params, token) {
    return axios({
        method: 'put',
        url: '/goods/image_update',
        baseURL: baseUrl[env].baseUrl,
        params: params,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}

export function delGoodsImageDelete(params, token) {
    return axios({
        method: 'delete',
        url: '/goods/image_delete',
        baseURL: baseUrl[env].baseUrl,
        params: params,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}

export function delGoods(params, token) {
    return axios({
        method: 'delete',
        url: '/goods/delete',
        baseURL: baseUrl[env].baseUrl,
        params: params,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}

export function getGoodsListByHotel(params, token) {
    return axios({
        method: 'get',
        url: '/goods/list_by_hotel',
        baseURL: baseUrl[env].baseUrl,
        params: params,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}


export function getGoodsQuantityList(params) {
    return axios({
        method: 'get',
        url: 'goods/get_qty_list',
        baseURL: baseUrl[env].baseUrl,
        params: params
    })
}

export function putQuantityUpdate(params, token) {
    return axios({
        method: 'put',
        url: 'quantity/update',
        baseURL: baseUrl[env].baseUrl,
        params: params,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
}

export function putQuantityListUpdate(list, token) {
    return axios.all(list.map((params)=>putQuantityUpdate(params, token))
  ).then((data)=>{
    console.log('data', data);
    return data
  })
}