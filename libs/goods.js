import axios from 'axios'
import baseUrl from './base.json'

const env = process.env.API_ENV || 'development';

export function postSquareThumbnailImageUpload(file, token) {
    let formData = new FormData()
    formData.append('image', file);
    console.log(formData)

    return axios({
        method: 'post',
        url: '/goods/thumbnail/image-upload',
        baseUrl: baseUrl[env].baseUrl,
        data: formData,
        headers: {
            'Authorization': 'Bearer '+token,
            'Content-Type': 'multipart/form-data'
        }
    })
}