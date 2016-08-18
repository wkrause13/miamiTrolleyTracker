import React, { Component, PropTypes } from 'react'
import { ScrollView, Image } from 'react-native'
import styles from './NavigationDrawerStyles'
import { Actions as NavigationActions } from 'react-native-router-flux'

class DrawerContent extends Component {

  toggleDrawer () {
    this.context.drawer.toggle()
  }
  
  handlePressDeviceArticles = () => {
    this.toggleDrawer()
    NavigationActions.articles()
  }

  render () {
    return (
      <ScrollView style={styles.container}>
      </ScrollView>
    )
  }

}

DrawerContent.propTypes = {
}

DrawerContent.contextTypes = {
  drawer: React.PropTypes.object
}

export default DrawerContent
