import { connect } from 'react-redux'
import {
  fetchRoutes,
  getAllRoutes,
  fetchTrolleys,
  incrementRenderKey,
  getActiveStops,
  fetchStopData,
  updatedSelectedRouteId,
  updateRegion,
  fetchBikeLocations,
} from '../modules/MainMap'

import {
  setLanguage
} from '../../Preferences/modules/Preferences'

import MainMap from '../components/MainMap'

const mapActionCreators = {
  fetchRoutes,
  incrementRenderKey,
  fetchTrolleys,
  getActiveStops,
  fetchStopData,
  updatedSelectedRouteId,
  updateRegion,
  fetchBikeLocations,
  setLanguage
}

const mapStateToProps = (state) => {
  return ({
  routes: getAllRoutes(state),
  routesById: state.mainMap.routesById,
  isLoading: state.mainMap.isLoading,
  error: state.mainMap.error,
  reRenderKey: state.mainMap.reRenderKey,
  markers: state.mainMap.markers,
  stops: getActiveStops(state),
  stopIsLoading: state.mainMap.stopIsLoading,
  retryCount: state.mainMap.retryCount,
  firstFetch: state.mainMap.firstFetch,
  stopsObject: state.mainMap.stopsObject,
  stopFetchError: state.mainMap.stopFetchError,
  selectedRouteId: state.mainMap.selectedRouteId,
  routeOrder: state.mainMap.routeOrder,
  region: state.mainMap.region,
  bikeLocations: state.mainMap.visibleBikes,
  bikeLoading: state.mainMap.bikesIsLoading,
  gotGoodData: state.mainMap.gotGoodData,
  language: state.preferences.language
})
}

export default connect(mapStateToProps, mapActionCreators)(MainMap)
