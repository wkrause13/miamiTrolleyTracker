/* @flow */
import React from 'react'
import { TouchableHighlight } from 'react-native'
import styles from './ButtonsStyles.js'


type Props = {
  style: Object,
  underlayColor: string,
  onPress: () => void,
  testIDObject: Object,
  children: Object
}

export const Fab = (props : Props) => (
  <TouchableHighlight style={[styles['Fab'], props.style]}
    underlayColor={props.underlayColor}
    onPress={props.onPress}
    testID={props.testIDObject.main}
    accessibilityLabel={props.testIDObject.main}
  >
    {props.children}
  </TouchableHighlight>
)

export default Fab
