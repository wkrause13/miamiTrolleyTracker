import { Platform, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  box: {
    borderColor: 'red',
    borderWidth: 2,
    borderStyle: 'solid'
  },
  sceneContainer: {
    marginTop: (Platform.OS === 'ios') ? 64 : 54,
  }
})

export default styles
