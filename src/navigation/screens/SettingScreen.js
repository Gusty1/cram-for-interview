import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import { getSettingData, storeSettingData } from '../../Services/setLocalData';
import styles from '../../styles/common';

const SettingScreen = () => {
    const [settingData, setSettingData] = useState(null);

    const onToggleSwitch = () => {
        let changeData = {};
        if (settingData.darkMode === 'yes') {
            changeData = { darkMode: 'no' };
        } else {
            changeData = { darkMode: 'yes' };
        }
        storeSettingData({ ...settingData, ...changeData });
        setSettingData({ ...settingData, ...changeData });
    };

    useEffect(() => {
        (async () => {
            const data = await getSettingData();
            setSettingData(data);
        })();
    }, []);
    return (
        <View style={styles.mainContainer}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-center',
                }}
            >
                <Text>黑暗模式</Text>
                <Switch
                    value={settingData && settingData.darkMode === 'yes'}
                    onValueChange={onToggleSwitch}
                />
            </View>
        </View>
    );
};
export default SettingScreen;
