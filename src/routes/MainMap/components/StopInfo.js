/* @flow */
import React from 'react'
import { View, Text, ScrollView, TouchableHighlight, ActivityIndicator } from 'react-native'
import styles from './MainMapStyles.js'

import {RadioButton} from '../../../components/Buttons'
import translations from '../../../utils/translations'


 function renderAltRouteButtons (routeOrder, selectedRouteId, routesById, updatedSelectedRouteId) {
    if (routeOrder.length === 0){
      return null
    }
    const realRouteIds = routeOrder.filter((rid) => {
      return rid !== selectedRouteId
    })
    return realRouteIds.map((routeId) =>{
      const boundPress = updatedSelectedRouteId.bind(this, routeId )
      return (
        <TouchableHighlight
          key={`altRouteButton-${routeId}`}
          underlayColor={'#eee'}
          onPress={boundPress}
          style={{margin: 5, backgroundColor:'transparent'}}
        >
          <View style={{height: 20, width: 20, borderRadius: 5, backgroundColor: routesById[routeId].busColor}} />
        </TouchableHighlight>
      )
    })
  }


function renderStopInfo (selectedRouteId, stopsObject) {
    if (selectedRouteId in stopsObject){
      const stops = stopsObject[selectedRouteId]
      if (!stops){
        return null
      }
      const displayedStops = stops.slice(0, 3)
      return displayedStops.map((stop, i) => {
        return (
          <View key={`schedule-${i}`} style={{flex:1, flexDirection: 'row', height: 20, paddingRight: 20, paddingLeft: 20}}>
            <View style={{flex: 1, alignItems:'center', justifyContent:'flex-end'}} ><Text style={styles.stopText}>{`${stop.equipmentID}`}</Text></View>
            <View style={{flex: 1, alignItems:'center', justifyContent:'center', flexDirection:'row'}}><Text style={[styles.stopText, {fontSize:22, fontWeight: 'bold', color:'white'}]}>{`${stop.minutes}`}</Text><Text style={styles.stopText}> min</Text></View>
            <View style={{flex: 1, alignItems:'center', justifyContent:'flex-end'}}><Text style={styles.stopText}>{`${stop.time}`}</Text></View>
          </View>
        )
      })
  }
}

type Props = {
  renderAltRouteButtons: () => void,
  stopIsLoading: boolean,
  closest: Object,
  language: string,
  selectedRouteId: number,
  stopsObject: Array<Object>,
  routeOrder: Array<number>,
  routesById: Array<Object>,
  setLanguage: (language: string) => void,
  updatedSelectedRouteId: (routeID: number) => void
}

export const StopInfo = (props: Props) => (
  <View style={[styles.StopInfo]}>
    {props.closest.name ? null : <RadioButton language={props.language} setLanguage={props.setLanguage} /> }
    <Text style={{fontSize: 20, fontWeight: 'bold', color:'white', paddingBottom: 5}}>{props.closest.name}</Text>
    {props.stopIsLoading && props.selectedRouteId !== 0 ? <ActivityIndicator color='white' size='small' animating={props.stopIsLoading} /> : null}
    {(props.routesById[props.selectedRouteId] && props.routesById[props.selectedRouteId].activeBuses) || props.selectedRouteId === 0 || props.stopIsLoading || props.routeOrder.length !== 0 ? null : <Text style={{color: 'pink'}}>No active trolleys found for this route</Text> }
    <ScrollView style={{alignSelf: 'stretch', paddingTop: 10}} >
      <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
      {props.stopIsLoading ? null : renderStopInfo(props.selectedRouteId, props.stopsObject)}
      </View>
    </ScrollView>
    <View style={{position: 'absolute', top:0, right: 0, flexDirection: 'row'}}>
      {renderAltRouteButtons(props.routeOrder, props.selectedRouteId, props.routesById, props.updatedSelectedRouteId)}
    </View>
  </View>
)

export default StopInfo






