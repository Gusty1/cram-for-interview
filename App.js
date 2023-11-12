import React, { useState, useEffect, useCallback } from 'react'
import { View } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import * as Font from 'expo-font'
import { enableScreens } from 'react-native-screens'
import 'react-native-gesture-handler'
import NetInfo from '@react-native-community/netinfo'
import { Dialog } from '@rneui/themed'
import { Provider } from 'react-redux'

// import { withAuthenticator } from 'aws-amplify-react-native'
/*
  withAuthenticator(function App() {...})
  用這個就會在你程式啟動的時候跳一個登入畫面，後臺可以去amplify console看
  但登入後就會有一些什麼權限問題，SO不懂暫時跳過
 */
import { Amplify } from 'aws-amplify'
import awsmobile from './src/aws-exports'
Amplify.configure(awsmobile)

import MainNavigator from './navigations/MainNavigator'
import MyText from './components/MyText'
import Styles from './constants/Styles'
import { init } from './sqlLite/db'
import store from './store/store'

enableScreens()
init()
  .then(() => {
    console.log('Initialized database')
  })
  .catch((err) => {
    console.log('Initialized db failed')
    console.log(err)
  })

export default function App () {
  const [appIsReady, setAppIsReady] = useState(false)
  const [checkStatus, setCheckStatus] = useState(true)

  //監聽網路狀態
  const unsubscribe = NetInfo.addEventListener((state) => {
    // console.log('Connection type', state.type)
    // console.log('Is connected?', state.isConnected)
    if (!state.isConnected) {
      setCheckStatus(false)
    } else if (setCheckStatus === false && state.isConnected)
      setCheckStatus(true)
  })

  //載入字體
  useEffect(() => {
    async function prepare () {
      try {
        await Font.loadAsync({
          'noto-sans': require('./assets/fonts/NotoSansTC-VariableFont_wght.ttf'),
        })
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
      }
    }
    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) await SplashScreen.hideAsync()
  }, [appIsReady])

  if (!appIsReady) return null

  /*todo
    問題詳細頁可以上下滑動切換問題
    側邊導航欄功能尚未完成
    增加問題...
  */

  return (
    <Provider store={store}>
      <View
        onLayout={onLayoutRootView}
        style={{ ...Styles.defaultMainContainer }}>
        {checkStatus === true ? <MainNavigator /> : null}
        <Dialog isVisible={!checkStatus}>
          <Dialog.Title title="沒有網路" />
          <MyText>請先連上網際網路</MyText>
        </Dialog>
      </View>
    </Provider>
  )
}
