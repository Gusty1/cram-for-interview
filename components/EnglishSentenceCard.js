import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { Card, Button } from '@rneui/themed'
import { EvilIcons } from '@expo/vector-icons'

import MyText from './MyText'
import { baseGetInstance } from '../tools/MyAxiosInstance'
import Styles from '../constants/Styles'

/*
  首頁的英文句子組件
*/
export default function EnglishSentenceCard() {
  const [engSentence, setEngSentence] = useState('')
  const [sentenceChange, setSentenceChange] = useState(false)

  useEffect(() => {
    //query英文句子
    baseGetInstance
      .get(
        'https://gusty1.github.io/Database/cramForInterview/englishSentence.json'
      )
      .then((response) => {
        const sentenceResultSet = response.data.englishSentence
        let randomNumber = Math.floor(Math.random() * sentenceResultSet.length)
        setEngSentence(sentenceResultSet[randomNumber])
      })
  }, [sentenceChange])

  //刷新英文句子
  function refreshSentence() {
    setSentenceChange(!sentenceChange)
  }

  return (
    <Card containerStyle={styles.englishCard}>
      <View style={styles.sentenceContainer}>
        <MyText style={styles.sentenceTitle}>每日一句:</MyText>
        <Button size="sm" type="clear" onPress={refreshSentence}>
          <EvilIcons name="refresh" size={25} color="#0080FF" />
        </Button>
      </View>
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
    ...Styles.defaultShadow,
  },
  sentenceStyle: {
    fontSize: 18,
  },
  authorStyle: {
    color: '#5B5B5B',
    textAlign: 'right',
    paddingTop: 5,
  },
  sentenceContainer: {
    flexDirection: 'row',
  },
  sentenceTitle: {
    fontSize: 16,
  },
})
