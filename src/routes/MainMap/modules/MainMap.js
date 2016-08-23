import _ from 'lodash'
import {routeObjects} from '../../../utils'

// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_ROUTES = 'REQUEST_ROUTES'
const RECEIVE_ROUTES = 'RECEIVE_ROUTES'

const RECEIVE_TROLLEYS = 'RECEIVE_TROLLEYS'

const TOGGLE_ROUTE = 'TOGGLE_ROUTE'

const REQUEST_ENABLE_ALL_ROUTES = 'REQUEST_ENABLE_ALL_ROUTES'
const ENABLE_ALL_ROUTES = 'ENABLE_ALL_ROUTES'

const INCREMENT_RENDER_KEY = 'INCREMENT_RENDER_KEY'

// ------------------------------------
// Actions
// ------------------------------------

function requestRoutes () {
  return {
    type: REQUEST_ROUTES
  }
}

function receiveRoutes (routeOverlays, stops, routes) {
  return {
    type: RECEIVE_ROUTES,
    routeOverlays,
    stops,
    routes
  }
}

export function fetchRoutes () {
  const urls = ['https://raw.githubusercontent.com/qtrandev/OneBusAway/master/GTFS/Miami/shapes.txt','https://miami-transit-api.herokuapp.com/api/trolley/stops.json', 'https://miami-transit-api.herokuapp.com/api/trolley/routes.json', 'https://miami-transit-api.herokuapp.com/api/trolley/vehicles.json' ]
  return dispatch => {
    dispatch(requestRoutes())
    const promises = urls.map((url, i) => {
        if (i === 0) {
          return fetch(url).then((response) => response.text())
        } else{
          return fetch(url).then((response) => response.json())
        }
      })
    Promise.all(promises).then(results => {
      const routeOverlays = processShapeData(results[0])
      const stops = results[1]['get_stops']
      // both of the following maps will make it easier to support user defaults when app loads
      const routes = results[2]['get_routes'].map((route) => {
        return {...route, display: route.id == 2}
      })
      const trolleys = results[3].get_vehicles.map((trolley) => {
        return {...trolley, display: (trolley.routeID == 2)}
      })
      dispatch(receiveTrolleys(trolleys))
      return dispatch(receiveRoutes(routeOverlays, stops, routes))
    })
    .catch((error) => {
      return dispatch(receiveRoutes({error}))
    })
  }
}

export function receiveTrolleys (trolleys) {
  return {
    type: RECEIVE_TROLLEYS,
    trolleys
  }
}

export function toggleRoute (routeId) {
  return {
    type: TOGGLE_ROUTE,
    routeId
  }
}


export function requestEnableAllRoutes () {
  return {
    type: REQUEST_ENABLE_ALL_ROUTES
  }
}

export function allRoutes () {
  return {
    type: ENABLE_ALL_ROUTES
  }
}

export function enableAllRoutes() {
  return dispatch => {
    dispatch(requestEnableAllRoutes())
    setTimeout(() => dispatch(allRoutes()), 100)
    
  }
}

export function incrementRenderKey () {
  return {
    type: INCREMENT_RENDER_KEY
  }
}

export function fetchTrolleys() {
  return dispatch => {
    fetch('https://miami-transit-api.herokuapp.com/api/trolley/vehicles.json')
      .then((response) => response.json())
      .then((responseJson) => {
        const trolleys = responseJson.get_vehicles
        return dispatch(receiveTrolleys(trolleys))
    })
    .catch((error) => {
      return dispatch(receiveTrolley({error}))
    })
  }
}


export const actions = {
  fetchRoutes,
  toggleRoute,
  enableAllRoutes,
  incrementRenderKey
}

// ------------------------------------
// Selectors
// ------------------------------------
export const getAllRoutes = (state) => {
  if (state.mainMap.routeIds){
    const routeArray = state.mainMap.routeIds.map((id) => {
      return state.mainMap.routesById[id]
    })
    return _.sortBy(routeArray, 'name')
  }
  return []
}

export const getAllRoutesForDrawer = (state) => {
  if (state.mainMap.routeIds){
    const routeArray = state.mainMap.routeIds.map((rid) => {
      const {routeColor, display, id, name} = state.mainMap.routesById[rid]
      return {
        routeColor,
        display,
        id,
        name
      }
    })
    return _.sortBy(routeArray, 'name')
  }
  return []
}


// ------------------------------------
// Action Handlers
// ------------------------------------

