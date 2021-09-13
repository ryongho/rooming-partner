import GoodsStore from './GoodsStore'
import AdminStore from './AdminStore'

class RootStore {
    constructor() {
        this.goods = new GoodsStore(this)
        this.admin = new AdminStore(this)
    }
}

export default RootStore