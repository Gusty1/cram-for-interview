import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { Card } from '@rneui/themed'

import MyText from './MyText'
import { baseGetInstance } from '../tools/MyAxiosInstance'
import Styles from '../constants/Styles'

/*
  首頁的英文句子組件
*/
export default function EnglishSentenceCard () {
  const [engSentence, setEngSentence] = useState('')
  useEffect(() => {
    baseGetInstance
      .get(
        'https://gusty1.github.io/Database/cramForInterview/englishSentence.json'
      )
      .then((response) => {
        const sentenceResultSet = response.data.englishSentence
        let randomNumber = Math.floor(Math.random() * sentenceResultSet.length)
        setEngSentence(sentenceResultSet[randomNumber])
      })
  }, [])

  return (
    <Card containerStyle={styles.englishCard}>
      {engSentence === '' ? (
        <ActivityIndicator size="large" />
      ) : (
        <View>
          <MyText style={styles.sentenceStyle}>{engSentence.sentence}</MyText>
          <MyText style={styles.authorStyle}>—{engSentence.author}</MyText>
        </View>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  englishCard: {
    ...Styles.defaultBorder,
    ...Styles.defaultShadow
  },
  sentenceStyle: {
    fontSize: 18,
  },
  authorStyle: {
    color: '#5B5B5B',
    textAlign: 'right',
    paddingTop: 5,
  },
})
