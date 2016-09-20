/* @flow */
import React from 'react';
import {Platform, View, Text, Switch, TouchableHighlight } from 'react-native'
import styles from './NavigationDrawerStyles.js'

import Icon from 'react-native-vector-icons/FontAwesome'

type Props = {
  text: string,
  color: string,
  toggleValue: boolean,
  pressAction: () => void,
  testIDObject: Object,

}

const DrawerContentRow = (props: Props) => {
  return (
    <View style={[styles['DrawerContentRow']]}>
        <View style={{ alignSelf:'stretch', flex: 1, flexDirection:'row', alignItems:'center', padding:10}}>
          <View 
            style={{flex: 1}}
            testID={props.testIDObject.switch}
            accessibilityLabel={props.testIDObject.switch}
          >
            <Switch
              onValueChange={props.pressAction}
              value={props.toggleValue}
              onTintColor={props.color}
            />
          </View>
          <View style={{flex: 4}}>
            <Text pointerEvents="none" style={{color: props.color, fontWeight:'bold', fontSize: 16, paddingLeft: 15}}>
              {props.text}
            </Text>
          </View>
        </View>
    </View>
  )
}

export default DrawerContentRow