const receiveRoutesHandler = (state, action) => {
  if (action.routeOverlays.error) {
    return {...state, error: 'Had trouble getting data :-(', isLoading: false}
  }
  if (action.stops.length < 1 || action.routes.length < 1) {
    return {...state, isLoading: false}
  }
  let stopsByRoute = {}
  action.stops.forEach((stop) => {
    if (!(stop.rid in stopsByRoute)) {
      stopsByRoute[stop.rid] = []
    }
    stopsByRoute[stop.rid].push(stop)
  })

  let routesById = {}
  const routeIds = action.routes.map((route, i) => {
    const newRoute = {...route, ...action.routeOverlays[route['id']], stops:stopsByRoute[route.id] }
    routesById[route['id']] = newRoute
    return route['id'] 
  })
  return { ...state, isLoading: false, routes: action.payload, routeIds, routesById, error: null, reRenderKey: state.reRenderKey + 1 }
}

const receiveTrolleysHandler = (state, action) => {
  if (action.trolleys.error && state.trolleyFetchFails < 6) {
    return {...state, trolleyFetchFails: state.trolleyFetchFails + 1}
  }
  if (state.trolleyFetchFails >= 6){
    return {...state, error: 'Having trouble updating trolley data'}
  }
  const markers = action.trolleys.map((trolley) => {

    // not going to plot buses with bad or unknown route information
    if (!(trolley.routeID in routeObjects)) {
      return undefined
    }
    let shouldDisplay = false
    if (!(trolley.routeID in state.routesById)) {
      shouldDisplay = false
    } else {
      shouldDisplay = state.routesById[trolley.routeID].display
    }
    return {
      coordinate: {
        latitude: trolley.lat,
        longitude: trolley.lng
      },
      // trolley.display allows us to eventually support user defualt preferences
      display: shouldDisplay,
      routeId: trolley.routeID,
      title: `Vehicle ID: ${trolley.equipmentID}`,
      description: `Route: ${trolley.routeID}, ${trolley.inService ? 'In Service' : 'Out of Service'}`
    }
  })
  validMarkers = markers.filter(function( element ) {
    return element !== undefined;
  });
  return {...state, markers: validMarkers, trolleyFetchFails: 0, error: null}
}

const toggleRouteHandler = (state, action) => {
  const targetRoute = state.routesById[action.routeId]
  const newMarkers = state.markers.map((marker) => {
    if (marker.routeId == action.routeId) {
      return {...marker, display: !targetRoute.display}
    }
    return marker
  })
  return {...state,
      routesById: {
        ...state.routesById,
        [action.routeId]: {
          ...targetRoute,
          display: !targetRoute.display
        } 
      },
      reRenderKey: state.reRenderKey + 1,
      markers: newMarkers
  }
}

const requestEnableAllRoutesHandler = (state, action) => {
  return {...state, isLoading: true}
}

const enableAllRoutesHandler = (state, action) => {
  let newRoutesById = {}
  state.routeIds.map((routeId) => {
    const newRoute = {...state.routesById[routeId], display: true}
    newRoutesById[routeId] = newRoute
  })
  const newMarkers = state.markers.map((marker) => {
    return {...marker, display: true}
  })
  return {...state,
    routesById: newRoutesById,
    reRenderKey: state.reRenderKey + 1,
    markers: newMarkers,
    isLoading: false
  }
}

const ACTION_HANDLERS = {
  [REQUEST_ROUTES]: (state, action) => {return {...state, isLoading: true}},
  [RECEIVE_ROUTES]: receiveRoutesHandler,
  [TOGGLE_ROUTE]: toggleRouteHandler,
  [REQUEST_ENABLE_ALL_ROUTES]: requestEnableAllRoutesHandler,
  [ENABLE_ALL_ROUTES]: enableAllRoutesHandler,
  [RECEIVE_TROLLEYS]: receiveTrolleysHandler
}

// ------------------------------------
// Reducer
// ------------------------------------

const routesById = {

}

const initialState = {
  isLoading: false,
  error: null,
  routesById: {},
  routeIds: [],
  reRenderKey: 0,
  markers: [],
  trolleyFetchFails : 0,
}
export function MainMapReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

// ------------------------------------
// Utility Functions
// ------------------------------------

function processShapeData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');
  var routes = [];
  for (var i=1; i< allTextLines.length; i++) {
      var data = allTextLines[i].split(',');
      if (data.length >= 4) {
        if (routes[data[0]] === undefined) {
          routes[data[0]] = [];
        }
        routes[data[0]].push(data);
      }
  }
  var routeOverlays = {};
  for (var index in routes) {
    var route = routes[index];
    const coordinates = route.map((coordinate) => {
      const latitude = parseFloat(coordinate[1])
      const longitude = parseFloat(coordinate[2])
      if (latitude && longitude){
        return {latitude, longitude}
      }
    })
    const routeInfo = { ...routeObjects[index], coordinates: coordinates, id: index, stops: []}
    routeOverlays[index] = routeInfo 
  }
  return routeOverlays;
}
