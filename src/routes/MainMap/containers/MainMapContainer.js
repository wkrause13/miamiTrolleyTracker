import { connect } from 'react-redux'
import { fetchRoutes, getAllRoutes,fetchTrolleys, incrementRenderKey , getActiveStops} from '../modules/MainMap'

import MainMap from '../components/MainMap'

const mapActionCreators = {
  fetchRoutes,
  incrementRenderKey,
  fetchTrolleys,
  getActiveStops
}

const mapStateToProps = (state) => ({
  routes: getAllRoutes(state),
  routesById: state.mainMap.routesById,
  isLoading: state.mainMap.isLoading,
  error: state.mainMap.error,
  reRenderKey: state.mainMap.reRenderKey,
  markers: state.mainMap.markers,
  stops: getActiveStops(state)
})

export default connect(mapStateToProps, mapActionCreators)(MainMap)
