import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import Styles from '../constants/Styles'
import HomeScreen from '../screens/HomeScreen'
import HeaderButton from '../components/HeaderButton'
import SubtitleScreen from '../screens/SubtitleScreen'
import QuestionScreen from '../screens/QuestionScreen'

const Stack = createNativeStackNavigator()

/*
  頂部導航欄 
*/
export default function HeaderNavigator (props) {
  return (
    <Stack.Navigator initialRouteName='HeaderHome' screenOptions={{ ...Styles.myHeaderStyle }}>
      <Stack.Screen
        name="HeaderHome"
        component={HomeScreen}
        options={({ navigation }) => {
          return {
            title: '面試抱佛腳',
            headerRight: () => {
              return (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                  <Item
                    key={'h1'}
                    title="Menu"
                    iconName="menu"
                    onPress={() => {
                      navigation.openDrawer()
                    }}
                  />
                </HeaderButtons>
              )
            },
          }
        }}
      />
      <Stack.Screen
        name="SubtitleScreen"
        component={SubtitleScreen}
        options={({ navigation, route }) => {
          const chineseName = route.params.chineseName
          return {
            title: chineseName,
            headerRight: () => {
              return (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                  <Item
                    key={'h1'}
                    title="Menu"
                    iconName="menu"
                    onPress={() => {
                      navigation.openDrawer()
                    }}
                  />
                </HeaderButtons>
              )
            },
          }
        }}
      />
      <Stack.Screen
        name="QuestionScreen"
        component={QuestionScreen}
        options={({ navigation, route }) => {
          const subtitle = route.params.subtitle
          return {
            title: subtitle,
            headerRight: () => {
              return (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                  <Item
                    key={'h1'}
                    title="Menu"
                    iconName="menu"
                    onPress={() => {
                      navigation.openDrawer()
                    }}
                  />
                </HeaderButtons>
              )
            },
          }
        }}
      />
    </Stack.Navigator>
  )
}
