import { createContext, useContext } from 'react'
import RootStore from './index'

let store
export const StoreContext = createContext()

export function useStore() {
    const context = useContext(StoreContext)
    if (context === undefined) {
        throw new Error('useStore must be used within StoreProvider')
    }
    return context
}

export function StoreProvider({ children }) {
    const store = initializeStore()

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

function initializeStore() {
    const _store = store ?? new RootStore()

    if (typeof window === 'undefined') return _store
    if (!store) store = _store

    return _store
}