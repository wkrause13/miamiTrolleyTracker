import React from 'react'
import { Text, View, Switch, AsyncStorage } from 'react-native'

import _ from 'lodash'

import styles from './PreferencesStyles.js'
import coreStyles from '../../../styles/Core'
import {routeObjects} from '../../../utils'


class Preferences extends React.Component {
  constructor() {
    super()
    this.state = {
      routeObjects: routeObjects
    }
    this.toggleDefaultRoute = this.toggleDefaultRoute.bind(this)
    this.readDefaults = this.readDefaults.bind(this)
  }

  componentWillMount () {
    this.readDefaults()
  }

  async readDefaults(){
    try {
      const value = await AsyncStorage.getItem('defaultRoutes');
      if (value !== null) {
        this.setState({routeObjects: JSON.parse(value)})
      }
    } catch (error) {
      console.log(error)
    }
  }

async writeDefaults(routeObject) {
     try {
      await AsyncStorage.setItem('defaultRoutes', JSON.stringify(routeObject));
    } catch (error) {
      console.log(error)
  }
}

  toggleDefaultRoute (routeId) {
    const newState = {
      ...this.state.routeObjects, [routeId]: {
        ...this.state.routeObjects[routeId], defaultOn:
         !this.state.routeObjects[routeId].defaultOn
        }
      }
      this.writeDefaults(newState)
      this.setState({routeObjects: newState})
  }

  renderRoutes () {
    let routeObjects = this.state.routeObjects
    routeKeys = Object.keys(routeObjects)
    const routeList = routeKeys.map((key) => {
      return routeObjects[key]
    })
    const routeListSorted = _.sortBy(routeList, 'name')
    return routeListSorted.map((route) => {
      const boundPress = this.toggleDefaultRoute.bind(this, route.id)
      return (
        <View key={`route-${route.id}`} style={{flexDirection: 'row', alignItems: 'center', width: 160, padding: 5}}>
          <Switch
              onValueChange={boundPress}
              value={route.defaultOn}
              onTintColor={route.routeColor}
            />
          <Text style={{paddingLeft: 10, color: route.routeColor, fontWeight: 'bold'}}>{route.name}</Text>
        </View>
      )
      })
  }

  render() {
    return (
      <View style={[styles['Preferences'], coreStyles.sceneContainer]}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Default Routes</Text>
        <View style={{flexDirection:'row', flex: 1, margin: 10, justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap:'wrap'}}>{this.renderRoutes()}</View>
      </View>
    )
  }
}

export default Preferences
