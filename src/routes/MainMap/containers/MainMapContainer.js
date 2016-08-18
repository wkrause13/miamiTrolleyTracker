import { connect } from 'react-redux'
import { defaultActionFunction } from '../modules/MainMap'

import MainMap from '../components/MainMap'

const mapActionCreators = {
  defaultActionFunction: () => defaultActionFunction(1),
}

const mapStateToProps = (state) => ({
  counter: state.counter
})

export default connect(mapStateToProps, mapActionCreators)(MainMap)
