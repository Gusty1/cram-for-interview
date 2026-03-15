import { useState, useEffect, useCallback } from 'react';
import { View, Alert, Linking, StyleSheet } from 'react-native'
import { Switch, List, Snackbar, ActivityIndicator } from 'react-native-paper'
import Constants from 'expo-constants';
import * as MailComposer from 'expo-mail-composer';
import useStore from '../../../store'
import { MyMainView, MyText } from '../../../components'
import { emailInfo, initSetting, defaultSetting } from '../../../constants'
import { delAllData, apiClient } from '../../../services'
import { settingStyle } from '../../../styles'

const GITHUB_REPO = 'Gusty1/cram-for-interview'
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`
const GITHUB_RELEASE_URL = `https://github.com/${GITHUB_REPO}/releases/latest`

/**
 * 比較版本號 (e.g. "1.2.1" vs "1.3.0")
 * @returns 正數表示 remote 較新，0 相同，負數表示 local 較新
 */
const compareVersions = (local, remote) => {
  const l = local.split('.').map(Number)
  const r = remote.split('.').map(Number)
  for (let i = 0; i < Math.max(l.length, r.length); i++) {
    const diff = (r[i] || 0) - (l[i] || 0)
    if (diff !== 0) return diff
  }
  return 0
}

const SettingScreen = ({ navigation, route }) => {
  const [showSnackBar, setShowSnackBar] = useState('')
  const [checking, setChecking] = useState(false)
  const { setting, setSetting, getFavoriteList, getThumbList, clearCache } = useStore()
  const version = Constants.expoConfig?.version
  const { send } = route?.params || {}

  const onToggleDarkSwitch = () => {
    setSetting({
      ...setting,
      darkMode: !setting?.darkMode
    })
  }

  useEffect(() => {
    if (send) setShowSnackBar('送出成功')
  }, [send])

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
      "清除本地資料",
      "所有收藏、按讚紀錄都會消失，設定會重置，確定繼續？",
      [
        { text: "取消" },
        { text: "確定", onPress: () => clearData() }
      ],
      { cancelable: true }
    )

    const clearData = async () => {
      try {
        setSetting(initSetting)
        await delAllData()
        clearCache()
        getFavoriteList()
        getThumbList()
        setShowSnackBar('清除成功')
      } catch (e) {
        Alert.alert(defaultSetting.errMsg)
        console.error('clearData error:', e)
      }
    }
  }

  /** 檢查 GitHub Release 最新版本 */
  const checkUpdate = useCallback(async () => {
    setChecking(true)
    try {
      const data = await apiClient.get(GITHUB_API_URL)
      // tag_name 格式: "1.2.1" 或 "v1.2.1"
      const remoteVersion = (data.tag_name || '').replace(/^v/, '')

      if (!remoteVersion) {
        Alert.alert('檢查失敗', '無法取得遠端版本資訊')
        return
      }

      if (compareVersions(version, remoteVersion) > 0) {
        Alert.alert(
          '有新版本',
          `目前版本: v${version}\n最新版本: v${remoteVersion}`,
          [
            { text: '稍後再說' },
            { text: '前往下載', onPress: () => Linking.openURL(GITHUB_RELEASE_URL) }
          ]
        )
      } else {
        setShowSnackBar('已是最新版本')
      }
    } catch (e) {
      Alert.alert('檢查失敗', '無法連線到 GitHub，請確認網路連線')
      console.error('checkUpdate error:', e)
    } finally {
      setChecking(false)
    }
  }, [version])

  const isDark = setting?.darkMode
  const cardBg = isDark ? '#2a2a2a' : '#fff'
  const borderColor = isDark ? '#444' : '#e8e8e8'

  return (
    <MyMainView>
      {/* 一般設定 */}
      <List.Section>
        <List.Subheader style={styles.sectionHeader}>一般</List.Subheader>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <List.Item
            title={() => <MyText>黑暗模式</MyText>}
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch value={isDark} onValueChange={onToggleDarkSwitch} />
            )}
            style={styles.listItem}
          />
        </View>
      </List.Section>

      {/* 功能 */}
      <List.Section>
        <List.Subheader style={styles.sectionHeader}>功能</List.Subheader>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <List.Item
            title={() => <MyText>檢查更新</MyText>}
            description={() => <MyText style={styles.description}>{version}</MyText>}
            left={(props) => <List.Icon {...props} icon="update" color="#6b4faa" />}
            right={() => checking
              ? <ActivityIndicator size={20} style={{ marginRight: 8 }} />
              : <List.Icon icon="chevron-right" />
            }
            onPress={checkUpdate}
            disabled={checking}
            style={styles.listItem}
          />
          <View style={[styles.divider, { borderColor }]} />
          <List.Item
            title={() => <MyText>意見反饋</MyText>}
            description={() => <MyText style={styles.description}>透過 Email 回報問題</MyText>}
            left={(props) => <List.Icon {...props} icon="email-outline" color="skyblue" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={sendEmail}
            style={styles.listItem}
          />
          <View style={[styles.divider, { borderColor }]} />
          <List.Item
            title={() => <MyText>提供問題</MyText>}
            description={() => <MyText style={styles.description}>投稿新的面試題目</MyText>}
            left={(props) => <List.Icon {...props} icon="card-plus-outline" color="#A3D1D1" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => navigation.navigate('AddQuestionScreen')}
            style={styles.listItem}
          />
        </View>
      </List.Section>

      {/* 進階 */}
      <List.Section>
        <List.Subheader style={[styles.sectionHeader, { color: '#E74C3C' }]}>
          進階
        </List.Subheader>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <List.Item
            title={() => <MyText style={{ color: '#E74C3C' }}>清除本地資料</MyText>}
            description={() => (
              <MyText style={[styles.description, { color: '#E74C3C99' }]}>
                移除所有收藏、按讚紀錄與設定
              </MyText>
            )}
            left={(props) => <List.Icon {...props} icon="delete-outline" color="#E74C3C" />}
            right={() => <List.Icon icon="chevron-right" color="#E74C3C" />}
            onPress={clearLocalData}
            style={styles.listItem}
          />
        </View>
      </List.Section>

      <View style={{ flex: 1 }} />
      <MyText style={settingStyle.tipText}>祝各位求職順利!!!</MyText>
      <View style={settingStyle.snackbarOuter}>
        <Snackbar
          visible={!!showSnackBar}
          onDismiss={() => setShowSnackBar('')}
          duration={1000}
          style={[
            settingStyle.snackbar,
            { backgroundColor: isDark ? '#3d3a27' : '#ffebcd' }
          ]}
        >
          <MyText style={{ textAlign: "center" }}>{showSnackBar}</MyText>
        </Snackbar>
      </View>
    </MyMainView>
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    paddingLeft: 4,
    paddingBottom: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  listItem: {
    paddingVertical: 2,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 56,
  },
  description: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
})

export default SettingScreen
