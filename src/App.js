import { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
    useEffect(() => {
        // 全局鎖定方向
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }, []);
    return <AppNavigator />;
}
