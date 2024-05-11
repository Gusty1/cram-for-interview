const BASE_URL = '../assets/images/subtitles/'

/*
  因為本地圖片require不能用變數，所以要先包起來
  這是副標題icon的圖片
*/
export default {
    Java: require(`${BASE_URL}java.png`),
    Spring: require(`${BASE_URL}spring.png`),
    SQL: require(`${BASE_URL}SQL.png`),
}