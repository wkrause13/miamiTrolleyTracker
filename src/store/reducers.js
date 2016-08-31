import { combineReducers } from 'redux'
import {MainMapReducer as mainMap} from '../routes/MainMap/modules/MainMap'
import {PreferencesReducer as preferences} from '../routes/Preferences/modules/Preferences'

export const makeRootReducer = () => {
  return combineReducers({
    mainMap,
    preferences
  })
}

export default makeRootReducer
