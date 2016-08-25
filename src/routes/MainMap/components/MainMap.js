import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Text, View, Image, ScrollView, TouchableHighlight, ActivityIndicator, Platform } from 'react-native'

import _ from 'lodash'
import MapView from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialIcons';

import TrolleyStopTooltip from './TrolleyStopTooltip'
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
      selectedRouteId : 2
    }
    this.handleMapViewOnPress = this.handleMapViewOnPress.bind(this)
    this.fetchStopData = this.fetchStopData.bind(this)
    this.clearStopData = this.clearStopData.bind(this)
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
  fetchStopData (stopId) {
    this.setState({isLoading: true})
    fetch(`http://miami.etaspot.net/service.php?service=get_stop_etas&stopID=${stopId}&statusData=1&token=TESTING`)
      .then((response) => response.json())
      .then((responseJson) => {
        const allStops = responseJson.get_stop_etas[0].enRoute
        const stops = allStops.filter((stop) => {
          return this.props.routesById[stop.routeID].display
        })
        const sortedStops = _.sortBy(stops, "minutes")
        let stopsObject = {}
        let routeOrderSet = new Set()
        sortedStops.forEach((stop) => {
          if (!(stop.routeID in stopsObject)) {
            stopsObject[stop.routeID] = []
          }
          routeOrderSet.add(stop.routeID)
          stopsObject[stop.routeID].push(stop)
        })
        
        const routeOrder = [...routeOrderSet]
        let stopText = ''
        // if (stops.length > 0) {
        //     const stopData = stops[0]
        //     stopText = `Minutes: ${stopData.minutes}`
        //   }
        this.setState({stopsObject, routeOrder, stopText: stopText, isLoading: false, selectedRouteId: routeOrder[0]})
    })
    .catch((error) => {
      console.log(error)
    })
  }
  clearStopData () {
    this.setState({stopText: ''})
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
          const boundPress = this.fetchStopData.bind(this,stop.id)
          const key = Platform.OS === 'ios' ? `${stop.id}-${reRenderKey}`: `${stop.id}`
          return (
            <MapView.Circle center={{latitude: stop.lat, longitude: stop.lng}} radius={10} fillColor='black' strokeColor={route.routeColor}/>
          ) 
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
    if (Math.abs(latDif) < 0.0005 && Math.abs(lngDif) < 0.0004) {
      this.fetchStopData(closest.id)
      this.setState({closest})
    }
  }

  renderErrorMessage () {
    if (this.props.error ) {
      <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor:'transparent'}}>
        <View style={{backgroundColor: 'red', padding: 5, marginBottom: 10}}><Text style={{color: 'white'}}>{this.props.error}</Text></View>
        <RectangularButton
          onPress={this.props.fetchRoutes}
          underlayColor={'#e69500'}
          style={{backgroundColor:'orange'}}
          text='Try Again'
        />
      </View>
    }
  }

  updateCurrentStopRouteId (selectedRouteId) {
    this.setState({selectedRouteId})
  }


  renderAltRouteButtons (routeOrder) {
    if (routeOrder.length === 0){
      return null
    }
    const realRouteIds = routeOrder.filter((rid) => {
      return rid !== this.state.selectedRouteId
    })
    return realRouteIds.map((routeId) =>{
      const boundPress = this.updateCurrentStopRouteId.bind(this, routeId )
      return (
        <TouchableHighlight
          key={`altRouteButton-${routeId}`}
          underlayColor={'#eee'}
          onPress={boundPress}
          style={{margin: 5, backgroundColor:'transparent'}}
        >
          <View style={{top:0, right:0, height: 20, width: 20, borderRadius: 5, backgroundColor: this.props.routesById[routeId].busColor}} />
        </TouchableHighlight>
      )
    })
  }
  renderStopInfo () {
    const {selectedRouteId, stopsObject} = this.state
    if (selectedRouteId in stopsObject){
      const stops = stopsObject[selectedRouteId]
      return stops.map((stop, i) => {
        return (
          <Text key={`schedule-${i}`} style={{color: '#eee'}}>{`Vehicle ID: ${stop.equipmentID} - Minutes: ${stop.minutes}`}</Text>
        )
      })
    }

  }

  render () {
    const { routes, markers, reRenderKey, routesById, isLoading } = this.props
    const modalRoute = routesById[this.state.selectedRouteId]
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
          <Text style={{fontSize: 18, fontWeight:'bold', color: 'white'}}>{this.state.closest.name}</Text>
          {this.state.isLoading ? <ActivityIndicator color='white' size='small' animating={this.state.isLoading} /> : <Text>{this.state.stopText}</Text>}
          <ScrollView style={{alignSelf: 'stretch'}} >
            <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
            {this.state.isLoading ? null : this.renderStopInfo()}
            </View>
          </ScrollView>
          <View style={{position: 'absolute', top:0, right: 0, flexDirection: 'row'}}>
            {this.renderAltRouteButtons(this.state.routeOrder)}
          </View>

        </View>
      </View>
    )
  }
  static contextTypes = {
    drawer: React.PropTypes.object,
  }
}

export default MainMap
