import React from 'react';
import {Platform, View, Text, Switch, TouchableHighlight } from 'react-native'
import styles from './NavigationDrawerStyles.js'


import Icon from 'react-native-vector-icons/FontAwesome'


const DrawerContentRow = (props) => {
  return (
    <View style={[styles['DrawerContentRow']]}>
      <TouchableHighlight
        backgroundColor={'transparent'}
        underlayColor={'#eee'}
        onPress={props.pressAction}
        >
        <View style={{ alignSelf:'stretch', flex: 1, flexDirection:'row', alignItems:'center', padding:10}}>
          <View style={{flex: 1}}><Switch /></View>
          <View style={{flex: 4}}>
            <Text pointerEvents="none" style={{color: 'black',  fontSize: 16, paddingLeft: 15}}>
              {props.text}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

DrawerContentRow.propTypes = {
  text: React.PropTypes.string.isRequired,
  pressAction: React.PropTypes.func.isRequired
}

export default DrawerContentRow
