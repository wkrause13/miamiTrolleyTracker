import React from 'react';
import {Platform, View, Text, Switch, TouchableHighlight } from 'react-native'
import styles from './NavigationDrawerStyles.js'


import Icon from 'react-native-vector-icons/FontAwesome'


const DrawerContentRow = (props) => {
  return (
    <View style={[styles['DrawerContentRow']]}>
        <View style={{ alignSelf:'stretch', flex: 1, flexDirection:'row', alignItems:'center', padding:10}}>
          <View style={{flex: 1}}>
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
  );
};

DrawerContentRow.propTypes = {
  pressAction: React.PropTypes.func.isRequired,
  toggleValue: React.PropTypes.bool.isRequired,
  color: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired
}

export default DrawerContentRow
