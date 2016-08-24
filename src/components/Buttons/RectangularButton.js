import React from 'react'
import { Text, TouchableHighlight } from 'react-native'
import styles from './ButtonsStyles.js'

export const RectangularButton = (props) => (
  <TouchableHighlight style={[styles['RectangularButton'], props.style]}
    underlayColor={props.underlayColor}
    onPress={props.onPress}
  >
    {props.text ? <Text style={[styles['RectangularButtonText'], props.textStyle]}>{props.text}</Text> : props.children}
  </TouchableHighlight>
)

RectangularButton.propTypes = {
  style: React.PropTypes.object,
  underlayColor: React.PropTypes.string,
  onPress: React.PropTypes.func.isRequired,
  text: React.PropTypes.string,
  textStyle: React.PropTypes.object
}


export default RectangularButton
