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
              value={props.route.display}
              onTintColor={props.route.routeColor}
            />
          </View>
          <View style={{flex: 4}}>
            <Text pointerEvents="none" style={{color: props.route.routeColor, fontWeight:'bold', fontSize: 16, paddingLeft: 15}}>
              {props.route.name}
            </Text>
          </View>
        </View>
    </View>
  );
};

DrawerContentRow.propTypes = {
  pressAction: React.PropTypes.func.isRequired
}

export default DrawerContentRow
