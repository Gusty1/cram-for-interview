import AsyncStorage from '@react-native-async-storage/async-storage';

const storeSettingData = async (settingData) => {
    try {
        await AsyncStorage.setItem('setting', JSON.stringify(settingData));
    } catch (e) {
        // saving error
    }
};

const getSettingData = async () => {
    try {
        let settingData = await AsyncStorage.getItem('setting');
        if (!settingData) {
            settingData = {
                darkMode: 'no',
                textSize: 'medium',
            };
        }
        return JSON.parse(settingData);
    } catch (e) {
        // error reading value
    }
};

export { storeSettingData, getSettingData };
