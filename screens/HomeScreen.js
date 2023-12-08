import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

import EnglishSentenceCard from '../components/EnglishSentenceCard'
import SubjectCube from '../components/SubjectCube'
import { change } from '../store/slices/favoriteSlices'
import { fetchFavoriteAll } from '../sqlLite/db'
import Styles from '../constants/Styles'
import { errorHandler } from '../tools/OtherTool'
import { IUDOption } from '../awsDataOption/baseOption'

/*
  首頁螢幕，顯示英文句子和主題方塊
*/
export default function HomeScreen(props) {
  const dispatch = useDispatch()

  useEffect(() => {
    // IUDOption()
    //   .then((data) => {
    //     console.log(data)
    //   })
    //   .catch((err) => {
    //     errorHandler(err)
    //   })
    async function getFavoriteData() {
      await fetchFavoriteAll()
        .then((data) => {
          if (data.rows.length !== 0) {
            const favAry = data.rows._array.map((item) => item.questionId)
            dispatch(change(favAry))
          }
        })
        .catch((err) => {
          errorHandler(err)
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
