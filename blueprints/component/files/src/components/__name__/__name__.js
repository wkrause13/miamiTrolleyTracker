import React from 'react'
import { Text, View } from 'react-native'
import styles from './<%= pascalEntityName %>Styles.js'

export const <%= pascalEntityName %> = () => (
  <View style={styles['<%= pascalEntityName %>']}>
    <Text><%= pascalEntityName %></Text>
  </View>
)

export default <%= pascalEntityName %>
