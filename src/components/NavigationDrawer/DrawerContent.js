import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Text, View, ActivityIndicator, ScrollView, Image, TouchableHighlight, Dimensions } from 'react-native'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'

import DrawerContentRow from './DrawerContentRow'
import {RectangularButton} from '../Buttons'
import { getAllRoutesForDrawer, toggleRoute, enableAllRoutes, toggleBikes } from '../../routes/MainMap/modules/MainMap'
import {routeObjects} from '../../utils'
import styles from './NavigationDrawerStyles'
import translations from '../../utils/translations'

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
    this.props.closeDrawer()
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
            testIDObject={{switch:`DrawerContentRow-${i}`}}
          />
        )
      })
    }
  }

  handleShowAll () {
    this.props.enableAllRoutes()
  }

  handlePressPrefrences = () => {
    this.toggleDrawer()
    NavigationActions.Preferences()
  }

  render () {
    const {trolleyRoutes, isLoading} = this.props
    var {height, width} = Dimensions.get('window')
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{backgroundColor:'#FFFFFF'}} contentContainerStyle={[styles.container]} bounces={false}>
          <View style={{flex: 1, alignSelf:'stretch',  paddingTop: 30}}>
            <TouchableHighlight
              onPress={this.handlePressPrefrences}
              underlayColor={'#eee'}
              style={{height: 30, alignSelf: 'flex-end', marginRight: 20, justifyContent:'center'}}
            >
              <Icon name="settings" size={20} color={'grey'} />
            </TouchableHighlight>
            <View style={{alignItems:'center', paddingBottom: 10}}>
              <Text style={{color: 'grey', fontSize: 20, fontWeight: 'bold'}}>
                {translations[this.props.language].trolleyRoutes}
              </Text>
            </View>
              <View style={{flex: 1, alignItems:'center'}}>
              <RectangularButton
                onPress={this.handleShowAll}
                underlayColor={'#e69500'}
                style={{backgroundColor:'orange'}}
                text={isLoading ? translations[this.props.language].loading : translations[this.props.language].showAll}
              />
            </View>
            {this.generateContentRows(trolleyRoutes)}
            <View style={{alignItems:'center', paddingTop: 5}}>
              <Text style={{color: 'grey', fontSize: 20, fontWeight: 'bold'}}>
                {translations[this.props.language].bikes}
              </Text>
            </View>
            <DrawerContentRow
              color={'#052b6c'}
              toggleValue={this.props.showBikes}
              text={'Citi Bikes'}
              pressAction={this.props.toggleBikes}
              testIDObject={{switch:`citibike`}}
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

const mapActionCreators = {
  toggleRoute,
  enableAllRoutes,
  toggleBikes
}

const mapStateToProps = (state) => ({
  trolleyRoutes: getAllRoutesForDrawer(state),
  isLoading: state.mainMap.isLoading,
  showBikes: state.mainMap.showBikes,
  language: state.preferences.language
})

export default connect(mapStateToProps, mapActionCreators)(DrawerContent)
