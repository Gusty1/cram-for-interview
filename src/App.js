import { useEffect } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'
import { useFonts } from 'expo-font';
import { Amplify } from 'aws-amplify'
import amplifyconfig from './amplifyconfiguration.json';
import AppNavigator from './navigation/AppNavigator'

export default function App () {
  Amplify.configure(amplifyconfig)

  //就算在app.json設定好字體還是需要在程式這樣使用才可以正確套用
  const [fontsLoaded] = useFonts({
    'LXGWWenKaiTC-Regular': require('./assets/fonts/LXGWWenKaiTC-Regular.ttf'),
    'LXGWWenKaiTC-Bold': require('./assets/fonts/LXGWWenKaiTC-Bold.ttf')
  })

  useEffect(() => {
    // 全局鎖定方向
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
  }, [])

  if (!fontsLoaded) {
    return null
  }

  return <AppNavigator />
}
