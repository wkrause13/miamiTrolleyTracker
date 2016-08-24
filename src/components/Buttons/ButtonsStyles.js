import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  Fab : {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems:'center',
    justifyContent:'center',
    margin: 20,
    elevation: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  RectangularButton: {
    height: 40,
    width: 100,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 5
  },
  RectangularButtonText: {
    color: '#FFFFFF',
    fontWeight:'bold'
  }
});

export default styles
