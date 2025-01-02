import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default async (settingData) => {
  try {
    await AsyncStorage.setItem('setting', JSON.stringify(settingData))
  } catch (e) {
    console.log('storeSettingData error', e)
    Alert.alert('設定發生錯誤...')
  }
}
