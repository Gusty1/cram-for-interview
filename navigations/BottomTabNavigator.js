import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

import HeaderNavigator from './HeaderNavigator'
import FavNavigator from './FavNavigator'

const Tab = createBottomTabNavigator()

/*
  底部導航欄
*/

export default function BottomTabNavigator (props) {

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="BottomHome"
        component={HeaderNavigator}
        options={{
          headerShown: false,
          tabBarIcon: (props) => {
            if (props.focused)
              return (
                <Ionicons name="home" size={props.size} color={props.color} />
              )
            else return <Ionicons name="home-outline" size={props.size} />
          },
        }}
      />
      <Tab.Screen
        name="FavNavigator"
        component={FavNavigator}
        options={({ navigation }) => {
          return {
            headerShown: false,
            tabBarIcon: (props) => {
              if (props.focused)
                return (
                  <Ionicons
                    name="heart"
                    size={props.size}
                    color={props.color}
                  />
                )
              else return <Ionicons name="heart-outline" size={props.size} />
            },
          }
        }}
      />
    </Tab.Navigator>
  )
}
