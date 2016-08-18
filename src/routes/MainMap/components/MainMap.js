import React from 'react'
import { Text, View } from 'react-native'
import styles from './MainMapStyles.js'
import coreStyles from '../../../styles/Core'
import MapView from 'react-native-maps'


class MainMap extends React.Component {
  constructor () {
    super()
    this.state = {
      routes: [],
      markers: []
    }
    this.fetchRoutes = this.fetchRoutes.bind(this)
    this.fetchTrolleys = this.fetchTrolleys.bind(this)
  }
  componentDidMount () {
    this.fetchRoutes()
    this.fetchTrolleys()
    setInterval(
      () => { this.fetchTrolleys(); },
      5000
    );
  }
  fetchRoutes() {
    fetch('https://raw.githubusercontent.com/qtrandev/OneBusAway/master/GTFS/Miami/shapes.txt').then((response) => response.text())
    .then((responseText) => {
      var routeOverlays = processShapeData(responseText);
      this.setState({ routes: routeOverlays });
    })
    .catch((error) => {
      console.warn(error);
    });
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
  generateTrolleyMarkers (trolleys) {
    return trolleys.map((trolley, i) => {
      return <MapView.Marker key={i} {...trolley}/>
    })
  }
  render () {
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
          {this.state.routes.length > 0 ? this.generateRoutes(this.state.routes) : null}
          {this.state.markers.length > 0 ? this.generateTrolleyMarkers(this.state.markers) : null}
          </MapView>
      </View>
    )
  }
}

function processShapeData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');
  var routes = [];
  for (var i=1; i<allTextLines.length; i++) {
      var data = allTextLines[i].split(',');
      if (data.length >= 4) {
        if (routes[data[0]] === undefined) {
          routes[data[0]] = [];
        }
        routes[data[0]].push(data);
      }
  }
  var routeOverlays = [];
  for (var index in routes) {
    var route = routes[index];
    var coordinates = [];
		for (var i=0; i<route.length; i++) {
			coordinates[i] = {latitude: parseFloat(route[i][1]), longitude: parseFloat(route[i][2])};
		}
    routeOverlays.push(
    {
      coordinates: coordinates,
      strokeColor: '#'+route[0][0]+route[0][0]+'0000',
      strokeWidth: 3,
    });
  }
  return routeOverlays;
}

export default MainMap
