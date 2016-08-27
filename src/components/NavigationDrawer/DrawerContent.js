import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Text, View, ActivityIndicator, ScrollView, Image, TouchableHighlight, Dimensions } from 'react-native'
import styles from './NavigationDrawerStyles'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import DrawerContentRow from './DrawerContentRow'
import {RectangularButton} from '../Buttons'
import { getAllRoutesForDrawer, toggleRoute, enableAllRoutes, toggleBikes } from '../../routes/MainMap/modules/MainMap'
import {routeObjects} from '../../utils'

class DrawerContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      componentLoading: false
    }
    this.handleShowAll = this.handleShowAll.bind(this)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

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
        return (
          <DrawerContentRow
            key={`DrawerContentRow-${i}`}
            color={route.routeColor}
            toggleValue={route.display}
            text={route.name}
            pressAction={boundPress}
          />
        )
      })
    }
  }
  // componentWillUpdate( nextProps, nextState){
  //   console.log(nextProps, nextState)
  // }

  // shouldComponentUpdate (nextProps, nextState) {
  //   console.log(nextProps, nextState)
  //   return nextProps.id !== this.props.id;
  // }
  handleShowAll () {
    this.props.enableAllRoutes()
  }

  render () {
    const {trolleyRoutes, isLoading} = this.props
    var {height, width} = Dimensions.get('window')
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{backgroundColor:'#FFFFFF'}} contentContainerStyle={[styles.container]} bounces={false}>
          <View style={{flex: 1,alignSelf:'stretch',  paddingTop:64}}>
            <View style={{flex: 1, alignItems:'center', paddingBottom: 10}}>
              <RectangularButton
                onPress={this.handleShowAll}
                underlayColor={'#e69500'}
                style={{backgroundColor:'orange'}}
                text={isLoading ? 'Loading' : 'Show All'}
              />
            </View>
            {this.generateContentRows(trolleyRoutes)}
            <DrawerContentRow
              color={'#052b6c'}
              toggleValue={this.props.showBikes}
              text={'Citi Bikes'}
              pressAction={this.props.toggleBikes}
            />
          </View>
        </ScrollView>
        <ActivityIndicator size='large' style={{position:'absolute', top: height/2, left: width/2}} animating={isLoading} />
      </View>
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
  enableAllRoutes,
  toggleBikes
}

const mapStateToProps = (state) => ({
  trolleyRoutes: getAllRoutesForDrawer(state),
  isLoading: state.mainMap.isLoading,
  showBikes: state.mainMap.showBikes
})

export default connect(mapStateToProps, mapActionCreators)(DrawerContent)
