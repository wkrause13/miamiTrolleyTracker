import React from 'react'
import { AppRegistry } from 'react-native'
import Root from './src/main'
import './src/config/reactotronConfig'
import createStore from './src/store/createStore'

import codePush from "react-native-code-push"


// import Reactotron from 'reactotron'

const store = createStore()
// Reactotron.addReduxStore(store) 

class MiamiTrolleyTracker extends React.Component {
  render () {
    return <Root {...this.props} store={store} />
  }
}

MiamiTrolleyTracker = codePush(MiamiTrolleyTracker)

AppRegistry.registerComponent('miamiTrolleyTracker', () => MiamiTrolleyTracker);
