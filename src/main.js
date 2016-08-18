import React, { PropTypes } from 'react'
import { View, StatusBar } from 'react-native'
import { Router } from 'react-native-router-flux'
import { Provider } from 'react-redux'

import scenes from './routes/scenes'

export default class Root extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }
  renderApp () {
    return (
      <Provider store={this.props.store}>
        <View style={{flex: 1}}>
          <StatusBar
            barStyle='light-content'
          />
          <Router scenes={scenes} />
        </View>
      </Provider>
    )
  }

  render () {
    return this.renderApp()
  }
}
