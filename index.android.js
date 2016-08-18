import React from 'react'
import { AppRegistry } from 'react-native'
import Root from './src/main'
import './src/config/reactotronConfig'
import createStore from './src/store/createStore'

const store = createStore()
class MiamiTrolleyTracker extends React.Component {
  render () {
    return <Root {...this.props} store={store} />
  }
}

AppRegistry.registerComponent('miamiTrolleyTracker', () => MiamiTrolleyTracker);
