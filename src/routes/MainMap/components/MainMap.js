import React from 'react'
import { Text, View } from 'react-native'
import styles from './MainMapStyles.js'
import coreStyles from '../../../styles/Core'
import MapView from 'react-native-maps'


export const MainMap = () => (
  <View style={[styles.MainMap, coreStyles.sceneContainer]}>
    <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
   </View>
)

export default MainMap
