import NetInfo from '@react-native-community/netinfo'

//網路的狀態管理
export default (set) => {
  // 啟動網路狀態監聽
  const initNetworkListener = () => {
    NetInfo.addEventListener((state) => {
      const { isConnected } = state
      set({ isConnected }) // 更新 Zustand 狀態
    })
  }

  return {
    isConnected: true, // 初始狀態
    initNetworkListener, // 啟動網路監聽
  }
}
