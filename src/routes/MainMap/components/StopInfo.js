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
      if (!stops){
        return null
      }
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

const IntialText = (props) => (
  <View style={{padding: 20}}>
    <Text style={styles.StopInfoNoticeText}>* Tap on a stop to see when the next Trolley is estimated to arrive</Text>
    <Text style={styles.StopInfoNoticeText}>* Tap the orange menu button at the top left to toggle routes</Text>
    <Text style={styles.StopInfoNoticeText}>* Tap a trolley icon to see its ID</Text>
  </View>

)

export const StopInfo = (props) => (
  <View style={[styles.StopInfo]}>
    {props.selectedRouteId === 0 ? <IntialText /> : <Text style={{fontSize: 18, fontWeight:'bold', color: 'white'}}>{props.closest.name}</Text>}
    {props.stopIsLoading && props.selectedRouteId !== 0 ? <ActivityIndicator color='white' size='small' animating={props.stopIsLoading} /> : null}
    {!props.stopIsLoading && props.selectedRouteId !== 0 ?  <View style={{paddingBottom: 10}}><Text style={styles.stopText}>Vehicle ID - Time (min)</Text></View> : null}
    {props.routesById[props.selectedRouteId] && props.routesById[props.selectedRouteId].activeBuses ? null : <Text style={{color: 'pink'}}>No active trolleys found for this route</Text> }
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






