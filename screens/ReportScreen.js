import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native'
import { Input, Button } from '@rneui/themed'
import { API, graphqlOperation } from 'aws-amplify'

import MyText from '../components/MyText'
import Styles from '../constants/Styles'
import { createOpinion } from '../src/graphql/mutations'
import moment from 'moment'
import 'moment/locale/zh-tw'

export default function ReportScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [opinion, setOpinion] = useState('')

  //接收意見內容
  function opinionHandler(text) {
    setOpinion(text)
  }

  //送出意見
  async function sendOpinion() {
    if (opinion === '') {
      Alert.alert('請輸入意見', '', [], {
        cancelable: true,
      })
      return
    }
    setIsLoading(true)
    await API.graphql(
      graphqlOperation(createOpinion, {
        input: {
          opinion: opinion,
          checkResult: '審核中',
          createDate: moment().format('YYYY/MM/DD HH:mm:ss (dd)'),
          updateDate: moment().format('YYYY/MM/DD HH:mm:ss (dd)'),
          failReason: '',
          remark: '',
        },
      })
    ).then(() => {
      Alert.alert('送出成功!', '感謝你的意見。', [], {
        cancelable: true,
      })
      setIsLoading(false)
      setOpinion('')
      Keyboard.dismiss()
    })
  }

  return (
    <View style={Styles.defaultMainContainer}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.contentContainer}>
          <MyText style={styles.desText}>您寶貴的意見是我進步的動力!</MyText>
          <Input
            placeholder="請輸入意見"
            onChangeText={opinionHandler}
            value={opinion}
          />
          <Button
            title="送出"
            disabled={isLoading}
            loading={isLoading}
            onPress={sendOpinion}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 5,
    margin: 15,
    backgroundColor: 'rgba(103,255,193,0.4)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C2C287',
  },
  desText: {
    color: '#FFA042',
    marginVertical: 30,
    fontSize: 20,
    textAlign: 'center',
  },
})
