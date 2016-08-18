import { combineReducers } from 'redux'
import {MainMapReducer as mainMap} from '../routes/MainMap/modules/MainMap'

export const makeRootReducer = () => {
  return combineReducers({
    mainMap
  })
}

export default makeRootReducer
