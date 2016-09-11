/* @flow */
import React from 'react'
import { View, Text } from 'react-native'
import styles from './MainMapStyles.js'

import {RectangularButton} from '../../../components/Buttons'

type Props = {
  error?: string,
  fetchRoutes: () => void
}

export const ErrorMessage = (props: Props) => (
  <View style={[styles.ErrorMessage]}>
    <View style={{backgroundColor: 'red', padding: 5, marginBottom: 10}}>
      <Text style={{color: 'white'}}>{props.error}</Text>
    </View>
    <RectangularButton
      onPress={props.fetchRoutes}
      underlayColor={'#e69500'}
      style={{backgroundColor:'orange'}}
      text='Try Again'
    />
  </View>
)

export default ErrorMessage
