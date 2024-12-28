import { View } from "react-native";
import { Switch, Text } from "react-native-paper";
import useStore from "../../../store";
import { MyMainView } from "../../../components";
import { settingStyle } from "../../../styles";

const SettingScreen = () => {
  const { setting, setSetting } = useStore();

  const onToggleDarkSwitch = () => {
    setSetting({
      ...setting,
      darkMode: !setting.darkMode,
    });
  };
  
  return (
    <MyMainView>
      <View style={settingStyle.settingRow}>
        <Text style={{ flex: 0.4 }}>黑暗模式</Text>
        <Switch
          value={setting && setting.darkMode}
          onValueChange={onToggleDarkSwitch}
        />
      </View>
    </MyMainView>
  );
};

export default SettingScreen;
