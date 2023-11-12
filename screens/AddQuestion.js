import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
} from 'react-native'
import { Input, Button } from '@rneui/themed'
import { API, graphqlOperation } from 'aws-amplify'
import moment from 'moment'
import 'moment/locale/zh-tw'

import MyText from '../components/MyText'
import Styles from '../constants/Styles'
import { createNewQuestion } from '../src/graphql/mutations'

export default function AddQuestion() {
  const [isLoading, setIsLoading] = useState(false)
  const [subject, setSubject] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  //接收各項問題的輸入
  function subjectHandler(text) {
    setSubject(text)
  }
  function subtitleHandler(text) {
    setSubtitle(text)
  }
  function questionHandler(text) {
    setQuestion(text)
  }
  function answerHandler(text) {
    setAnswer(text)
  }

  //送出新問題
  async function sendQuestion() {
    if (subject.trim() === '' || question.trim() === '') {
      Alert.alert('請輸入主題和問題', '', [], {
        cancelable: true,
      })
      return
    }
    setIsLoading(true)
    await API.graphql(
      graphqlOperation(createNewQuestion, {
        input: {
          subject: subject,
          subtitle: subtitle,
          question: question,
          answer: answer,
          checkResult: '審核中',
          failReason: '',
          createDate: moment().format('YYYY/MM/DD HH:mm:ss (dd)'),
          updateDate: moment().format('YYYY/MM/DD HH:mm:ss (dd)'),
          remark: '',
        },
      })
    ).then(() => {
      Alert.alert('送出成功!', '我們將會盡快審核。', [], {
        cancelable: true,
      })
      setIsLoading(false)
      setSubject('')
      setSubtitle('')
      setQuestion('')
      setAnswer('')
      Keyboard.dismiss()
    })
  }

  return (
    <View style={Styles.defaultMainContainer}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.titleContent}>
            <MyText style={styles.titleFont}>
              <MyText style={styles.mustSing}>*</MyText>主題
            </MyText>
          </View>
          <Input
            placeholder="程式、機械..."
            value={subject}
            onChangeText={subjectHandler}
          />

          <View style={styles.titleContent}>
            <MyText style={styles.titleFont}>副主題</MyText>
            <MyText style={styles.hintFont}>
              以程式為例，程式有Java、Python...，若不寫的話將交由我們判斷
            </MyText>
          </View>
          <Input
            placeholder="請輸入副主題"
            value={subtitle}
            onChangeText={subtitleHandler}
          />

          <View style={styles.titleContent}>
            <MyText style={styles.titleFont}>
              <MyText style={styles.mustSing}>*</MyText>問題
            </MyText>
            <MyText style={styles.hintFont}>
              可以貼網址...等，其他有辦法說明問題的手段都可以
            </MyText>
          </View>
          <Input
            placeholder="請輸入問題"
            value={question}
            onChangeText={questionHandler}
          />

          <View style={styles.titleContent}>
            <MyText style={styles.titleFont}>解答</MyText>
            <MyText style={styles.hintFont}>
              若問題有包含解答的話可以不用輸入
            </MyText>
          </View>
          <Input
            placeholder="解答請盡可能說明詳細"
            value={answer}
            onChangeText={answerHandler}
          />

          <Button
            title="送出"
            disabled={isLoading}
            loading={isLoading}
            onPress={sendQuestion}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 5,
    margin: 15,
    backgroundColor: 'rgba(255,238,64,0.4)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A3D1D1',
  },
  mustSing: {
    color: '#FF0000',
  },
  titleFont: {
    fontSize: 20,
  },
  titleContent: {
    paddingHorizontal: 10,
  },
  hintFont: {
    color: '#9D9D9D',
  },
})
