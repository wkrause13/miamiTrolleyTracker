import React from 'react'
import { Text, View } from 'react-native'
import styles from './<%= pascalEntityName %>Styles.js'
import coreStyles from '../../../styles/Core'

export const <%= pascalEntityName %> = () => (
  <View style={[styles['<%= pascalEntityName %>'], coreStyles.sceneContainer]}>
    <Text><%= pascalEntityName %></Text>
  </View>
)

export default <%= pascalEntityName %>
