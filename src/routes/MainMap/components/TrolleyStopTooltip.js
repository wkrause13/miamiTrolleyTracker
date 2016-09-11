/* @flow */
import React from 'react'
import { Text, View} from 'react-native'
import styles from './MainMapStyles.js'

import {routeObjects} from '../../../utils'
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  isLoading: boolean,
  stopText: string
}

class TrollStopTooltip extends React.Component {
  props: Props

  constructor (props: Props) {
    super(props)
  }
  render () {
    return (
      <View style={{height: 100, width: 200}}>
        <Text>{this.props.isLoading ? 'Loading' : this.props.stopText}</Text>
      </View>
    )
  }
}

export default TrollStopTooltip
