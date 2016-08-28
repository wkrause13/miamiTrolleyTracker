import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  INCREMENT_RENDER_KEY,
  incrementRenderKey,
  MainMapReducer
} from './MainMap'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

const initialState = {
  isLoading: false,
  error: null,
  routesById: {},
  routeIds: [],
  initialTrolleyFetch: true,
  reRenderKey: 0,
  markers: [],
  trolleyFetchFails : 0,
  stopIsLoading: false,
  stopsObject: {},
  routeOrder: [],
  selectedRouteId: 0,
  stopFetchError: false,
  region: {},
  bikesIsLoading: false,
  bikeLocations: [],
  showBikes: false,
  visibleBikes: []
}

describe('(Redux Module) MainMap', () => {
  it('Should export a constant INCREMENT_RENDER_KEY.', () => {
    expect(INCREMENT_RENDER_KEY).to.eql('INCREMENT_RENDER_KEY')
  })
  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(MainMapReducer).to.be.a('function')
    })
    it('Should initialize with a the correct initial state', () => {
      expect(MainMapReducer(undefined, {})).to.eql(initialState)
    })
    it('Should return the previous state if an action was not matched.', () => {
      let state = MainMapReducer(undefined, {})
      expect(state).to.eql(initialState)
      state = MainMapReducer(state, {type: '@@@@@@@'})
      expect(state).to.eql(initialState)
      state = MainMapReducer(state, {type: INCREMENT_RENDER_KEY})
      expect(state.reRenderKey).to.eql(1)
      state = MainMapReducer(state, {type: '@@@@@@@'})
      const refernceState = {...initialState, reRenderKey: 1}
      expect(state).to.eql(refernceState)
    })
  })
})
// Test example with mocha and expect
it('should dispatch action', () => {
  const incrementRenderKey = { type: 'INCREMENT_RENDER_KEY' }
  const store = mockStore(initialState)
  store.dispatch(incrementRenderKey)

  const actions = store.getActions()
  expect(actions).to.eql([incrementRenderKey])

});




// describe('(Redux Module) MainMap', () => {
//   it('Should export a constant DEFAULT_ACTION.', () => {
//     expect(DEFAULT_ACTION).to.equal('DEFAULT_ACTION')
//   })
// })