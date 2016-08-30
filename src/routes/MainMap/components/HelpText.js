import React from 'react'
import { View, Text, Image } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons'
import Swiper from 'react-native-swiper'

import styles from './MainMapStyles.js'
import {Fab} from '../../../components/Buttons'


export const HelpText = (props) => (
  <Swiper style={{position:'absolute'}} showsButtons={true}>
    <View style={styles.slide1}>
      <View style={styles.modalTextWrapper}>
        <Text style={styles.text}>Tap a trolley icon to see its ID</Text>
        <View style={{backgroundColor: 'white', height: 40, width: 40, borderRadius: 20, alignSelf: 'center', justifyContent:'center', alignItems:'center'}}>
          <Icon name="directions-bus" size={25} color={'red'} />
        </View>
      </View>
    </View>
    <View style={styles.slide1}>
      <View style={styles.modalTextWrapper}>
        <Text style={styles.text}>Tap the orange menu button at the top left to toggle routes</Text>
        <Fab style={{backgroundColor:'orange', alignSelf: 'center'}} underlayColor={'#e69500'} onPress={() => false} >
          <Image style={{height: 25, width: 25}} source={require('../../../static/menu_burger.png')} />
        </Fab>
      </View>
    </View>
    <View style={styles.slide1}>
      <View style={styles.modalTextWrapper}>
        <Text style={styles.text}>Tap a stop to see when the next Trolley is estimated to arrive</Text>
        <View style={{marginTop: 20}}>
          <View style={{ alignSelf: 'center', borderRadius: 10, marginTop: 5, height: 20, width: 200, backgroundColor: 'purple'}}></View>
          <View style={{ position: 'absolute', left: 120, top: 0,  alignSelf: 'center', borderColor:'purple', borderWidth: 3, height: 30, width: 30, borderRadius:15, backgroundColor: 'black'}} />
        </View>
      </View>
    </View>
  </Swiper> 
)

HelpText.propTypes = {

}

export default HelpText
