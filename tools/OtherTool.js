/*
 * 陣列物件過濾重復，originalArray:物件陣列，prop:要過濾的key值
*/
export function removeDuplicates (originalArray, prop) {
  let newArray = []
  let lookupObject = {}
  for (let i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i]
  }
  for (let i in lookupObject) {
    newArray.push(lookupObject[i])
  }
  return newArray
}

/*
 * 隨機產生顏色，透明度要自己傳參數
*/
export function randomColor (opacity) {
  let color1 = Math.floor(Math.random() * 255)
  let color2 = Math.floor(Math.random() * 255)
  let color3 = Math.floor(Math.random() * 255)
  if (opacity !== null || opacity !== '') {
    return 'rgba(' + color1 + ',' + color2 + ',' + color3 + ',' + opacity + ')'
  } else {
    return 'rgb(' + color1 + ',' + color2 + ',' + color3 + ')'
  }
}

//錯誤處理
export function errorHandler (err) {
  //console.log(err)
  alert('發生了點問題!')
}