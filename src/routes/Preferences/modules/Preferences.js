import {AsyncStorage} from 'react-native'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_LANGUAGE = 'SET_LANGUAGE'

// ------------------------------------
// Actions
// ------------------------------------


export function setLanguage (language) {
  writeLanguage(language)
  async function writeLanguage(language) {
      try {
        await AsyncStorage.setItem('language', language);
      } catch (error) {
        console.log(error)
    }
  }
  return {
    type: SET_LANGUAGE,
    language
  }
}

// export function setLanguage (language) {
//   return {
//     type: SET_LANGUAGE,
//     language
//   }
// }

export const actions = {
  setLanguage
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const setLanguageHandler = (state, action) => {
  return {...state, language: action.language}
}

const ACTION_HANDLERS = {
  [SET_LANGUAGE]: setLanguageHandler
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  language: 'en'
}
export function PreferencesReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
