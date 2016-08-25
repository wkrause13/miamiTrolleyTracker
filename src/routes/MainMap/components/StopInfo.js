import React from 'react'
import { View, Text, ScrollView, TouchableHighlight, ActivityIndicator } from 'react-native'
import styles from './MainMapStyles.js'



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
      return stops.map((stop, i) => {
        return (
          <View key={`schedule-${i}`} style={{flex:1, flexDirection: 'row', paddingRight: 20, paddingLeft: 20}}>
            <View style={{flex: 1, alignItems:'center'}} ><Text style={styles.stopText}>{`${stop.equipmentID}`}</Text></View>
            <View style={{flex: 1, alignItems:'center'}}><Text style={styles.stopText}>{`${stop.minutes}`}</Text></View>
          </View>
        )
      })
  }
}


export const StopInfo = (props) => (
  <View style={[styles.StopInfo]}>
    {props.selectedRouteId === 0 ? <Text>Route Information</Text> : null}
    <Text style={{fontSize: 18, fontWeight:'bold', color: 'white'}}>{props.closest.name}</Text>
    {props.stopIsLoading ? <ActivityIndicator color='white' size='small' animating={props.stopIsLoading} /> : null}
    {props.stopIsLoading ? null : <View style={{paddingBottom: 10}}><Text style={styles.stopText}>Vehicle ID - Time (min)</Text></View>}
    <ScrollView style={{alignSelf: 'stretch'}} >
      <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
      {props.stopIsLoading ? null : renderStopInfo(props.selectedRouteId, props.stopsObject)}
      </View>
    </ScrollView>
    <View style={{position: 'absolute', top:0, right: 0, flexDirection: 'row'}}>
      {renderAltRouteButtons(props.routeOrder, props.selectedRouteId, props.routesById, props.updatedSelectedRouteId)}
    </View>
  </View>
)

StopInfo.propTypes = {
  renderAltRouteButtons: React.PropTypes.func,
  stopIsLoading: React.PropTypes.bool,
  closest: React.PropTypes.object,
  selectedRouteId: React.PropTypes.number,
  stopsObject: React.PropTypes.object,
  routeOrder: React.PropTypes.array,
  routesById: React.PropTypes.object,
  updatedSelectedRouteId: React.PropTypes.func
}

export default StopInfo






