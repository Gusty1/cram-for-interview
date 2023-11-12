import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import Styles from '../constants/Styles'
import FavoriteScreen from '../screens/FavoriteScreen'
import HeaderButton from '../components/HeaderButton'
import QuestionScreen from '../screens/QuestionScreen'

const Stack = createNativeStackNavigator()

/*
  收藏頁切換導航欄 
*/
export default function HeaderNavigator (props) {
  return (
    <Stack.Navigator initialRouteName='FavoriteScreen' screenOptions={{ ...Styles.myHeaderStyle }}>
      <Stack.Screen
        name="FavoriteScreen"
        component={FavoriteScreen}
        options={({ navigation, route }) => {
          return {
            title: '我的收藏',
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
        name="FavQuestionScreen"
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
