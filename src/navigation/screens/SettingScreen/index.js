import { useState, useEffect } from 'react';
import { View, Alert } from 'react-native'
import { Switch, Button, Divider, Snackbar } from 'react-native-paper'
import Constants from 'expo-constants';
import * as MailComposer from 'expo-mail-composer';
import useStore from '../../../store'
import { MyMainView, MyText } from '../../../components'
import { emailInfo, initSetting, defaultSetting } from '../../../constants'
import { delAllData } from '../../../services'
import { settingStyle } from '../../../styles'

const SettingScreen = ({ navigation, route }) => {
  const [showSnackBar, setShowSnackBar] = useState('')
  const { setting, setSetting, getFavoriteList, getThumbList } = useStore()
  const version = Constants.expoConfig?.version
  const { send } = route?.params || ''

  const onToggleDarkSwitch = () => {
    setSetting({
      ...setting,
      darkMode: !setting.darkMode
    })
  }

  useEffect(() => {
    if (send) setShowSnackBar('送出成功')
  }, [send])

  //意見反饋開啟email
  const sendEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync()
    if (!isAvailable) {
      Alert.alert('無法發送郵件', '此裝置不支持郵件撰寫功能。')
      return
    }
    try {
      const result = await MailComposer.composeAsync(emailInfo)
      if (result.status === MailComposer?.Status?.SENT) {
        Alert.alert('送出成功')
      }
    } catch (error) {
      Alert.alert(defaultSetting.errMsg)
      console.error(error)
    }
  }

  const clearLocalData = () => {
    Alert.alert(
      "清除本地資料", // 標題
      "所有收藏、按讚紀錄都會消失，設定會重置，確定繼續？", // 訊息
      [
        {
          text: "取消"
        },
        {
          text: "確定",
          onPress: () => clearData(),
        }
      ],
      { cancelable: true } // 點擊空白處是否可關閉 Alert
    )

    const clearData = async () => {
      //重置設定
      setSetting(initSetting)
      //刪除本地所有Sqlite資料
      await delAllData()
      //重新取得資料，讓store更新
      getFavoriteList()
      getThumbList()
      setShowSnackBar('清除成功')
    }
  }

  return (
    <MyMainView>
      <View style={settingStyle.settingRow}>
        <MyText style={{ fontSize: 16 }}>黑暗模式</MyText>
        <Switch
          value={setting && setting.darkMode}
          onValueChange={onToggleDarkSwitch}
        />
      </View>

      <View style={{
        gap: 10,
        alignSelf: 'flex-start',
        marginVertical: 10,
      }}>
        <Button icon="note-remove" mode="contained" onPress={() => clearLocalData()}>
          <MyText>清除本地資料</MyText>
        </Button>
        <Button icon="email" mode="contained"
          buttonColor='skyblue'
          onPress={() => sendEmail()}>
          <MyText>意見反饋</MyText>
        </Button>
        <Button icon="card-plus" mode="contained" buttonColor='#A3D1D1'
          onPress={() => navigation.navigate('AddQuestionScreen')}>
          <MyText>提供問題</MyText>
        </Button>
      </View>
      <Divider />
      <MyText style={settingStyle.tipText}>祝各位求職順利!!!</MyText>
      <MyText style={settingStyle.tipText}>v{version}</MyText>
      <Snackbar
        visible={showSnackBar}
        onDismiss={() => setShowSnackBar('')}
        duration={3000}
        style={{
          margin: 'auto',
          width: 100,
          marginBottom: 30,
          backgroundColor: setting.darkMode ? '#3d3a27' : '#ffebcd'
        }}
      >
        <MyText style={{ textAlign: "center" }}>{showSnackBar}</MyText>
      </Snackbar>
    </MyMainView>
  )
}

export default SettingScreen
