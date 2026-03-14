import NetInfo from '@react-native-community/netinfo'

// 網路的狀態管理
export default (set) => {
  let unsubscribe = null

  // 啟動網路狀態監聽，防止重複註冊
  const initNetworkListener = () => {
    if (unsubscribe) return
    unsubscribe = NetInfo.addEventListener((state) => {
      const { isConnected } = state
      set({ isConnected })
    })
  }

  return {
    isConnected: true,
    initNetworkListener,
  }
}
