import React from 'react'
import { Text, View, ActivityIndicator, Platform } from 'react-native'
import styles from './MainMapStyles.js'
import coreStyles from '../../../styles/Core'
import MapView from 'react-native-maps'

import {routeObjects} from '../../../utils'
import Icon from 'react-native-vector-icons/MaterialIcons';

class MainMap extends React.Component {
  constructor () {
    super()
    this.state = {
      markers: [],
      initialLat: 25.7689000,
      initialLong: -80.2094014,
    }
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
    this.props.fetchTrolleys()
    setInterval(
      () => { this.props.fetchTrolleys() },
      10000
    );
  }    
  generateRoutes (routes) {
    return routes.map((route, i) => {
      const key = Platform.OS === 'ios' ? `route-${i}-${this.props.reRenderKey}` : `route-${i}`
      if (route.display){
        return <MapView.Polyline key={key} strokeColor={route.routeColor} strokeWidth={4} coordinates={route.coordinates}/>
      }
    })
  }
  //React Native Maps does not support overlay onPress. Will likely need to replace with custom marker
  generateStops (routes) {
    return routes.map((route) => {
      return route.stops.map((stop, i) => {
        if (route.display) {
          const key = Platform.OS === 'ios' ? `stop-${i}-${this.props.reRenderKey}`: `stop-${i}`
          return <MapView.Marker key={key} anchor={{ x: 0.4, y: 0.5 }} coordinate={{latitude: stop.lat, longitude: stop.lng}} title={stop.name}>
                  <Icon name="brightness-1" size={7} color={'rgba(0, 0, 0, 0.15)'} />
                </MapView.Marker>
        }
      })
    })
  }
  generateTrolleyMarkers (trolleys) {
    return trolleys.map((trolley, i) => {
      const key = Platform.OS === 'ios' ? `trolley-${i}-${this.props.reRenderKey}`: `trolley-${i}`
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
  makeAll (routes) {
    return [
      ...this.generateRoutes(routes),
      ...this.generateStops(routes),
      ...this.generateTrolleyMarkers(this.props.markers)
    ]
  }
  render () {
    const { routes, isLoading } = this.props
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
            {routes.length > 0 && this.props.markers.length > 0 ? this.makeAll(routes) : null}
        </MapView>
        <ActivityIndicator size='large' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} animating={isLoading || this.props.markers.length === 0} />
      </View>
    )
  }
}

export default MainMap
