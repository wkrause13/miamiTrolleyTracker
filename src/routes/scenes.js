import React from 'react'
import {Actions, Scene} from 'react-native-router-flux'
import MainMapContainer from './MainMap/containers/MainMapContainer'
import PreferencesContainer from './Preferences/containers/PreferencesContainer'
import NavigationDrawer from '../components/NavigationDrawer'
import styles from '../components/NavigationDrawer/NavigationDrawerStyles'

const burger  = require('../static/menu_burger.png')

const scenes = Actions.create(
  <Scene key='root'>
    <Scene key='drawer' component={NavigationDrawer}>
      <Scene key='drawerChildrenWrapper' drawerImage={burger} leftButtonIconStyle={{width:24, height: 24, resizeMode: 'contain'}} navigationBarStyle={styles.navBar} >
        <Scene key='MainMap' component={MainMapContainer} hideNavBar={true}/>
        <Scene key='Preferences' hideNavBar={false} component={PreferencesContainer} />
      </Scene>
    </Scene>
  </Scene>
)

export default scenes
