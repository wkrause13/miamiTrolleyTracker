import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import nock from 'nock'

import {
  MainMapReducer,
  actions,
  types
} from './MainMap'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

const trolleyMock = require('../../../tests/data/vehicles.json');
const loadedState = require('../../../tests/data/loadedState.json')

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
    expect(types.INCREMENT_RENDER_KEY).to.eql('INCREMENT_RENDER_KEY')
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
      state = MainMapReducer(state, {type: types.INCREMENT_RENDER_KEY})
      expect(state.reRenderKey).to.eql(1)
      state = MainMapReducer(state, {type: '@@@@@@@'})
      const refernceState = {...initialState, reRenderKey: 1}
      expect(state).to.eql(refernceState)
    })
  })

  describe('(Action Creator) incrementRenderKey', () => {
    it('Should be exported as a function.', () => {
      expect(actions.incrementRenderKey).to.be.a('function')
    })

    it('Should return an action with type "INCREMENT_RENDER_KEY".', () => {
      expect(actions.incrementRenderKey()).to.have.property('type', types.INCREMENT_RENDER_KEY)
    })
  })

  describe('(Action Creator) toggleRoute', () => {
    it('Should be exported as a function.', () => {
      expect(actions.toggleRoute).to.be.a('function')
    })

    it('Should return an action with type "TOGGLE_ROUTE and property RoutedID".', () => {
      expect(actions.toggleRoute(2)).to.have.property('type', types.TOGGLE_ROUTE)
      expect(actions.toggleRoute(2)).to.have.property('routeId', 2)
    })
  })

  describe('(Action Creator) fetchTrolleys', () => {

    let _globalState
    let _dispatchSpy
    let _getStateSpy

    beforeEach((done) => {
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
      done();
    })

    afterEach((done) => {
      nock.cleanAll()
      done();
    })

    it('Should be exported as a function.', () => {
      expect(actions.fetchTrolleys).to.be.a('function')
    })

    it('Should return a function (is a thunk).', () => {
      expect(actions.fetchTrolleys()).to.be.a('function')
    })

    it('Should return a promise from that thunk that gets fulfilled.', () => {
      nock('https://miami-transit-api.herokuapp.com/api/trolley/')
        .get('/vehicles.json')
        .reply(200, trolleyMock)

      return actions.fetchTrolleys()(_dispatchSpy, _getStateSpy).should.eventually.be.fulfilled
    })

    it('Should call dispatch exactly once.', () => {
      nock('https://miami-transit-api.herokuapp.com/api/trolley/')
        .get('/vehicles.json')
        .reply(200, trolleyMock)

      return actions.fetchTrolleys()(_dispatchSpy)
        .then(() => {
          _dispatchSpy.should.have.been.calledOnce
        })
    })

    it('Creates RECEIVE_TROLLEYS when fetching todos has been done', () => {
      nock('https://miami-transit-api.herokuapp.com/api/trolley/')
        .get('/vehicles.json')
        .reply(200, trolleyMock)

      const expectedActions = [
        { type: types.RECEIVE_TROLLEYS, trolleys: trolleyMock.get_vehicles }
      ]
      const store = mockStore(initialState)

      return store.dispatch(actions.fetchTrolleys())
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
        { type: types.RECEIVE_TROLLEYS, trolleys: {error: {
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

      return store.dispatch(actions.fetchTrolleys())
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions)
        })
    })
  
  })

  describe('(Action Handler) RECEIVE_TROLLEYS', () => {
    it('Should add to state.markers, removing any undefined objects', () => {
      let state = MainMapReducer(undefined, initialState)
      expect(state.markers).to.be.empty
      state = MainMapReducer(state, actions.receiveTrolleys(trolleyMock.get_vehicles))
      expect(state.markers).to.have.length.above(0)
      expect(state.markers).to.not.include(undefined)

    })
    it('Should toggle the initialTrolleyFetch property', () => {
      let state = MainMapReducer(undefined, initialState)
      expect(state.initialTrolleyFetch).to.be.true
      state = MainMapReducer(state, actions.receiveTrolleys(trolleyMock.get_vehicles))
      expect(state.initialTrolleyFetch).to.be.false
    })
    it('Should increment trolleyFetchFails when receiving object with error attribute', () => {
      let state = MainMapReducer(undefined, initialState)
      expect(state.trolleyFetchFails).to.equal(0)
      state = MainMapReducer(state, actions.receiveTrolleys({error: 'error received'}))
      expect(state.trolleyFetchFails).to.equal(1)
    })
    it('Should update the state\'s error attribute after failing 6 times', () => {
      let state = MainMapReducer(undefined, initialState)
      expect(state.trolleyFetchFails).to.equal(0)
      for(let i = 0; i <= 6; i++) {
        state = MainMapReducer(state, actions.receiveTrolleys({error: 'error received'}))        
      }
      expect(state.trolleyFetchFails).to.equal(6)
      expect(state.error).to.not.be.null
    })
    it('Should reset error attribute to null when successfully updated', () => {
      const newState = {...initialState, error: 'some error message'}
      let state = MainMapReducer(newState, {})
      expect(state.error).to.not.be.null
      state = MainMapReducer(state, actions.receiveTrolleys(trolleyMock.get_vehicles))
      expect(state.error).to.be.null
    })
  })

  describe('(Action Handler) INCREMENT_RENDER_KEY', () => {
    it('Should increment the state by 1', () => {
      let state = MainMapReducer(undefined, {})
      expect(state.reRenderKey).to.equal(0)
      state = MainMapReducer(state, actions.incrementRenderKey())
      expect(state.reRenderKey).to.equal(1)
    })
  })

  describe('(Action Handler) TOGGLE_ROUTE', () => {
    it('Should toggle selected routes display value', () => {
      let state = MainMapReducer(loadedState, {})
      expect(state.routesById[5].display).to.be.false
      const newRoutesById= {...state.routesById, 5: {...state.routesById[5], display: true }}
      state = MainMapReducer(state, actions.toggleRoute(5))
      expect(state.routesById[5].display).to.be.true
      // Nothing else should change
      expect(state.routesById).to.eql(newRoutesById)
    })
    it('Should increment reRenderKey by 1', () => {
      let state = MainMapReducer(loadedState, {})
      const initialRenderKey = state.reRenderKey
      state = MainMapReducer(state, actions.toggleRoute(5))
      expect(state.reRenderKey).to.be.equal(initialRenderKey + 1)
    })
    it('Should toggle marker display value', () => {
      let state = MainMapReducer(loadedState, {})
      const postUpdateMarkers = state.markers.map((marker) => {
         if (marker.routeId == 5) {
           return {...marker, display: !marker.display}
        } else{
          return marker
        }
      })
      state = MainMapReducer(state, actions.toggleRoute(5))
      expect(state.markers).to.be.eql(postUpdateMarkers)
    })
  })
})
