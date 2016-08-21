import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Text, View, TouchableHighlight, ActivityIndicator, Platform } from 'react-native'
import styles from './MainMapStyles.js'
import coreStyles from '../../../styles/Core'
import MapView from 'react-native-maps'

import {routeObjects} from '../../../utils'
import Icon from 'react-native-vector-icons/MaterialIcons';

class MainMap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      initialLat: 25.7689000,
      initialLong: -80.2094014,
    }
    // this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }
  componentWillMount () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({initialLong: position.coords.longitude, initialLat: position.coords.latitude});
      },
      (error) => null,
      {enableHighAccuracy: true, timeout: 20000}
    );
  }
  componentDidMount () {
    this.props.fetchRoutes()
    // initial trolley fetch happens in fetchRoutes
    setInterval(
      () => { this.props.fetchTrolleys() },
      10000
    );
  }    
  generateRoutes (routes, reRenderKey) {
    return routes.map((route, i) => {
      const key = Platform.OS === 'ios' ? `route-${i}-${reRenderKey}` : `route-${i}`
      if (route.display){
        return <MapView.Polyline key={key} strokeColor={route.routeColor} strokeWidth={4} coordinates={route.coordinates}/>
      }
    })
  }
  //React Native Maps does not support overlay onPress. Will likely need to replace with custom marker
  generateStops (routes, reRenderKey) {
    return routes.map((route) => {
      return route.stops.map((stop, i) => {
        if (route.display) {
          const key = Platform.OS === 'ios' ? `stop-${i}-${reRenderKey}`: `stop-${i}`
          return <MapView.Marker key={key} anchor={{ x: 0.4, y: 0.5 }} coordinate={{latitude: stop.lat, longitude: stop.lng}} title={stop.name}>
                  <Icon name="brightness-1" size={7} color={'rgba(0, 0, 0, 0.15)'} />
                </MapView.Marker>
        }
      })
    })
  }
  generateTrolleyMarkers (trolleys, reRenderKey) {
    return trolleys.map((trolley, i) => {
      // console.log(trolley.display)
      if (!trolley.display){
        return null
      }
      const key = Platform.OS === 'ios' ? `trolley-${i}-${reRenderKey}`: `trolley-${i}`
      var res = trolley.description.match(/\d+/)
      if (res[0] in routeObjects) {
        return (
          <MapView.Marker  key={key} {...trolley}>
            <Icon name="directions-bus" anchor={{ x: 0.4, y: 0.5 }} size={20} color={routeObjects[res[0]].busColor} />
          </MapView.Marker>
        )
      }
      return (
        <MapView.Marker  key={key}  {...trolley}>
          <Icon name="directions-bus" anchor={{ x: 0.4, y: 0.5 }} size={20} color="#900" />
      </MapView.Marker>
      )
    })
  }
  makeAll (routes, markers, reRenderKey) {
    const newRoutes = this.generateRoutes(routes, reRenderKey)
    const stops = this.generateStops(routes, reRenderKey)
    const trolleys = this.generateTrolleyMarkers(markers, reRenderKey)
    return [
      ...newRoutes,
      ...stops,
      ...trolleys
    ]
  }
  render () {
    const { routes, markers, reRenderKey, isLoading } = this.props
    return (
      <View style={[styles.MainMap, coreStyles.sceneContainer]}>
      
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: this.state.initialLat,
                longitude: this.state.initialLong,
                latitudeDelta: 0.11,
                longitudeDelta: 0.11
            }}
            showsUserLocation
            followsUserLocation
          >
            {routes.length > 0 && markers.length > 0 ? this.makeAll(routes, markers, reRenderKey) : null}
        </MapView>
        <ActivityIndicator size='large' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} animating={isLoading || this.props.markers.length === 0} />
        {this.props.error ?
          <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor:'transparent'}}>
            <View style={{backgroundColor: 'red', padding: 5, marginBottom: 10}}><Text style={{color: 'white'}}>{this.props.error}</Text></View>
            <TouchableHighlight onPress={this.props.fetchRoutes} underlayColor={'#e69500'} style={{height: 40, width: 100, alignItems:'center',justifyContent:'center', backgroundColor: 'orange', borderRadius: 5}}>
              <Text style={{color: '#FFFFFF', fontWeight:'bold'}}>Try Again</Text>
            </TouchableHighlight>
          </View>
          : null
        }
      </View>
    )
  }
}

export default MainMap
