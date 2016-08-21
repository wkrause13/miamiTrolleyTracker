import _ from 'lodash'
import {routeObjects} from '../../../utils'

// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_ROUTES = 'REQUEST_ROUTES'
const RECEIVE_ROUTES = 'RECEIVE_ROUTES'

const TOGGLE_ROUTE = 'TOGGLE_ROUTE'

const ENABLE_ALL_ROUTES = 'ENABLE_ALL_ROUTES'

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
  const urls = ['https://raw.githubusercontent.com/qtrandev/OneBusAway/master/GTFS/Miami/shapes.txt','https://miami-transit-api.herokuapp.com/api/trolley/stops.json', 'https://miami-transit-api.herokuapp.com/api/trolley/routes.json' ]
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
      const routes = results[2]['get_routes']
      return dispatch(receiveRoutes(routeOverlays, stops, routes))
    })
    .catch((error) => {
      return dispatch(receiveRoutes({error}))
    })
  }
}

export function toggleRoute (routeId) {
  return {
    type: TOGGLE_ROUTE,
    routeId
  }
}

export function enableAllRoutes () {
  return {
    type: ENABLE_ALL_ROUTES
  }
}


export const actions = {
  fetchRoutes,
  toggleRoute,
  enableAllRoutes
}

// ------------------------------------
// Selectors
// ------------------------------------
export const getAllRoutes= (state) => {
  if (state.mainMap.routeIds){
    const routeArray = state.mainMap.routeIds.map((id) => {
      return state.mainMap.routesById[id]
    })
    return _.sortBy(routeArray, 'name')
  }
  return []

}

// ------------------------------------
// Action Handlers
// ------------------------------------

const receiveRoutesHandler = (state, action) => {
  if (action.stops.length < 1 || action.routes.length < 1) {
    return {...state, isLoading: false, error}
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
  return { ...state, isLoading: false, routes: action.payload, routeIds, routesById }
}

const toggleRouteHandler = (state, action) => {
  const targetRoute = state.routesById[action.routeId]
  return {...state,
      routesById: {
        ...state.routesById,
        [action.routeId]: {
          ...targetRoute,
          display: !targetRoute.display
        } 
      },
      reRenderKey: state.reRenderKey + 1
  }
}


const enableAllRoutesHandler = (state, action) => {
  let newRoutesById = {}
  const newRoutesArray = state.routeIds.forEach((routeId) => {
    const newRoute = {...state.routesById[routeId], display: true}
    newRoutesById[routeId] = newRoute
  })
  return {...state, routesById: newRoutesById}
}

const ACTION_HANDLERS = {
  [REQUEST_ROUTES]: (state, action) => {return {...state, isLoading: true}},
  [RECEIVE_ROUTES]: receiveRoutesHandler,
  [TOGGLE_ROUTE]: toggleRouteHandler,
  [ENABLE_ALL_ROUTES]: enableAllRoutesHandler

}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoading: false,
  error: null,
  routesById: {},
  routeIds: [],
  reRenderKey: 0
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
    const routeInfo = { ...routeObjects[index], coordinates: coordinates, display: index == 2, id: index, stops: []}
    routeOverlays[index] = routeInfo 
  }
  return routeOverlays;
}
