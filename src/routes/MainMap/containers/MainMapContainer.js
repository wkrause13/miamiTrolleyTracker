import { connect } from 'react-redux'
import { fetchRoutes, getAllRoutes,fetchTrolleys, incrementRenderKey } from '../modules/MainMap'

import MainMap from '../components/MainMap'

const mapActionCreators = {
  fetchRoutes,
  incrementRenderKey,
  fetchTrolleys
}

const mapStateToProps = (state) => ({
  routes: getAllRoutes(state),
  routesById: state.mainMap.routesById,
  isLoading: state.mainMap.isLoading,
  error: state.mainMap.error,
  reRenderKey: state.mainMap.reRenderKey,
  markers: state.mainMap.markers
})

export default connect(mapStateToProps, mapActionCreators)(MainMap)
