import React from 'react'
import { AppRegistry, BackAndroid } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Root from './src/main'
// import './src/config/reactotronConfig'
import createStore from './src/store/createStore'

import codePush from "react-native-code-push"


// import Reactotron from 'reactotron'

const store = createStore()
// Reactotron.addReduxStore(store) 

class MiamiTrolleyTracker extends React.Component {
  componentWillMount = () => {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      try {
          Actions.pop();
          return true;
      }
      catch (err) {
          return true;
      }
    });
  }

  render () {
    return <Root {...this.props} store={store} />
  }
}

MiamiTrolleyTracker = codePush(MiamiTrolleyTracker)

AppRegistry.registerComponent('miamiTrolleyTracker', () => MiamiTrolleyTracker);
