import { useEffect } from 'react'
import * as ScreenOrientation from 'expo-screen-orientation'
import { Amplify } from 'aws-amplify'
import awsconfig from './aws-exports' // 您的 AWS 配置文件
import AppNavigator from './navigation/AppNavigator'

export default function App() {
  Amplify.configure(awsconfig);
  useEffect(() => {
    // 全局鎖定方向
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
  }, [])

  return <AppNavigator />
}
