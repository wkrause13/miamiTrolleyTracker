import { Platform, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  MainMap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  stopText :{
    color: '#eee',
    ...Platform.select({
      ios: {
        fontFamily: 'Courier-Bold'
      },
      android: {
        fontFamily: 'serif'
      }
    })
  },
  ErrorMessage: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor:'transparent'
  },
  StopInfo: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center'
  }
});

export default styles
