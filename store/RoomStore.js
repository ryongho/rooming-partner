import { action, observable, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { 
    postRoomRegist
} from '../libs/room'

enableStaticRendering(typeof window === 'undefined')

export default class RoomStore {
    constructor() {
        makeObservable(this, {
            roomRegist: action,
            roomIdx: observable
        })
    }

    roomIdx = ''
    roomRegist = async() => {
        try {
            const result = await postRoomRegist(data, token)
            if (result.status === 200) {
                callback(true, result.data)
                roomIdx = result.data
            }

        } catch (err) {
            callback(false, null)
        }
    }
}