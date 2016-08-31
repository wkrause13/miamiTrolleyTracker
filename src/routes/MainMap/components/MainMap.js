import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Text, View, Image, ScrollView, TouchableHighlight, AsyncStorage, ActivityIndicator, Platform } from 'react-native'

import _ from 'lodash'
import MapView from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Swiper from 'react-native-swiper'

import TrolleyStopTooltip from './TrolleyStopTooltip'
import ErrorMessage from './ErrorMessage'
import HelpText from './HelpText'
import StopInfo from './StopInfo'
import CitiBikeIcon from './CitiBikeIcon'
import {Fab, RectangularButton} from '../../../components/Buttons'
import styles from './MainMapStyles.js'
import coreStyles from '../../../styles/Core'
import {routeObjects} from '../../../utils'

// const metroMoverJson = require('../../../static/routes/metromover.json')
// const metroMoverJson2 = require('../../../static/routes/metromover2.json')


class MainMap extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      initialLat: 25.7689000,
      initialLong: -80.2094014,
      stopsObject: {},
      routeOrder: [],
      stopText: '',
      showHelpText: false,
      isLoading: false,
      closest: {name:'', rid: 2},
      selectedRouteId : 0
    }
    this.readShowHelp = this.readShowHelp.bind(this)
    this.handleMapViewOnPress = this.handleMapViewOnPress.bind(this)
    this.handleDismissHelp = this.handleDismissHelp.bind(this)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    this.setDefaultLanguage = this.setDefaultLanguage.bind(this)
  }
  componentWillMount () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position.coords.longitude < 26 && position.coords.longitude > 25.6 && position.coords.latitude < -79.9 && position.coords.latitude > -80.5) {
          this.setState({initialLong: position.coords.longitude, initialLat: position.coords.latitude})
        }
      },
      (error) => null,
      {enableHighAccuracy: true, timeout: 20000}
    )
    this.readShowHelp()
    this.setDefaultLanguage()
  }
  componentDidMount () {
    this.props.fetchRoutes()
    this.props.fetchBikeLocations()
    // initial trolley fetch happens in fetchRoutes
    setInterval(
      () => { this.props.fetchTrolleys() },
      10000
    );
  }
  setDefaultLanguage () {
    async function getLanguage(){
      try {
        const value = await AsyncStorage.getItem('language');
        if (value !== null){
          return value
        }
      } catch (error) {
        console.log(error)
      }
    } 
    getLanguage().then((language) => {
      if (language) {
        this.props.setLanguage(language)
      }
    })
  }
 
  async readShowHelp(){
    try {
      const value = await AsyncStorage.getItem('showHelpText');
      if (value === null){
        this.setState({showHelpText: true})
      }
    } catch (error) {
      console.log(error)
    }
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
          // const boundPress = this.props.fetchStopData.bind(this, stop.id, route.id)
          const key = Platform.OS === 'ios' ? `${stop.id}-${reRenderKey}`: `${stop.id}`
          return (
            <MapView.Circle center={{latitude: stop.lat, longitude: stop.lng}} radius={stop.radius ? stop.radius : 10} zIndex={stop.zindex ? stop.zindex : 1} fillColor={stop.fillColor ? stop.fillColor: 'black'} strokeColor={route.routeColor}/>
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
          <MapView.Marker  key={key} anchor={{ x: 0.5, y: 0.5 }} {...trolley}>
         
          <View style={{backgroundColor: 'white', height: 30, width: 30, borderRadius: 15, justifyContent:'center', alignItems:'center'}}>
            <Icon name="directions-bus" size={20} color={routeObjects[trolley.routeID].busColor} />
          </View>
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
  // generateMetroMoverRoutes () {
  //   return metroMoverJson2.kml.Document.Folder.Placemark.map((pm, i) => {
  //     const coords = pm.LineString.coordinates.split(" ")
  //     const coordinatePairs = coords.map((c) => {
  //       const pairs = c.split(',')
  //       return {longitude: parseFloat(pairs[0]), latitude: parseFloat(pairs[1])}
  //     })
  //     return (
  //       <MapView.Polyline
  //       key={`pm-${i}`}
  //       strokeColor={'red'}
  //       strokeWidth={3}
  //       coordinates={coordinatePairs}
  //     />
  //     )
  //   })
  // }
  // generateMetroMoverRoutes () {
  //   const colors = {"BKL": 'yellow', "INN": 'red', 'OMN':'blue' }
  //   let allRecords = {}
  //   const metroMoverIds = Object.keys(metroMoverJson)
  //   return metroMoverIds.map((mkey) => {
  //     return (
  //       <MapView.Polyline
  //       key={mkey}
  //       strokeColor={colors[mkey]}
  //       strokeWidth={4}
  //       coordinates={metroMoverJson[mkey]}
  //     />
  //     )     
  //   })
  // }

  makeAll (routes, markers, reRenderKey) {
    // const mm = this.generateMetroMoverRoutes()
    const newRoutes = this.generateRoutes(routes, reRenderKey)
    const stops = this.generateStops(routes, reRenderKey)
    const trolleys = this.generateTrolleyMarkers(markers, reRenderKey)
    // this.props.incrementRenderKey ()
            const bob = this.props.bikeLocations.map((location) => {
                    const key = Platform.OS === 'ios' ? `bike-${location.id}-${reRenderKey}`: `bike-${location.id}`
            return (
            <MapView.Marker
              key={key} 
              coordinate={{latitude:location.lat, longitude:location.lng}}
              title={location.address}
            >
            <CitiBikeIcon circleDiameter={15} fillRatio={location.bikes/(location.bikes+location.dockings)} />
            </MapView.Marker>
          )})
    return [
      ...newRoutes,
      ...stops,
      ...trolleys,
      ...bob
    ]
  }
  closestLocation (targetLocation, locationData) {
      function vectorDistance(dx, dy) {
          return Math.sqrt((dx * dx) + (dy * dy))
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
    const hypo = Math.sqrt(latDif * latDif + lngDif * lngDif)
    if (hypo < 0.002) {
      this.props.fetchStopData(closest.id, closest.rid)
      this.setState({closest})
    }
  }

  renderErrorMessage () {
    if (this.props.error ) {
      return <ErrorMessage error={this.props.error} fetchRoutes={this.props.fetchRoutes} />
    }
  }
  handleDismissHelp () {
    this.setState({showHelpText: false})
    write()
    async function write() {
     try {
      await AsyncStorage.setItem('showHelpText', 'false');
    } catch (error) {
      console.log(error)
    }
  }
  }
  renderHelpText () {
    if (this.state.showHelpText){
      return (
        <View style={{marginRight: -3}}>
        <HelpText language={this.props.language}/>
        <Fab style={{position: 'absolute',top: 80, right: 20, backgroundColor:'white'}} underlayColor={'#e69500'} onPress={this.handleDismissHelp}>
          <Icon name="clear" size={25} color={'red'} />
        </Fab>
        </View>
      )
    }
  }
  render () {
    const { routes, markers, reRenderKey, routesById,stopFetchError, isLoading } = this.props
    const modalRoute = routesById[this.props.selectedRouteId]
    const modalColor = modalRoute ? modalRoute.routeColor : ( stopFetchError ? '#eee' : 'orange')
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
              onRegionChangeComplete={_.debounce(this.props.updateRegion, 400)}
            >
              {routes.length > 0 && markers.length > 0 ? this.makeAll(routes, markers, reRenderKey) : null}
          </MapView>
          {isLoading ? <ActivityIndicator size='large' style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} animating={isLoading || this.props.markers.length === 0} /> : null }
          {this.renderErrorMessage()}
          <Fab style={{position: 'absolute',top: 0, backgroundColor:'orange', elevation: this.state.showHelpText ? 0 : 10}} underlayColor={'#e69500'} onPress={this.context.drawer.toggle}>
            <Image style={{height: 25, width: 25}} source={require('../../../static/menu_burger.png')} />
          </Fab>
          {this.renderHelpText()}
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
            setLanguage={this.props.setLanguage}
            language={this.props.language}
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
