import React from 'react'
import { Text, View } from 'react-native'
import styles from './MainMapStyles.js'
import coreStyles from '../../../styles/Core'
import MapView from 'react-native-maps'


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
      20000
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
        return <MapView.Circle key={i} center={{latitude: stop.latitude, longitude: stop.longitude}} radius={10} fillColor={route.strokeColor}><MapView.Callout /></MapView.Circle>
      })      
    })  
  }
  generateTrolleyMarkers (trolleys) {
    return trolleys.map((trolley, i) => {
      return <MapView.Marker key={i} {...trolley}/>
    })
  }
  render () {
    const { routes } = this.props
    return (
      <View style={[styles.MainMap, coreStyles.sceneContainer]}>
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: 25.8011413,
                longitude: -80.2044014,
                latitudeDelta: 0.18,
                longitudeDelta: 0.18
            }}
          >
          {routes.length > 0 ? this.generateRoutes(routes) : null}
          {routes.length > 0 ? this.generateStops(  routes) : null}
          {this.state.markers.length > 0 ? this.generateTrolleyMarkers(this.state.markers) : null}
          </MapView>
      </View>
    )
  }
}

export default MainMap
