import { connect } from 'react-redux'
import { fetchRoutes, getAllRoutes } from '../modules/MainMap'

import MainMap from '../components/MainMap'

const mapActionCreators = {
  fetchRoutes
}

const mapStateToProps = (state) => ({
  routes: getAllRoutes(state),
  routesById: state.mainMap.routesById,
  isLoading: state.mainMap.isLoading,
  error: state.mainMap.error,
  reRenderKey: state.mainMap.reRenderKey
})

export default connect(mapStateToProps, mapActionCreators)(MainMap)
