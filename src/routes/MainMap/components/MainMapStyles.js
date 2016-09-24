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
    fontSize: 16,
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
    alignItems: 'center',
  },
  StopInfoNoticeText: {
    color: 'white',
    fontWeight:'bold',
    lineHeight: 18
  },
  CitiBikeIconContainer: {
    backgroundColor: 'white',
    justifyContent:'center',
    alignItems:'center'
  },
  CitiBikeIconContainerInner: {
    backgroundColor: 'transparent',
    borderBottomColor: '#0098e4',
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'solid',
    borderRadius: 5,
    borderBottomWidth: 5
  },
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingRight: 3
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalTextWrapper: {
    padding: 40
  }

});

export default styles
