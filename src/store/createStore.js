import { createStore, applyMiddleware, compose } from 'redux'
// import Reactotron from 'reactotron'
import thunk from 'redux-thunk'
import makeRootReducer from './reducers'

// a function which can create our store and auto-persist the data
export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []

  // ======================================================
  // Store Instantiation
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  return store
}
