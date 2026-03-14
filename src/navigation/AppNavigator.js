import { useEffect, useState, useMemo, useCallback } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'
import { MD3DarkTheme, MD3LightTheme, adaptNavigationTheme, PaperProvider } from 'react-native-paper'
import ErrorBoundary from 'react-native-error-boundary'
import { NoNetModal, MaintainModal, QuestionHeaderRight, ErrorView, MyText } from '../components'
import useStore from '../store'
import SubjectScreen from './screens/HomeScreen/SubjectScreen'
import SubtitleScreen from './screens/HomeScreen/SubtitleScreen'
import QuestionScreen from './screens/HomeScreen/QuestionScreen'
import FavoriteScreen from './screens/FavoriteScreen'
import SettingScreen from './screens/SettingScreen'
import AddQuestion from './screens/SettingScreen/AddQuestion'
import { navigationSetting } from '../constants/'
import { sqliteInit, getMaintainObj } from '../services'

const { LightTheme } = adaptNavigationTheme({
  reactNavigationLight: MD3LightTheme
});
const { DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: MD3DarkTheme
})

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

/** 預先建立暗色/亮色主題物件，避免每次 render 重建 */
const DARK_THEME = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
  },
  fonts: {
    ...MD3DarkTheme.fonts,
  },
}

const LIGHT_THEME = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
  },
  fonts: {
    ...MD3LightTheme.fonts,
  },
}

// home 螢幕的 stack
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
            headerRight: () => (<QuestionHeaderRight />),
            tabBarIcon: ({ color, size }) => (
              <Entypo name='home' size={size} color={color} />
            )
          }
        }}
      />
    </Stack.Navigator>
  )
}

// 收藏螢幕的 stack
const FavoriteStack = () => {
  return (
    <Stack.Navigator initialRouteName='FavoriteScreen'>
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
      <Stack.Screen
        name='QuestionScreen'
        component={QuestionScreen}
        options={({ route }) => {
          return {
            ...navigationSetting,
            headerTitle: () => (<MyText variant='headlineLarge'>{route.params.subtitleZH}</MyText>),
            headerRight: () => (<QuestionHeaderRight />),
            tabBarIcon: ({ color, size }) => (
              <Entypo name='home' size={size} color={color} />
            )
          }
        }}
      />
    </Stack.Navigator>
  )
}

// 設定螢幕的 stack
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
      <Stack.Screen
        name='AddQuestionScreen'
        component={AddQuestion}
        options={({ route }) => {
          return {
            ...navigationSetting,
            headerTitle: () => {
              return <MyText variant='headlineLarge'>新增題目</MyText>
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
    thumbList, getThumbList } = useStore()
  // 改用計數器遞增取代 uuid.v4()，避免每次都產生新字串物件
  const [screenChange, setScreenChange] = useState(0)
  const [maintainInfo, setMaintainInfo] = useState(null)

  // 初次載入：取得設定、初始化 SQLite、啟動網路監聽
  useEffect(() => {
    getSetting()
    const initSql = async () => {
      await sqliteInit();
      if (!favoriteList) getFavoriteList()
      if (!thumbList) getThumbList()
    }
    initSql()
    initNetworkListener()
  }, [])

  // 螢幕切換時檢查是否在維護
  useEffect(() => {
    const getMaintainData = async () => {
      const maintainData = await getMaintainObj()
      if (maintainData && maintainData?.show) {
        setMaintainInfo(maintainData)
      } else {
        setMaintainInfo(null)
      }
    }
    getMaintainData()
  }, [screenChange])

  // 穩定的螢幕切換回調，使用計數器遞增
  const handleStateChange = useCallback(() => {
    setScreenChange(prev => prev + 1)
  }, [])

  // 主題物件使用 useMemo，只在 darkMode 改變時重建
  const paperTheme = useMemo(
    () => setting?.darkMode ? DARK_THEME : LIGHT_THEME,
    [setting?.darkMode]
  )

  if (!setting) return null

  return (
    <PaperProvider theme={paperTheme}>
      {isConnected ? (
        maintainInfo ? (
          <MaintainModal maintainInfo={maintainInfo} />
        ) : (
          <ErrorBoundary FallbackComponent={ErrorView}>
            <NavigationContainer theme={paperTheme}
              onStateChange={handleStateChange}>
              <BottomTabs />
            </NavigationContainer>
          </ErrorBoundary>
        )
      ) : (
        <NoNetModal />
      )}
    </PaperProvider>
  )
}

export default AppNavigator
