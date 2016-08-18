import React from 'react'
import { Text, View } from 'react-native'
import styles from './MainMapStyles.js'
import coreStyles from '../../../styles/Core'

export const MainMap = () => (
  <View style={styles['MainMap'], coreStyles.sceneContainer}>
    <Text>MainMap</Text>
  </View>
)

export default MainMap
