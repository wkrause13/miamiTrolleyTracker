import { connect } from 'react-redux'
import { defaultActionFunction } from '../modules/Preferences'

import Preferences from '../components/Preferences'

const mapActionCreators = {
  defaultActionFunction: () => defaultActionFunction(1),
}

const mapStateToProps = (state) => ({
  counter: state.counter
})

export default connect(mapStateToProps, mapActionCreators)(Preferences)
