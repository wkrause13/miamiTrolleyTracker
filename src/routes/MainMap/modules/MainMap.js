import {AsyncStorage, Platform} from 'react-native'

import _ from 'lodash'
import { DOMParser } from 'xmldom'

import {routeObjects} from '../../../utils'

// ------------------------------------
// Constants
// ------------------------------------

const START = 'START'

const REQUEST_ROUTES = 'REQUEST_ROUTES'
const RECEIVE_ROUTES = 'RECEIVE_ROUTES'

const REQUEST_STOP = 'REQUEST_STOP'
const RECEIVE_STOP = 'RECEIVE_STOP'

const RECEIVE_TROLLEYS = 'RECEIVE_TROLLEYS'

const TOGGLE_ROUTE = 'TOGGLE_ROUTE'

const REQUEST_ENABLE_ALL_ROUTES = 'REQUEST_ENABLE_ALL_ROUTES'
const ENABLE_ALL_ROUTES = 'ENABLE_ALL_ROUTES'

const INCREMENT_RENDER_KEY = 'INCREMENT_RENDER_KEY'

const UPDATE_SELECTED_ROUTE_ID = 'UPDATE_SELECTED_ROUTE_ID'

const UPDATE_REGION = 'UPDATE_REGION'

const REQUEST_BIKES = 'REQUEST_BIKES'
const RECEIVE_BIKES = 'RECEIVE_BIKES'
const TOGGLE_BIKES = 'TOGGLE_BIKES'

export const types = {
  REQUEST_ROUTES,
  RECEIVE_ROUTES,
  REQUEST_STOP,
  RECEIVE_STOP,
  RECEIVE_TROLLEYS,
  TOGGLE_ROUTE,
  REQUEST_ENABLE_ALL_ROUTES,
  ENABLE_ALL_ROUTES,
  INCREMENT_RENDER_KEY,
  UPDATE_SELECTED_ROUTE_ID,
  UPDATE_REGION,
  REQUEST_BIKES,
  RECEIVE_BIKES,
  TOGGLE_BIKES
}

// ------------------------------------
// Actions
// ------------------------------------

function start () {
  return {
    type: START
  }
}

function requestRoutes () {
  return {
    type: REQUEST_ROUTES
  }
}

function receiveRoutes (routeOverlays, stops, routes, trolleys, defaultRoutes) {
  return {
    type: RECEIVE_ROUTES,
    routeOverlays,
    stops,
    routes,
    trolleys,
    defaultRoutes
  }
}

export function fetchRoutes () {
  const urls = ['https://raw.githubusercontent.com/qtrandev/OneBusAway/master/GTFS/Miami/shapes.txt','https://miami-transit-api.herokuapp.com/api/trolley/stops.json', 'https://miami-transit-api.herokuapp.com/api/trolley/routes.json', 'https://miami-transit-api.herokuapp.com/api/trolley/vehicles.json' ]
  return dispatch => {
    dispatch(requestRoutes())
    let promises = urls.map((url, i) => {
        if (i === 0) {
          return fetch(url).then((response) => response.text())
        } else{
          return fetch(url).then((response) => response.json())
        }
      })
    async function readDefaultRoutes() {
      try {
        const value = await AsyncStorage.getItem('defaultRoutes');
        if (value !== null) {
          return JSON.parse(value)
        } else{
          return routeObjects
        }
      } catch (error) {
        console.log(error)
      }
    }
  const defaultRoutesPromise = readDefaultRoutes()
  promises.push(defaultRoutesPromise)
    return Promise.all(promises).then(results => {
      const routeOverlays = processShapeData(results[0])
      const stops = results[1]['get_stops']
      // both of the following maps will make it easier to support user defaults when app loads
      const routes = results[2]['get_routes']
      const trolleys = results[3].get_vehicles
      // dispatch(receiveTrolleys(trolleys))
      return dispatch(receiveRoutes(routeOverlays, stops, routes, trolleys, results[4] ))
    })
    .catch((error) => {
      return dispatch(receiveRoutes({error}))
    })
  }
}

function requestStop (stopId) {
  return {
    type: REQUEST_STOP,
    stopId
  }
}

function receiveStop (payload, stopId, routeId) {
  return {
    type: RECEIVE_STOP,
    payload,
    stopId,
    routeId
  }
}

function rawFetchStopData (stopId, retryCount=0) {
  return fetch(`http://miami.etaspot.net/service.php?service=get_stop_etas&stopID=${stopId}&statusData=1&token=TESTING`)
  .then((response) => response.json())
  .then((responseJson) => {
    return [responseJson, retryCount]
  })
  .catch((error) => {
    return([{error}, retryCount])
  })
}

