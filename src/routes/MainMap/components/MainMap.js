import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Text, View, Image, ScrollView, TouchableHighlight, ActivityIndicator, Platform, StyleSheet } from 'react-native'

import _ from 'lodash'
import MapView from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialIcons';

import TrolleyStopTooltip from './TrolleyStopTooltip'
import ErrorMessage from './ErrorMessage'
import StopInfo from './StopInfo'
import {Fab, RectangularButton} from '../../../components/Buttons'
import styles from './MainMapStyles.js'
import coreStyles from '../../../styles/Core'
import {routeObjects} from '../../../utils'


class MainMap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      initialLat: 25.7689000,
      initialLong: -80.2094014,
      stopsObject: {},
      routeOrder: [],
      stopText: '',
      isLoading: false,
      closest: {name:'', rid: 2},
      selectedRouteId : 0
    }
    this.handleMapViewOnPress = this.handleMapViewOnPress.bind(this)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
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
        return (
          <MapView.Polyline
            key={key}
            strokeColor={route.routeColor}
            strokeWidth={4}
            coordinates={route.coordinates}
          />
        )
      }
    })
  }
  //React Native Maps does not support overlay onPress. Will likely need to replace with custom marker
  generateStops (routes, reRenderKey) {
    return routes.map((route) => {
      return route.stops.map((stop, i) => {
        if (route.display) {
          const boundPress = this.props.fetchStopData.bind(this, stop.id)
          const key = Platform.OS === 'ios' ? `${stop.id}-${reRenderKey}`: `${stop.id}`
          return (
            <MapView.Circle center={{latitude: stop.lat, longitude: stop.lng}} radius={stop.radius ? stop.radius : 10} fillColor={stop.fillColor ? stop.fillColor: 'black'} strokeColor={route.routeColor}/>
          ) 
        }
      })
    })
  }
  generateTrolleyMarkers (trolleys, reRenderKey) {
    return trolleys.map((trolley, i) => {
      if (!trolley.display){
        return null
      }
      const key = Platform.OS === 'ios' ? `trolley-${i}-${reRenderKey}`: `trolley-${i}`
      if (trolley.routeID in routeObjects) {
        return (
          <MapView.Marker  key={key} {...trolley}>
            <Icon name="directions-bus" anchor={{ x: 0.4, y: 0.5 }} size={20} color={routeObjects[trolley.routeID].busColor} />
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
  closestLocation (targetLocation, locationData) {
      function vectorDistance(dx, dy) {
          return Math.sqrt(dx * dx + dy * dy)
      }

      function locationDistance(location1, location2) {
          const dx = location1.lat - location2.lat,
              dy = location1.lng - location2.lng
          return vectorDistance(dx, dy);
      }

      return locationData.reduce(function(prev, curr) {
          const prevDistance = locationDistance(targetLocation , prev),
              currDistance = locationDistance(targetLocation , curr)
          return (prevDistance < currDistance) ? prev : curr
      });
  }

  handleMapViewOnPress(e) {
    const points = this.props.stops
    if (points < 1){
      return
    }
    const p = {lat: e.nativeEvent.coordinate.latitude, lng: e.nativeEvent.coordinate.longitude}
    const closest = this.closestLocation(p, points)
    const latDif = closest.lat - p.lat
    const lngDif = closest.lng - p.lng
    const hypo = Math.sqrt(Math.pow(latDif,2) + Math.sqrt(Math.pow(lngDif,2)))
    if (hypo < 0.02) {
      this.props.fetchStopData(closest.id)
      this.setState({closest})
    }
  }

  renderErrorMessage () {
    if (this.props.error ) {
      return <ErrorMessage error={this.props.error} fetchRoutes={this.props.fetchRoutes} />
    }
  }

  render () {
    const { routes, markers, reRenderKey, routesById, isLoading } = this.props
    const modalRoute = routesById[this.props.selectedRouteId]
    const modalColor = modalRoute ? modalRoute.routeColor : '#eee'
    return (
      <View style={{flex:1}}>
      <View style={[styles.MainMap, {flex: 4}]}>
      
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: this.state.initialLat,
                longitude: this.state.initialLong,
                latitudeDelta: 0.11,
                longitudeDelta: 0.11
            }}
            onPress={this.handleMapViewOnPress}
            showsCompass={false}
            showsUserLocation
            followsUserLocation
          >
            {routes.length > 0 && markers.length > 0 ? this.makeAll(routes, markers, reRenderKey) : null}
        </MapView>
        <ActivityIndicator size='large' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} animating={isLoading || this.props.markers.length === 0} />
        {this.renderErrorMessage()}

        <Fab style={{position: 'absolute',top: 0, backgroundColor:'orange'}} underlayColor={'#e69500'} onPress={this.context.drawer.toggle}>
          <Image style={{height: 25, width: 25}} source={require('../../../static/menu_burger.png')} />
        </Fab>
      </View>
        <View style={{flex:1, alignItems:'center', backgroundColor: modalColor, padding: 10}}>
          <StopInfo
            renderAltRouteButtons={this.renderAltRouteButtons}
            stopIsLoading={this.props.stopIsLoading}
            closest={this.state.closest}
            selectedRouteId={this.props.selectedRouteId}
            stopsObject={this.props.stopsObject}
            routeOrder={this.props.routeOrder}
            routesById={this.props.routesById}
            updatedSelectedRouteId={this.props.updatedSelectedRouteId}
          />
        </View>
      </View>
    )
  }
  static contextTypes = {
    drawer: React.PropTypes.object,
  }
}

export default MainMap
