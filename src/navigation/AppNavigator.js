import ErrorBoundary from 'react-native-error-boundary'
import { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'
import { MD3DarkTheme, MD3LightTheme, adaptNavigationTheme, PaperProvider } from 'react-native-paper'
import uuid from 'react-native-uuid'
import { NoNetModal, MaintainModal, QuestionHeaderRight, ErrorModal } from '../components'
import useStore from '../store'
import SubjectScreen from './screens/HomeScreen/SubjectScreen'
import SubtitleScreen from './screens/HomeScreen/SubtitleScreen'
import QuestionScreen from './screens/HomeScreen/QuestionScreen'
import FavoriteScreen from './screens/FavoriteScreen'
import SettingScreen from './screens/SettingScreen'
import AddQuestion from './screens/SettingScreen/AddQuestion'
import { navigationSetting } from '../constants/'
import { MyText } from '../components'
import { sqliteInit, getMaintainObj } from '../services'

const { LightTheme } = adaptNavigationTheme({
  reactNavigationLight: MD3LightTheme
});
const { DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: MD3DarkTheme
})

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// home螢幕的stack
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

//收藏螢幕的stack
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

//設定螢幕的stack
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
  const [screenChange, setScreenChange] = useState(null)
  const [maintainInfo, setMaintainInfo] = useState(null)

  //初次進入檢查sqlite有無初始化，有的話就把取得本地資料並放到store
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

  useEffect(() => {
    const getMaintainData = async () => {
      const maintainData = await getMaintainObj()
      //如果有維護資料且顯示是true就設定維護資訊
      if (maintainData && maintainData?.show) {
        setMaintainInfo(maintainData)
      } else {
        setMaintainInfo(null)
      }
    }
    getMaintainData()
  }, [screenChange])

  if (!setting) {
    getSetting()
    return null
  }

  const theme = setting.darkMode ? DarkTheme : LightTheme

  //螢幕切換時都給他一個新的id，讓他更新狀態，然後去檢查是否在維護
  return (
    <PaperProvider theme={theme}>
      {isConnected ? (
        maintainInfo ? (
          <MaintainModal maintainInfo={maintainInfo} />
        ) : (
          <ErrorBoundary FallbackComponent={ErrorModal}>
            <NavigationContainer theme={theme}
              onStateChange={() => setScreenChange(uuid.v4())}>
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
