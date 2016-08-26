import { connect } from 'react-redux'
import {
  fetchRoutes,
  getAllRoutes,
  fetchTrolleys,
  incrementRenderKey,
  getActiveStops,
  fetchStopData,
  updatedSelectedRouteId,
  updateRegion
} from '../modules/MainMap'

import MainMap from '../components/MainMap'

const mapActionCreators = {
  fetchRoutes,
  incrementRenderKey,
  fetchTrolleys,
  getActiveStops,
  fetchStopData,
  updatedSelectedRouteId,
  updateRegion
}

const mapStateToProps = (state) => ({
  routes: getAllRoutes(state),
  routesById: state.mainMap.routesById,
  isLoading: state.mainMap.isLoading,
  error: state.mainMap.error,
  reRenderKey: state.mainMap.reRenderKey,
  markers: state.mainMap.markers,
  stops: getActiveStops(state),
  stopIsLoading: state.mainMap.stopIsLoading,
  stopsObject: state.mainMap.stopsObject,
  stopFetchError: state.mainMap.stopFetchError,
  selectedRouteId: state.mainMap.selectedRouteId,
  routeOrder: state.mainMap.routeOrder,
  region: state.mainMap.region
})

export default connect(mapStateToProps, mapActionCreators)(MainMap)
