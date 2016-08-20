import React, { Component, PropTypes } from 'react'
import {Text, View, ScrollView, Image, TouchableHighlight } from 'react-native'
import styles from './NavigationDrawerStyles'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import DrawerContentRow from './DrawerContentRow'

import { getAllRoutes, toggleRoute, enableAllRoutes } from '../../routes/MainMap/modules/MainMap'
import {routeObjects} from '../../utils'

class DrawerContent extends Component {

  toggleDrawer () {
    this.context.drawer.toggle()
  }
  
  handlePressAction (id) {
    this.props.toggleRoute(id)
  }

  generateContentRows (trolleyRoutes) {
    if (trolleyRoutes){
      return trolleyRoutes.map((route, i) => {
        const boundPress = this.handlePressAction.bind(this, route.id)
        return <DrawerContentRow key={`DrawerContentRow-${i}`} route={route} pressAction={boundPress} />
      })
    }
  }

  render () {
    const {trolleyRoutes} = this.props
    return (
      <ScrollView style={{backgroundColor:'#FFFFFF'}} contentContainerStyle={[styles.container]} bounces={false}>
        <View style={{flex: 1,alignSelf:'stretch',  paddingTop:64}}>
          <View style={{flex: 1, alignItems:'center', paddingBottom: 10}}>
            <TouchableHighlight onPress={this.props.enableAllRoutes} style={{height: 40, width: 100, alignItems:'center',justifyContent:'center', backgroundColor: 'orange', borderRadius: 5}}>
              <Text style={{color: '#FFFFFF', fontWeight:'bold'}}>Show All</Text>
            </TouchableHighlight>
          </View>
          {this.generateContentRows(trolleyRoutes)}
        </View>
      </ScrollView>
    )
  }

}

DrawerContent.propTypes = {
}

DrawerContent.contextTypes = {
  drawer: React.PropTypes.object
}

const mapActionCreators = {
  toggleRoute,
  enableAllRoutes
}

const mapStateToProps = (state) => ({
  trolleyRoutes: getAllRoutes(state)
})

export default connect(mapStateToProps, mapActionCreators)(DrawerContent)
