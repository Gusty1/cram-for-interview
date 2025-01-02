import axios from 'axios'

// 建立 axios 實例
const apiClient = axios.create({
  // baseURL: 'https://api.example.com', //預設請求路徑
  timeout: 3000, // 設置請求超時
  headers: {
    'Content-Type': 'application/json',
  }
})

// 請求攔截器
apiClient.interceptors.request.use(
  (config) => {
    // 在發送請求之前可以攔截，例如添加 Token
    return config
  },
  (error) => {
    // 處理請求錯誤
    return Promise.reject(error)
  }
)

// 響應攔截器
apiClient.interceptors.response.use(
  (response) => {
    // 處理成功響應
    return response.data
  },
  (error) => {
		// 處理請求錯誤
    return Promise.reject(error)
  }
)

export default apiClient
