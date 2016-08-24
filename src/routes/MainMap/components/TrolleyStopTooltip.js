import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Text, View} from 'react-native'
import styles from './MainMapStyles.js'

import {routeObjects} from '../../../utils'
import Icon from 'react-native-vector-icons/MaterialIcons';

class TrollStopTooltip extends React.Component {
  constructor (props) {
    super(props)
  }

  // componentWillReceiveProps (nextProps) {
  //   console.log(nextProps)
  // }

 
  render () {
    return (
      <View style={{height: 100, width: 200}}>
        <Text>{this.props.isLoading ? 'Loading' : this.props.stopText}</Text>
      </View>
    )
  }
}

export default TrollStopTooltip
