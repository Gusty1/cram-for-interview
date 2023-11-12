import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

import EnglishSentenceCard from '../components/EnglishSentenceCard'
import SubjectCube from '../components/SubjectCube'
import { change } from '../store/slices/favoriteSlices'
import { fetchFavoriteAll } from '../sqlLite/db'
import Styles from '../constants/Styles'
import { IUDOption } from '../awsDataOption/baseOption'

/*
  首頁螢幕，顯示英文句子和主題方塊
*/
export default function HomeScreen(props) {
  const dispatch = useDispatch()

  useEffect(() => {
    // IUDOption().then((data) => {
    //   console.log(data)
    // })
    async function getFavoriteData() {
      await fetchFavoriteAll().then((data) => {
        if (data.rows.length !== 0) {
          const favAry = data.rows._array.map((item) => item.question)
          dispatch(change(favAry))
        }
      })
    }
    getFavoriteData()
  }, [])

  return (
    <View style={{ ...Styles.defaultMainContainer }}>
      <EnglishSentenceCard {...props} />
      <SubjectCube {...props} />
    </View>
  )
}
