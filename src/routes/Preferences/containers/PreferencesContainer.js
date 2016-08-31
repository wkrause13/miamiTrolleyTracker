import { connect } from 'react-redux'
import { setLanguage } from '../modules/Preferences'

import Preferences from '../components/Preferences'

const mapActionCreators = {
  setLanguage
}

const mapStateToProps = (state) => ({
  language: state.preferences.language,
})

export default connect(mapStateToProps, mapActionCreators)(Preferences)
