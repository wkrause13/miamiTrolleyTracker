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
      stops: [],
      initialLat: 25.7689000,
      initialLong: -80.2094014,
    }
    this.fetchTrolleys = this.fetchTrolleys.bind(this)
    this.fetchStops = this.fetchStops.bind(this)
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
    this.fetchTrolleys()
    this.fetchStops()
    setInterval(
      () => { this.fetchTrolleys(); },
      10000
    );
  }
  fetchTrolleys() {
    fetch('https://miami-transit-api.herokuapp.com/api/trolley/vehicles.json')
      .then((response) => response.json())
      .then((responseJson) => {
        var newMarkers = [];
        var trolleys = responseJson.get_vehicles;
        var count = trolleys.length;
        for (i = 0; i < count; i++) {
          trolleys[i].receiveTime = (new Date(trolleys[i].receiveTime)).toLocaleString();
          newMarkers.push(
            {
              coordinate: {
                latitude: trolleys[i].lat,
                longitude: trolleys[i].lng
              },
              title: 'Vehicle ID: '+trolleys[i].equipmentID,
              description: 'Route: '+trolleys[i].routeID + ', Time: '+trolleys[i].receiveTime
            }
          );
        }
        this.setState({ markers: newMarkers })
      })
      .catch((error) => {
        console.error(error)
      });
  }
  fetchStops () {
     fetch('https://miami-transit-api.herokuapp.com/api/trolley/stops.json')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({stops: responseJson['get_stops']})
      })
      .catch((error) => {
        console.error(error)
      })
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
  generateStops (stops) {
    return stops.map((stop, i) => {
      console.log(stop.lat)
        const key = Platform.OS === 'ios' ? `stop-${i}-${this.props.reRenderKey}`: `stop-${i}`
        return <MapView.Marker identifier={`stop-${i}`} key={key} anchor={{ x: 0.4, y: 0.5 }} coordinate={{latitude: stop.lat, longitude: stop.lng}} title='Stop Information'>
                <Icon name="brightness-1" size={7} color={'rgba(238, 238, 238, 0.4)'} />
              </MapView.Marker>
      })
  }
  generateTrolleyMarkers (trolleys) {
    return trolleys.map((trolley, i) => {
      const key = Platform.OS === 'ios' ? `trolley-${i}-${this.props.reRenderKey}`: `trolley-${i}`
      var res = trolley.description.match(/\d+/)
      if (res[0] in routeObjects) {
        return (
          <MapView.Marker identifier={`trolly-${i}`}  key={key} {...trolley}>
            <Icon name="directions-bus" anchor={{ x: 0.4, y: 0.5 }} size={20} color={routeObjects[res[0]].busColor} />
          </MapView.Marker>
        )
      }
      return (
        <MapView.Marker  identifier={`trolly-${i}`}  key={key}  {...trolley}>
          <Icon name="directions-bus" anchor={{ x: 0.4, y: 0.5 }} size={20} color="#900" />
      </MapView.Marker>
      )
    })
  }
  makeAll (routes) {
    const allItems = [...this.generateRoutes(routes)]
    const middle = [...allItems, ...this.generateStops(this.state.stops)]
    const final = [...middle, ...this.generateTrolleyMarkers(this.state.markers)]
    return final
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
            {routes.length > 0 && this.state.markers.length > 0 && this.state.stops.length > 0 ? this.makeAll(routes) : null}
          </MapView>
          <ActivityIndicator size='large' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} animating={isLoading || this.state.markers.length === 0} />
      </View>
    )
  }
}

export default MainMap
