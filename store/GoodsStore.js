import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { 
    postSquareThumbnailImageUpload
} from '../libs/goods'

enableStaticRendering(typeof window === 'undefined')

export default class GoodsStore {

    constructor() {
        makeObservable(this, {
            thumbImageUpload: action
        })
    }

    thumbImageUpload = async (file, token, callback) => {
        try {
            const result = await postSquareThumbnailImageUpload(file, token)
            if (result.status === 200) {
                callback(true, result.data)
            }
        } catch (err) {
            // authFail(err)
            callback(false, null)
        }
    }

}