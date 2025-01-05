import { useEffect, useState } from 'react'
import { View, Alert } from 'react-native'
import { IconButton } from 'react-native-paper'
import MyText from '../MyComponents/MyText'
import { defaultSetting } from '../../constants'
import { apiClient } from '../../services'
import { homeStyle } from '../../styles'

const getSentenceAry = async (setSentenceObj) => {
  try {
    const response = await apiClient.get(defaultSetting.sentenceUrl)
    if (response && response.length > 0) {
      const randomSentenceNum = Math.floor(Math.random() * response.length)
      setSentenceObj(response[randomSentenceNum])
    }
  } catch (e) {
    Alert(defaultSetting.errMsg)
    console.log('getSentenceAry error', e)
  }
}

//每日一句的組件
const Sentence = () => {
  const [sentenceObj, setSentenceObj] = useState(null)

  useEffect(() => {
    getSentenceAry(setSentenceObj)
  }, [])

  if (!sentenceObj) return null

  return (
    <View style={homeStyle.sentenceContainer}>
      <View style={homeStyle.sentenceRow}>
        <MyText style={{ padding: 0, margin: 0 }}>每日一句：</MyText>
        <IconButton
          icon='reload'
          mode='contained-tonal'
          size={16}
          onPress={() => getSentenceAry(setSentenceObj)}
        />
      </View>
      <View>
        <MyText >{sentenceObj.sentence}</MyText>
        <MyText style={{ textAlign: 'right' }}>—{sentenceObj.author}</MyText>
      </View>
    </View>
  )
}

export default Sentence
