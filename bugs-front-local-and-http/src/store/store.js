import { legacy_createStore as createStore, combineReducers } from 'redux'


import { bugReducer } from './reducers/bug.reducers'
import { userReducer } from './reducers/user.reducers'
import { msgReducer } from './reducers/msg.reducers'
import { systemReducer } from './reducers/system.reducers'


const rootReducer = combineReducers({
    bugModule: bugReducer,
    userModule: userReducer,
    systemModule: systemReducer,
    msgModule: msgReducer,
})




const middleware = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : undefined
export const store = createStore(rootReducer, middleware)


// For debug:
// store.subscribe(() => {
//     console.log('**** Store state changed: ****')
//     console.log('storeState:\n', store.getState())
//     console.log('*******************************')
// })