export function fetchStopData (stopId, routeId) {
  return dispatch => {
    dispatch(requestStop(stopId))
    rawFetchStopData(stopId).then((responseJson) => {
      if (responseJson[1] < 1 && (responseJson[0].get_stop_etas.length === 0 || responseJson[0].get_stop_etas[0].enRoute.length === 0)){
          setTimeout(() => {
            // dispatch(increment(getState().counter))
            rawFetchStopData(stopId, 1)
            .then(responseJson2 => {
              return dispatch(receiveStop(responseJson2[0], stopId, routeId))
              })
          }, 400)
      } else {
        dispatch(receiveStop(responseJson[0], stopId, routeId))
      }
    })
    .catch((error) => {
      return([{error}, retryCount], stopId, routeId)
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
    setTimeout(() => dispatch(allRoutes()), 50)
    
  }
}

export function incrementRenderKey () {
  return {
    type: INCREMENT_RENDER_KEY
  }
}

export function fetchTrolleys (){
  return (dispatch, getState) => {
    return fetch('https://miami-transit-api.herokuapp.com/api/trolley/vehicles.json')
      .then((response) => response.json())
      .then((responseJson) => {
        return dispatch(receiveTrolleys(responseJson.get_vehicles))
    })
    .catch((error) => {
      return dispatch(receiveTrolleys({error}))
    })
  }
}

export function updatedSelectedRouteId (selectedRouteId) {
    return {
    type: UPDATE_SELECTED_ROUTE_ID,
    selectedRouteId
  }
}

export function updateRegion (region) {
  return {
    type: UPDATE_REGION,
    region
  }
}

function requestBikes () {
  return {
    type: REQUEST_BIKES
  }
}

function receiveBikes (payload) {
  return {
    type: RECEIVE_BIKES,
		payload
  }
}

export function	fetchBikeLocations() {
		const url = 'http://citibikemiami.com/downtown-miami-locations2.xml';
  return dispatch => {
    dispatch(requestBikes())
		fetch(url, { method: 'GET',
							mode: 'cors',
							cache: 'default' })
			.then(response => response.text())
			.then((data) => {
				return dispatch(receiveBikes(data))
			})
		.catch((error) =>{
			console.log(error)
			dispatch(receiveBikes({error}))
		})
	}
}

export function toggleBikes () {
  return {
    type: TOGGLE_BIKES
  }
}

// For making testing easier. I perfer explicit imports of action creators in containers
export const actions = {
  start,
  requestRoutes,
  receiveRoutes,
  fetchRoutes,
  toggleRoute,
  receiveStop,
  requestStop,
  fetchStopData,
  allRoutes,
  requestEnableAllRoutes,
  enableAllRoutes,
  incrementRenderKey,
  receiveTrolleys,
  fetchTrolleys,
  updatedSelectedRouteId,
  updateRegion,
  requestBikes,
  receiveBikes,
  fetchBikeLocations,
  toggleBikes,
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

export const getActiveStops = (state) => {
  if (_.isEmpty(state.mainMap.region)){
    return []
  }
  const {latitude, longitude, latitudeDelta, longitudeDelta} = state.mainMap.region
  const upperLat = latitude + latitudeDelta/2
  const lowerLat = latitude - latitudeDelta/2
  const upperLng = longitude + longitudeDelta/2
  const lowerLng = longitude - longitudeDelta/2

  // console.log(state.mainMap.region, upperLat, lowerLat, upperLng, lowerLng )

  if (state.mainMap.routeIds) {
    let stopArray = []
    state.mainMap.routeIds.forEach((id) => {
      const route = state.mainMap.routesById[id]
      if(route.display){
        return route.stops.forEach((stop) => {
          if(stop.lat > lowerLat &&  stop.lat < upperLat && stop.lng > lowerLng && stop.lng < upperLng ) {
            stopArray.push(stop)
          }
        })
      }
    })
    // console.log(stopArray.length)
    return stopArray
  }
  return []
}

export const selectors = {
  getAllRoutes,
  getAllRoutesForDrawer,
  getActiveStops
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const startHandler = (state, action) => {
  // async function readDefaultRoutes() {
  //   try {
  //     const value = await AsyncStorage.getItem('defaultRoutes');
  //     if (value !== null) {
        
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
}

const receiveRoutesHandler = (state, action) => {
  if (action.routeOverlays.error) {
    return {...state, error: 'Had trouble getting data :-(', isLoading: false}
  }
  if (action.stops.length < 1 || action.routes.length < 1) {
    return {...state, isLoading: false}
  }
  let stopsByRoute = {}
  action.stops.forEach((stop) => {
    stop.name =  stop.name.replace(/&nbsp;/g,'')
    if (!(stop.rid in stopsByRoute)) {
      stopsByRoute[stop.rid] = []
    }
    stopsByRoute[stop.rid].push(stop)
  })
  const markers = action.trolleys.map((trolley) => {
    // not going to plot buses with bad or unknown route information
    if (!(Object.keys(routeObjects).includes(trolley.routeID.toString()))) {
      return undefined
    }
    let shouldDisplay = false
    if ((trolley.routeID in action.defaultRoutes)) {
      shouldDisplay = action.defaultRoutes[trolley.routeID].defaultOn 
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
      routeID: trolley.routeID, 
      description: `${trolley.inService === 0 ? 'Out of Service' : 'In Service'}`,
      inService: trolley.inService
    }
  })
  validMarkers = markers.filter(function( element ) {
    return element !== undefined;
  });

  let routesById = {}
  const routeIds = action.routes.map((route, i) => {
    const newRoute = {...route, ...action.routeOverlays[route['id']], stops:stopsByRoute[route.id], display: action.defaultRoutes[route.id].defaultOn }
    routesById[route['id']] = newRoute
    return route['id'] 
  })
  return { ...state, isLoading: false, routes: action.payload, routeIds, routesById, markers: validMarkers, error: null, reRenderKey: state.reRenderKey + 1 }    


}

const receiveTrolleysHandler = (state, action) => {
  if (action.trolleys.error && state.trolleyFetchFails < 6) {
    return {...state, trolleyFetchFails: state.trolleyFetchFails + 1}
  }
  if (state.trolleyFetchFails > 5){
    return {...state, error: 'Having trouble updating trolley data'}
  }
  const markers = action.trolleys.map((trolley) => {
    // not going to plot buses with bad or unknown route information
    if (!(Object.keys(routeObjects).includes(trolley.routeID.toString()))) {
      return undefined
    }
    let shouldDisplay = false
    if ((trolley.routeID in state.routesById)) {
      shouldDisplay = state.routesById[trolley.routeID].display
    }
    if (state.initialTrolleyFetch && trolley.routeID == 2 ) {
      shouldDisplay = true
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
      routeID: trolley.routeID, 
      description: `${trolley.inService === 0 ? 'Out of Service' : 'In Service'}`,
      inService: trolley.inService
    }
  })
  validMarkers = markers.filter(function( element ) {
    return element !== undefined;
  });

    let routeSet = new Set()
    validMarkers.forEach((marker) => {
      if (marker.inService) {
        routeSet.add(marker.routeId)
      }
    })    
    const routesArray = [...routeSet]
    let routesById = {}
    state.routeIds.forEach((routeId) => {
      if (routesArray.includes(routeId)) {
        routesById[routeId] = {...state.routesById[routeId], activeBuses: true}
      } else {
        routesById[routeId] = {...state.routesById[routeId], activeBuses: false}
      }
    })
  return {...state, routesById: routesById, initialTrolleyFetch: false, markers: validMarkers, trolleyFetchFails: 0, error: null}
}

const requestStopHandler = (state, action) => {
  let routesById = {}
  state.routeIds.forEach((routeId) => {
    const route = state.routesById[routeId]
    const newStops = route.stops.map((stop) => {
      if (stop.id == action.stopId) {
        stop.fillColor = 'yellow'
        if (Platform.OS == 'android'){
          stop.radius = 20
          stop.zindex = 2
        }
      }else{
        stop.fillColor = 'black'
        if (Platform.OS == 'android'){
          stop.radius = 10
          stop.zindex = 1
        }
      }
      return stop
    })
    const newRoute = {...route, stops: newStops }
    routesById[routeId] = newRoute
  })
  return {...state, stopIsLoading: true, routesById}
}

const receiveStopHandler = (state, action) => {
    if (action.payload.error) {
      return {...state, stopFetchError: true}
    }
    const allStops = action.payload.get_stop_etas[0].enRoute
    const stops = allStops.filter((stop) => {
      return state.routesById[stop.routeID].display
    })
    const sortedStops = _.sortBy(stops, "minutes")
    let stopsObject = {}
    let routeOrderSet = new Set()
    sortedStops.forEach((stop) => {
      if (!(stop.routeID in stopsObject)) {
        stopsObject[stop.routeID] = []
      }
      routeOrderSet.add(stop.routeID)
      stopsObject[stop.routeID].push(stop)
    })

    const stopFetchError = _.isEmpty(stopsObject)
    
    const routeOrder = [...routeOrderSet]
    return {...state, stopFetchError: stopFetchError, stopsObject: stopsObject, stopIsLoading: false, selectedRouteId: routeOrder[0] ? routeOrder[0] : action.routeId, routeOrder: routeOrder }
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

const updatedSelectedRouteIdHandler = (state, action) => { 
  return {...state, selectedRouteId: action.selectedRouteId}
}

const updateRegionHandler = (state, action) => {
  let locations = []
  let newRenderKey = state.reRenderKey
  if (state.showBikes){
		const {latitude, longitude, latitudeDelta, longitudeDelta} = action.region
		const upperLat = latitude + latitudeDelta/2
		const lowerLat = latitude - latitudeDelta/2
		const upperLng = longitude + longitudeDelta/2
		const lowerLng = longitude - longitudeDelta/2
    locations = state.bikeLocations.filter((l) => {
			return l.lat > lowerLat &&  l.lat < upperLat && l.lng > lowerLng && l.lng < upperLng
    })
    // if( latitudeDelta < state.region.latitudeDelta && longitudeDelta < state.region.longitudeDelta){
    //   newRenderKey = newRenderKey + 1
    // }
    newRenderKey = newRenderKey + 1
  }
  return {...state, region: action.region, visibleBikes: locations, reRenderKey: newRenderKey }
}

const incrementRenderKeyHandler = (state, action) => {
  return {...state, reRenderKey: state.reRenderKey + 1}
}

const requestBikesHandler = (state, action) => {
	return {...state, bikesIsLoading: true}
}

const receiveBikesHandler = (state, action) => {
	let doc = new DOMParser().parseFromString(action.payload,'text/xml');
	let locations = doc.getElementsByTagName("location");
	let locationList = new Array;
	for (let i = 0; i < locations.length; ++i) {
		const lng = parseFloat(locations[i].getElementsByTagName('Longitude')[0].textContent);
		const lat = parseFloat(locations[i].getElementsByTagName('Latitude')[0].textContent);
		const id = parseInt(locations[i].getElementsByTagName('Id')[0].textContent);
		const address = locations[i].getElementsByTagName('Address')[0].textContent;
		const bikes = parseInt(locations[i].getElementsByTagName('Bikes')[0].textContent);
		const dockings = parseInt(locations[i].getElementsByTagName('Dockings')[0].textContent);
		// Lazy way to check for bad data
		if (lng){
			locationList.push({lng,lat,id,address,bikes,dockings});						
		}
	};
	return {...state, bikeLocations: locationList, bikesIsLoading: false}
}

const toggleBikesHandler = (state, action) => {
  let locations = []
  let newRenderKey = state.reRenderKey
  if (!state.showBikes){
		const {latitude, longitude, latitudeDelta, longitudeDelta} = state.region
		const upperLat = latitude + latitudeDelta/2
		const lowerLat = latitude - latitudeDelta/2
		const upperLng = longitude + longitudeDelta/2
		const lowerLng = longitude - longitudeDelta/2
    locations = state.bikeLocations.filter((l) => {
			return l.lat > lowerLat &&  l.lat < upperLat && l.lng > lowerLng && l.lng < upperLng
    })
    newRenderKey = newRenderKey + 1
  } 
  return {...state, visibleBikes: locations, showBikes: !state.showBikes, reRenderKey: newRenderKey }
}

const ACTION_HANDLERS = {
  [REQUEST_ROUTES]: (state, action) => {return {...state, isLoading: true}},
  [RECEIVE_ROUTES]: receiveRoutesHandler,
  [TOGGLE_ROUTE]: toggleRouteHandler,
  [REQUEST_ENABLE_ALL_ROUTES]: requestEnableAllRoutesHandler,
  [ENABLE_ALL_ROUTES]: enableAllRoutesHandler,
  [RECEIVE_TROLLEYS]: receiveTrolleysHandler,
  [REQUEST_STOP]: requestStopHandler,
  [RECEIVE_STOP]: receiveStopHandler,
  [UPDATE_SELECTED_ROUTE_ID]: updatedSelectedRouteIdHandler,
  [UPDATE_REGION]: updateRegionHandler,
  [INCREMENT_RENDER_KEY]: incrementRenderKeyHandler,
  [REQUEST_BIKES]: requestBikesHandler,
	[RECEIVE_BIKES]: receiveBikesHandler,
  [TOGGLE_BIKES]: toggleBikesHandler
}


// ------------------------------------
// Reducer
// ------------------------------------

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
