import React from 'react'
import { TouchableHighlight } from 'react-native'
import styles from './ButtonsStyles.js'

export const Fab = (props) => (
  <TouchableHighlight style={[styles['Fab'], props.style]}
    underlayColor={props.underlayColor}
    onPress={props.onPress}
  >
    {props.children}
  </TouchableHighlight>
)

Fab.propTypes = {
  style: React.PropTypes.object,
  underlayColor: React.PropTypes.string,
  onPress: React.PropTypes.func.isRequired
}


export default Fab
