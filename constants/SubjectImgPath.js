const BASE_URL = '../assets/images/subjects/'

/*
  因為本地圖片require不能用變數，所以要先包起來
  這是標題的背景圖片
*/
export default {
  code: require(`${BASE_URL}code.png`),
  design: require(`${BASE_URL}design.png`),
  mechanical: require(`${BASE_URL}mechanical.png`),
}