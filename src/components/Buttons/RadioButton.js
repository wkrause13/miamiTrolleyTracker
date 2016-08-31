import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'

import styles from './ButtonsStyles.js'
import translations from '../../utils/translations'

export const RadioButton = (props) => (
  <View style={{borderRadius: 5, marginTop: 20, borderColor: props.borderColor ? props.borderColor : 'white', borderWidth: 2, width: 150, height: 30, flexDirection:'row', justifyContent: 'center', alignItems: 'flex-end'}}>
      <TouchableHighlight style={{backgroundColor: props.language == 'en' ? 'white' : 'orange' ,flex: 1,  padding: 5, alignSelf:'center'}}
      underlayColor={'#eee'}
      onPress={() => props.setLanguage('en')}
    >
      <Text style={{color: props.language == 'en' ? 'orange' : 'white', fontWeight: props.language == 'en' ? 'bold' : 'normal', alignSelf: 'center'}}>English</Text>
    </TouchableHighlight>
    <TouchableHighlight style={{flex: 1, padding: 5, backgroundColor: props.language == 'en' ? 'orange' : 'white'}}
      underlayColor={'#eee'}
      onPress={() => props.setLanguage('es')}
    >
      <Text style={{color: props.language == 'en' ? 'white' : 'orange',fontWeight: props.language == 'en' ? 'normal' : 'bold', alignSelf: 'center'}}>Español</Text>
    </TouchableHighlight>
  </View>

)

RadioButton.propTypes = {

}


export default RadioButton
