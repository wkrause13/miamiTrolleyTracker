import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import nock from 'nock'

import {
  INCREMENT_RENDER_KEY,
  RECEIVE_TROLLEYS,
  incrementRenderKey,
  fetchTrolleys,
  MainMapReducer
} from './MainMap'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

const trolleyMock = require('../../../tests/data/vehicles.json');

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

  describe('(Action Creator) incrementRenderKey', () => {
    it('Should be exported as a function.', () => {
      expect(incrementRenderKey).to.be.a('function')
    })

    it('Should return an action with type "INCREMENT_RENDER_KEY".', () => {
      expect(incrementRenderKey()).to.have.property('type', INCREMENT_RENDER_KEY)
    })
  })

  describe('(Action Creator) fetchTrolleys', () => {

    let _globalState
    let _dispatchSpy
    let _getStateSpy

    beforeEach(() => {
      _globalState = {
        mainMap: MainMapReducer(undefined, {})
      }
      _dispatchSpy = sinon.spy((action) => {
        _globalState = {
          ..._globalState,
          mainMap: MainMapReducer(_globalState.mainMap, action)
        }
      })
      _getStateSpy = sinon.spy(() => {
        return _globalState
      })
    })

    afterEach(() => {
      nock.cleanAll()
    })

    it('Should be exported as a function.', () => {
      expect(fetchTrolleys).to.be.a('function')
    })

    it('Should return a function (is a thunk).', () => {
      expect(fetchTrolleys()).to.be.a('function')
    })

    it('Should return a promise from that thunk that gets fulfilled.', () => {
      return fetchTrolleys()(_dispatchSpy, _getStateSpy).should.eventually.be.fulfilled
    })

    it('Should call dispatch exactly once.', () => {
      return fetchTrolleys()(_dispatchSpy)
        .then(() => {
          _dispatchSpy.should.have.been.calledOnce
        })
    })

    it('creates RECEIVE_TROLLEYS when fetching todos has been done', () => {
      nock('https://miami-transit-api.herokuapp.com/api/trolley/')
        .get('/vehicles.json')
        .reply(200, trolleyMock)

      const expectedActions = [
        { type: RECEIVE_TROLLEYS, trolleys: trolleyMock.get_vehicles }
      ]
      const store = mockStore(initialState)

      return store.dispatch(fetchTrolleys())
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions)
        })
    })

    it('returns {error} when bad request ', () => {
      nock('https://miami-transit-api.herokuapp.com/api/trolley/')
        .get('/vehicles.json')
        .replyWithError('something awful happened');
      const error = new Error('something awful happened')
      const expectedActions = [
        { type: RECEIVE_TROLLEYS, trolleys: {error: {
            "code": undefined,
            "errno": undefined,
            "message": "request to https://miami-transit-api.herokuapp.com/api/trolley/vehicles.json failed, reason: something awful happened",
            "name": "FetchError",
            "type": "system",
          }
        } 
      }
      ]
      const store = mockStore(initialState)

      return store.dispatch(fetchTrolleys())
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions)
        })
    })
  
  })

  describe('(Action Handler) INCREMENT_RENDER_KEY', () => {
    it('Should increment the state by 1', () => {
      let state = MainMapReducer(undefined, {})
      expect(state.reRenderKey).to.eql(0)
      state = MainMapReducer(state, incrementRenderKey())
      expect(state.reRenderKey).to.equal(1)
    })
  })
})
// // Test example with mocha and expect
// it('should dispatch action', () => {
//   const incrementRenderKey = { type: 'INCREMENT_RENDER_KEY' }
//   const store = mockStore(initialState)
//   store.dispatch(incrementRenderKey)

//   const actions = store.getActions()
//   expect(actions).to.eql([incrementRenderKey])

// });




// describe('(Redux Module) MainMap', () => {
//   it('Should export a constant DEFAULT_ACTION.', () => {
//     expect(DEFAULT_ACTION).to.equal('DEFAULT_ACTION')
//   })
// })