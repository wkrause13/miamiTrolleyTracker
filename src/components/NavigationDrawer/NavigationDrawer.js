import React, { PropTypes, Component } from 'react'
import Drawer from 'react-native-drawer'
import { DefaultRenderer, Actions as NavigationActions } from 'react-native-router-flux'
import DrawerContent from './DrawerContent'
import { connect } from 'react-redux'
import styles from './NavigationDrawerStyles'

/* *******************
* Documentation: https://github.com/root-two/react-native-drawer
********************/

class NavigationDrawer extends Component {
  static propTypes = {
    navigationState: PropTypes.object
  }

  render () {
    const state = this.props.navigationState
    const children = state.children
    return (
   <Drawer
        ref='navigation'
        type='overlay'
        open={state.open}
        onOpen={() => NavigationActions.refresh({key: state.key, open: true})}
        onClose={() => NavigationActions.refresh({key: state.key, open: false})}
        content={<DrawerContent />}
        styles={{ shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3}}
        closedDrawerOffset={-3}
        openDrawerOffset={0.2}
        tapToClose
        panCloseMask={0.2}
        negotiatePan
        tweenHandler={ratio => ({
          main: {
          opacity: 1,
          },
          mainOverlay: {
          opacity: ratio / 2,
          backgroundColor: 'black',
          },
          })}
        >
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </Drawer>
    )
  }
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
