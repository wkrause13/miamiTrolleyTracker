import React from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import styles from './MainMapStyles.js'
import coreStyles from '../../../styles/Core'
import MapView from 'react-native-maps'

import {strokeColors, busColors, routeToColorIndex} from '../../../utils'
import Icon from 'react-native-vector-icons/MaterialIcons';


class MainMap extends React.Component {
  constructor () {
    super()
    this.state = {
      markers: []
    }
    this.fetchTrolleys = this.fetchTrolleys.bind(this)
  }
  componentDidMount () {
    this.props.fetchRoutes()
    this.fetchTrolleys()
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
        this.setState({ markers: newMarkers });
      })
      .catch((error) => {
        console.error(error);
      });
  }
  generateRoutes (routes) {
    return routes.map((route, i) => {
      return <MapView.Polyline key={i} {...route}/>
    })
  }
  //React Native Maps does not support overlay onPress. Will likely need to replace with custom marker
  generateStops (routes) {
    return routes.map((route) => {
      return route.coordinates.map((stop, i) => {
        return <MapView.Marker key={i} anchor={{ x: 0.4, y: 0.5 }} coordinate={{latitude: stop.latitude, longitude: stop.longitude}} title='Stop Information'>
                <Icon name="brightness-1" size={7} color={route.strokeColor} />
              </MapView.Marker>
      })      
    })  
  }
  generateTrolleyMarkers (trolleys) {
    return trolleys.map((trolley, i) => {
      // strokeColors
      var res = trolley.description.match(/\d+/)
      if (res in routeToColorIndex) {
      return (
        <MapView.Marker  key={i} {...trolley}>
          <Icon name="directions-bus" anchor={{ x: 0.4, y: 0.5 }} size={20} color={strokeColors[routeToColorIndex[res]]} />
      </MapView.Marker>
      )
      }
      // console.log(res[0])
      return (
        <MapView.Marker  key={i} {...trolley}>
          <Icon name="directions-bus" anchor={{ x: 0.4, y: 0.5 }} size={20} color="#900" />
      </MapView.Marker>
      )
    })
  }
  render () {
    const { routes, isLoading } = this.props
    return (
      <View style={[styles.MainMap, coreStyles.sceneContainer]}>
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: 25.7689000,
                longitude: -80.2094014,
                latitudeDelta: 0.11,
                longitudeDelta: 0.11
            }}
          >
            {routes.length > 0 ? this.generateRoutes(routes) : null}
            {routes.length > 0 ? this.generateStops(routes) : null}
            {this.state.markers.length > 0 ? this.generateTrolleyMarkers(this.state.markers) : null}
          </MapView>
          <ActivityIndicator size='large' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} animating={isLoading} />
      </View>
    )
  }
}

export default MainMap
