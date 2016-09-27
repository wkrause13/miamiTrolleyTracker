/* @flow */
import React from 'react'
import { View } from 'react-native'
import styles from './MainMapStyles.js'

import Icon from 'react-native-vector-icons/MaterialIcons';


import Svg,{
  ClipPath,
  Defs,
  Rect,
  Path,
  Circle
} from 'react-native-svg';

type Props = {
  circleDiameter: number,
  fillRatio: number
}

export const CitiBikeIcon = (props: Props) => {
   const dim = props.circleDiameter
   const fr = props.fillRatio.toFixed(2)
   return (
    <View style={{height: dim, width: dim, borderRadius: dim,  backgroundColor:'white'}}>
      <Svg
          height={dim}
          width={dim}
      >
        <Defs>
          <ClipPath id="cut-off-bottom">
            <Rect x="0" y={dim * (1 - fr)} width={dim} height={dim * fr} />
          </ClipPath>
        </Defs>
        <Circle cx={dim/2} cy={dim/2} r={dim/2} clipPath="url(#cut-off-bottom)" fill='#0098e4'/>
      </Svg>
      <Icon
        name="directions-bike"
        style={{position:'absolute', top: dim/4, left: dim/4, backgroundColor:'transparent'}}
        size={dim/2}
        color='#052b6c'
      />
    </View>
 )
}
CitiBikeIcon.propTypes = {
  circleDiameter: React.PropTypes.number.isRequired,
  fillRatio: React.PropTypes.number
}

export default CitiBikeIcon
