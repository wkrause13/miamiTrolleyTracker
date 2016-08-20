import _ from 'lodash'

import {routeObjects} from '../../../utils'

// ------------------------------------
// Constants
// ------------------------------------
const REQUEST_ROUTES = 'REQUEST_ROUTES'
const RECEIVE_ROUTES = 'RECEIVE_ROUTES'

// ------------------------------------
// Actions
// ------------------------------------

function requestRoutes () {
  return {
    type: REQUEST_ROUTES
  }
}

function receiveRoutes (data) {
  return {
    type: RECEIVE_ROUTES,
    payload: data
  }
}

export function fetchRoutes () {
  return dispatch => {
    dispatch(requestRoutes())
    return fetch('https://raw.githubusercontent.com/qtrandev/OneBusAway/master/GTFS/Miami/shapes.txt').then((response) => response.text())
    .then((responseText) => {
      const routeOverlays = processShapeData(responseText)
      return dispatch(receiveRoutes(routeOverlays))
    })
    .catch((error) => {
      return dispatch(receiveRoutes({error}))
    })
  }
}


export const actions = {
  fetchRoutes
}

// ------------------------------------
// Selectors
// ------------------------------------
export const getAllRoutes= (state) => {
  const routeArray = state.mainMap.routeIds.map((id) => {
    return state.mainMap.routesById[id]
  })
  return _.sortBy(routeArray, 'name')
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const receiveRoutesHandler = (state, action) => {
  if (action.payload.length < 1) {
    return {...state, isLoading: false, error}
  }
  let routesById = {}
  const routeIds = action.payload.map((route, i) => {
    routesById[i + 1] = route
    return i + 1
  })
  return { ...state, isLoading: false, routes: action.payload, routeIds, routesById }
}

const ACTION_HANDLERS = {
  [REQUEST_ROUTES]: (state, action) => {return {...state, isLoading: true}},
  [RECEIVE_ROUTES]: receiveRoutesHandler,

}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoading: false,
  error: null,
  routesById: {},
  routeIds: []
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
  for (var i=1; i<allTextLines.length; i++) {
      var data = allTextLines[i].split(',');
      if (data.length >= 4) {
        if (routes[data[0]] === undefined) {
          routes[data[0]] = [];
        }
        routes[data[0]].push(data);
      }
  }
  var routeOverlays = [];
  for (var index in routes) {
    var route = routes[index];
    var coordinates = [];
		for (var i=0; i<route.length; i++) {
			coordinates[i] = {latitude: parseFloat(route[i][1]), longitude: parseFloat(route[i][2])};
		}
    routeOverlays.push(
    {
      coordinates: coordinates,
      strokeColor: routeObjects[index].routeColor,
      strokeWidth: 4,
    });
  }
  return routeOverlays;
}
