import { createStore } from 'redux'
import rootReducer from '../reducers/rootReducer'
import combinedReducer from '../reducers/userReducer'
const store = createStore(combinedReducer);
// const store = createStore(rootReducer);
// console.log(rootStore.getState());
export default store;