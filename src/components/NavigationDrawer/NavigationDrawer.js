import React, { PropTypes, Component } from 'react'
// import Drawer from 'react-native-drawer'
import {View, Text, TouchableHighlight, TextInput, Platform} from 'react-native'
import DrawerLayout from 'react-native-drawer-layout'
import { DefaultRenderer, Actions as NavigationActions } from 'react-native-router-flux'
import DrawerContent from './DrawerContent'
import { connect } from 'react-redux'
import styles from './NavigationDrawerStyles'

/* *******************
* Documentation: https://github.com/root-two/react-native-drawer
********************/

  var navigationView = (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
    </View>
  );

class NavigationDrawer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.openDrawerFunc = this.openDrawerFunc.bind(this)
    this.closeDrawerFunc = this.closeDrawerFunc.bind(this)
  }
  static propTypes = {
    navigationState: PropTypes.object
  }
  openDrawerFunc () {
    this.refs['navigation'].openDrawer()
  }
  closeDrawerFunc () {
    this.refs['navigation'].closeDrawer()
  }
  getChildContext () {
      return {openDrawer: this.openDrawerFunc, closeDrawer: this.closeDrawerFunc}
  }
  render () {
    const state = this.props.navigationState
    const children = state.children

    return (
      <DrawerLayout
        drawerBackgroundColor="red"
        drawerWidth={300}
        ref={'navigation'}
        keyboardDismissMode="on-drag"
        drawerLockMode={Platform.OS == 'ios' ? 'locked-closed': 'unlocked'}
        renderNavigationView={() => <DrawerContent closeDrawer={this.closeDrawerFunc}/>}>
          <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </DrawerLayout>
    )
  }
}

NavigationDrawer.childContextTypes = {
  openDrawer: React.PropTypes.func,
  closeDrawer: React.PropTypes.func
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationDrawer)



  // <Drawer
  //       ref='navigation'
  //       type='overlay'
  //       open={state.open}
  //       onOpen={() => NavigationActions.refresh({key: state.key, open: true})}
  //       onClose={() => NavigationActions.refresh({key: state.key, open: false})}
  //       content={<DrawerContent />}
  //       styles={{ shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3}}
  //       closedDrawerOffset={-3}
  //       openDrawerOffset={0.2}
  //       tapToClose
  //       panCloseMask={0.2}
  //       negotiatePan
  //       tweenHandler={ratio => ({
  //         main: {
  //         opacity: 1,
  //         },
  //         mainOverlay: {
  //         opacity: ratio / 2,
  //         backgroundColor: 'black',
  //         },
  //         })}
  //       >
  //       <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
  //     </Drawer>