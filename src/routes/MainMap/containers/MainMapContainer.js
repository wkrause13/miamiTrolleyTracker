import { connect } from 'react-redux'
import { fetchRoutes } from '../modules/MainMap'

import MainMap from '../components/MainMap'

const mapActionCreators = {
  fetchRoutes
}

const mapStateToProps = (state) => ({
  isLoading: state.mainMap.isLoading,
  error: state.mainMap.error,
  routes: state.mainMap.routes
})

export default connect(mapStateToProps, mapActionCreators)(MainMap)
