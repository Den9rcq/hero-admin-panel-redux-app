import { configureStore } from "@reduxjs/toolkit";
import heroes from '../reducers/heroes';
import filters from "../reducers/filters";

const stringMiddleware = () => (next) => (action) => {
    typeof action === 'string'
        ? next({ type: action })
        : next(action)
}

// const store = createStore(
//     combineReducers({ heroes, filters }),
//     compose(
//         applyMiddleware(ReduxThunk, stringMiddleware),
//         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//     )
// );

const store = configureStore({
    reducer: { heroes, filters },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== 'production'
})

export default store;