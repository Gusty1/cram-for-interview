import { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AntDesign, Entypo, Ionicons } from 'react-native-vector-icons'
import { MD3DarkTheme, MD3LightTheme, adaptNavigationTheme, PaperProvider } from 'react-native-paper'
import { NoNetModal } from '../components'
import useStore from '../store'
import SubjectScreen from './screens/HomeScreen/SubjectScreen'
import SubtitleScreen from './screens/HomeScreen/SubtitleScreen'
import QuestionScreen from './screens/HomeScreen/QuestionScreen'
import FavoriteScreen from './screens/FavoriteScreen'
import SettingScreen from './screens/SettingScreen'
import { navigationSetting } from '../constants/'
import { MyText } from '../components'
import { sqliteInit } from '../services'

const { LightTheme } = adaptNavigationTheme({
  reactNavigationLight: MD3LightTheme
});
const { DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: MD3DarkTheme
})

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Stack Navigator for Home
const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName='SubjectScreen'>
      <Stack.Screen
        name='SubjectScreen'
        component={SubjectScreen}
        options={({ route }) => {
          return {
            ...navigationSetting,
            headerTitle: () => (
              <MyText variant='headlineLarge'>面試抱佛腳</MyText>
            ),
            tabBarIcon: ({ color, size }) => (
              <Entypo name='home' size={size} color={color} />
            )
          }
        }}
      />
      <Stack.Screen
        name='SubtitleScreen'
        component={SubtitleScreen}
        options={({ route }) => {
          return {
            ...navigationSetting,
            headerTitle: () => (
              <MyText variant='headlineLarge'>{route.params.subjectZH}</MyText>
            ),
            tabBarIcon: ({ color, size }) => (
              <Entypo name='home' size={size} color={color} />
            )
          }
        }}
      />
      <Stack.Screen
        name='QuestionScreen'
        component={QuestionScreen}
        options={({ route }) => {
          return {
            ...navigationSetting,
            headerTitle: () => (
              <MyText variant='headlineLarge'>{route.params.subtitleZH}</MyText>
            ),
            tabBarIcon: ({ color, size }) => (
              <Entypo name='home' size={size} color={color} />
            )
          }
        }}
      />
    </Stack.Navigator>
  )
}

// Stack Navigator for Favorite
const FavoriteStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='FavoriteScreen'
        component={FavoriteScreen}
        options={({ route }) => {
          return {
            ...navigationSetting,
            headerTitle: () => {
              return <MyText variant='headlineLarge'>我的收藏</MyText>;
            },
            tabBarIcon: ({ color, size }) => (
              <AntDesign name='heart' size={size} color={color} />
            )
          }
        }}
      />
    </Stack.Navigator>
  )
}

const SettingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='SettingScreen'
        component={SettingScreen}
        options={({ route }) => {
          return {
            ...navigationSetting,
            headerTitle: () => {
              return <MyText variant='headlineLarge'>設定</MyText>
            },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='settings-sharp' size={size} color={color} />
            )
          }
        }}
      />
    </Stack.Navigator>
  )
}

// BottomTabs 用於切換底部導航選項
const BottomTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='HomeTab'
        component={HomeStack}
        options={{
          ...navigationSetting,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Entypo name='home' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='FavoriteTab'
        component={FavoriteStack}
        options={{
          ...navigationSetting,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name='heart' size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name='SettingTab'
        component={SettingStack}
        options={{
          ...navigationSetting,
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='settings-sharp' size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  )
}

const AppNavigator = () => {
  const { setting, getSetting, isConnected, initNetworkListener, favoriteList, getFavoriteList,
    thumbList, getThumbList } = useStore();

  useEffect(() => {
    const initSql = async () => {
      await sqliteInit();
      if (!favoriteList) getFavoriteList()
      if (!thumbList) getThumbList()
    }
    initSql()
  }, [])

  useEffect(() => {
    initNetworkListener() // 啟動網路監聽
  }, [initNetworkListener])

  if (!setting) {
    getSetting()
    return null // 等待 setting 初始化時延遲渲染
  }

  const theme = setting.darkMode ? DarkTheme : LightTheme

  return (
    <PaperProvider theme={theme}>
      {isConnected ? (
        <NavigationContainer theme={theme}>
          <BottomTabs />
        </NavigationContainer>
      ) : (
        <NoNetModal />
      )}
    </PaperProvider>
  )
}

export default AppNavigator
