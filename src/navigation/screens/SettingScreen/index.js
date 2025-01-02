import { View } from 'react-native'
import { Switch } from 'react-native-paper'
import useStore from '../../../store'
import { MyMainView, MyText } from '../../../components'
import { settingStyle } from '../../../styles'

const SettingScreen = () => {
  const { setting, setSetting } = useStore()

  const onToggleDarkSwitch = () => {
    setSetting({
      ...setting,
      darkMode: !setting.darkMode
    })
  }

  return (
    <MyMainView>
      <View style={settingStyle.settingRow}>
        <MyText style={{ flex: 1, fontSize: 16 }}>黑暗模式</MyText>
        <Switch
          value={setting && setting.darkMode}
          onValueChange={onToggleDarkSwitch}
        />
      </View>
    </MyMainView>
  )
}

export default SettingScreen
