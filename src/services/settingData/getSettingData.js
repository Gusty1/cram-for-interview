import AsyncStorage from '@react-native-async-storage/async-storage';
import { initSetting } from '../../constants';

export default async () => {
  try {
    let settingData = await AsyncStorage.getItem('setting');
    if (!settingData) return initSetting;
    else return JSON.parse(settingData);
  } catch (e) {
    return initSetting;
  }
};
