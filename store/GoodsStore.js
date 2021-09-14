import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { 
    postImagesUpload,
    postGoodsRegist
} from '../libs/goods'

enableStaticRendering(typeof window === 'undefined')

export default class GoodsStore {

    constructor() {
        makeObservable(this, {
            addInfo: action,
            imagesUpload: action
        })
    }

    addInfo = async(data, token, callback) => {
        try {
            const result = await postGoodsRegist(data, token)
            if (result.status === 200) {
                callback(true, result.data)
            }

        } catch (err) {
            callback(false, null)
        }
    }

    imagesUpload = async (file, token, callback) => {
        try {
            const result = await postImagesUpload(file, token)
            if (result.status === 200) {
                callback(true, result.data)
            }
        } catch (err) {
            // authFail(err)
            callback(false, null)
        }
    }

}