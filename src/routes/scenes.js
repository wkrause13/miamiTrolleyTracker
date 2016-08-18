import React from 'react'
import {Actions, Scene} from 'react-native-router-flux'
import MainMapContainer from './MainMap/containers/MainMapContainer'
import NavigationDrawer from '../components/NavigationDrawer'
import styles from '../components/NavigationDrawer/NavigationDrawerStyles'

const scenes = Actions.create(
  <Scene key='root'>
    <Scene key='drawer' component={NavigationDrawer}>
      <Scene key='drawerChildrenWrapper' navigationBarStyle={styles.navBar} >
        <Scene key='MainMap' component={MainMapContainer} />
      </Scene>
    </Scene>
  </Scene>
)

export default scenes
