import React from 'react'
import { Text, TouchableHighlight } from 'react-native'
import styles from './ButtonsStyles.js'

type Props = {
  style: Object,
  underlayColor: string,
  onPress: () => void,
  text?: string,
  textStyle?: Object
}

export const RectangularButton = (props: Props) => (
  <TouchableHighlight style={[styles['RectangularButton'], props.style]}
    underlayColor={props.underlayColor}
    onPress={props.onPress}
  >
    {props.text ? <Text style={[styles['RectangularButtonText'], props.textStyle]}>{props.text}</Text> : props.children}
  </TouchableHighlight>
)

export default RectangularButton
