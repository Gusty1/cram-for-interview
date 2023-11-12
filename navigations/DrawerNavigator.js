import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

const Drawer = createDrawerNavigator()

import Styles from '../constants/Styles'
import HeaderButton from '../components/HeaderButton'
import BottomTabNavigator from './BottomTabNavigator'
import ReportScreen from '../screens/ReportScreen'
import AddQuestion from '../screens/AddQuestion'

/*側邊導航欄，主要就是問題回報 */

export default function DrawerNavigator (props) {
  return (
    <Drawer.Navigator
      initialRouteName="DrawerHome"
      screenOptions={({ navigation }) => {
        return {
          drawerPosition: 'right',
          headerLeft: () => <></>,
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
                  style={{ ...Styles.headerMarginRight }}
                />
              </HeaderButtons>
            )
          },
          ...Styles.myHeaderStyle,
        }
      }}>
      <Drawer.Screen
        name="DrawerHome"
        component={BottomTabNavigator}
        options={{
          title: '首頁',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="AddQuestion"
        component={AddQuestion}
        options={() => {
          return {
            title: '新增問題',
          }
        }}
      />
      <Drawer.Screen
        name="Report"
        component={ReportScreen}
        options={() => {
          return {
            title: '意見反饋',
          }
        }}
      />
    </Drawer.Navigator>
  )
}
