/**
 * AWS Amplify 設定
 * 從環境變數讀取敏感資訊，避免將 API Key 等寫死在程式碼中
 */
const amplifyconfig = {
  aws_project_region: process.env.EXPO_PUBLIC_AWS_APPSYNC_REGION,
  aws_appsync_graphqlEndpoint: process.env.EXPO_PUBLIC_AWS_APPSYNC_ENDPOINT,
  aws_appsync_region: process.env.EXPO_PUBLIC_AWS_APPSYNC_REGION,
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: process.env.EXPO_PUBLIC_AWS_APPSYNC_API_KEY
}

export default amplifyconfig
