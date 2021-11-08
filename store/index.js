import GoodsStore from './GoodsStore'
import UserStore from './UserStore'
import HotelStore from './HotelStore'
import RoomStore from './RoomStore'
import ReservationStore from './ReservationStore'

class RootStore {
    constructor() {
        this.goods = new GoodsStore(this)
        this.user = new UserStore(this)
        this.hotel = new HotelStore(this)
        this.room = new RoomStore(this)
        this.reservation = new ReservationStore(this)
    }
}

export default RootStore