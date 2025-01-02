import { getSettingData, setSettingData } from '../../services'
import { initSetting } from '../../constants'

// 設定狀態管理
export default (set) => {
  return {
    setting: null,
    setSetting: async (changeSettingData) => {
      set({ setting: { ...changeSettingData } })
      await setSettingData(changeSettingData)
    },
    getSetting: async () => {
      try {
        const settingData = await getSettingData()
        set({ setting: { ...settingData } })
      } catch (err) {
        set({ setting: { ...initSetting } })
      }
    }
  }
}
