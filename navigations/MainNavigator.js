import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import DrawerNavigator from './DrawerNavigator'

/*
  主導航器
*/
export default function MainNavigator (props) {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  )
}
