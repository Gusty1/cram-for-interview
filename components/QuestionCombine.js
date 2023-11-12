import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from 'react-native'
import { SpeedDial, Dialog, Input, Button } from '@rneui/themed'
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { API, graphqlOperation } from 'aws-amplify'
import { useDispatch, useSelector } from 'react-redux'

import { createQuestionReport } from '../src/graphql/mutations'
import { listQuestions } from '../src/graphql/queries'
import {
  insertFavorite,
  fetchFavorite,
  deleteFavorite,
  fetchFavoriteAll,
} from '../sqlLite/db'
import MyText from '../components/MyText'
import Colors from '../constants/Colors'
import { change } from '../store/slices/favoriteSlices'
import moment from 'moment'
import 'moment/locale/zh-tw'

/*
  問題答案詳細頁+錯誤回報+加入收藏
*/

export default function QuestionCombine(props) {
  const favoriteAry = useSelector((state) => state.favoriteAry.value)
  const dispatch = useDispatch()

  const id = props.route.params.id
  const question = props.route.params.question
  const [answer, setAnswer] = useState('')
  const [openButton, setOpenButton] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [reportMsg, setReportMsg] = useState('')
  const [isLoad, setIsLoad] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  //儲存錯誤訊息
  const reportMsgHandler = (text) => {
    setReportMsg(text)
  }

  // 送出錯誤訊息
  const sendReportMsg = async () => {
    if (reportMsg.trim() === '') {
      Alert.alert('請填寫錯誤訊息!', '', [], {
        cancelable: true,
      })
      return
    }
    setIsLoad(true)
    await API.graphql(
      graphqlOperation(createQuestionReport, {
        input: {
          questionId: id,
          question: question,
          errorMsg: reportMsg,
          createDate: moment().format('YYYY/MM/DD HH:mm:ss (dd)'),
          updateDate: moment().format('YYYY/MM/DD HH:mm:ss (dd)'),
          checkResult: '審核中',
          failReason: '',
          remark: '',
        },
      })
    ).then(() => {
      Alert.alert('送出成功!', '感謝你的回報。', [], {
        cancelable: true,
      })
      Keyboard.dismiss()
      setOpenDialog(false)
      setIsLoad(false)
    })
  }

  //新增或取消收藏 呼叫redux改變狀態
  async function favoriteChangeHandler() {
    await fetchFavoriteAll().then((data) => {
      const favAry = data.rows._array.map((item) => item.question)
      dispatch(change(favAry))
    })
  }

  // 檢查收藏是否取消或存在
  useEffect(() => {
    async function querySql() {
      await fetchFavorite(question).then((dbResult) => {
        if (dbResult.rows.length === 1) setIsFavorite(true)
        else setIsFavorite(false)
      })
    }
    querySql()
  }, [favoriteAry])

  //用問題查詢答案
  useEffect(() => {
    ;(async function getQuestion() {
      await API.graphql(
        graphqlOperation(listQuestions, {
          filter: {
            and: [{ isShow: { eq: true }, question: { eq: question } }],
          },
        })
      ).then((response) => {
        const questionAry = response.data.listQuestions.items
        if (questionAry.length > 0) setAnswer(questionAry[0].answer)
      })
    })()
  }, [])

  return (
    <>
      <View style={styles.questionArea}>
        <MyText style={styles.questionFont}>{question}</MyText>
      </View>
      <ScrollView style={styles.answerArea}>
        <MyText style={styles.answerFont}>
          {answer === '' ? <ActivityIndicator size="large" /> : answer}
        </MyText>
      </ScrollView>
      <SpeedDial
        isOpen={openButton}
        icon={<Entypo name="dots-three-vertical" size={24} color={'white'} />}
        openIcon={{ name: 'close', color: 'white' }}
        onOpen={() => setOpenButton(!openButton)}
        onClose={() => setOpenButton(!openButton)}
        color={Colors.SpeedDialColor}>
        <SpeedDial.Action
          icon={<MaterialIcons name="error" size={20} color="white" />}
          title="錯誤回報"
          onPress={() => {
            setOpenDialog(!openDialog)
            setOpenButton(!openButton)
          }}
          color={Colors.SpeedDialColor}
        />
        {isFavorite ? (
          <SpeedDial.Action
            icon={
              <Ionicons name="heart" size={20} color={Colors.FavoriteColor} />
            }
            title="取消收藏"
            onPress={async () => {
              await deleteFavorite(question).then(() => {
                setIsFavorite(false)
                favoriteChangeHandler()
              })
            }}
            color={Colors.SpeedDialColor}
          />
        ) : (
          <SpeedDial.Action
            icon={<Ionicons name="heart-outline" size={20} color="white" />}
            title="加入收藏"
            onPress={async () => {
              await insertFavorite(question).then(() => {
                setIsFavorite(true)
                favoriteChangeHandler()
              })
            }}
            color={Colors.SpeedDialColor}
          />
        )}
      </SpeedDial>
      <Dialog
        isVisible={openDialog}
        onBackdropPress={() => {
          if (openDialog && isLoad) return setOpenDialog(true)
          else return setOpenDialog(!openDialog)
        }}>
        <View style={styles.reportMargin}>
          <MyText>
            請描述錯誤問題，可以打字，也可以貼網址，總之就是有辦法說明錯誤都可以。
          </MyText>
        </View>
        <View style={styles.reportMargin}>
          <Input
            placeholder="說明錯誤問題"
            value={reportMsg}
            leftIcon={<MaterialIcons name="error" size={20} color="black" />}
            onChangeText={reportMsgHandler}
          />
        </View>

        <Button
          size="sm"
          onPress={sendReportMsg}
          loading={isLoad}
          disabled={isLoad}>
          送出
        </Button>
      </Dialog>
    </>
  )
}

const styles = StyleSheet.create({
  questionArea: {
    backgroundColor: 'yellow',
    marginBottom: 20,
  },
  questionFont: {
    paddingHorizontal: 10,
    fontSize: 22,
  },
  answerArea: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: '4%',
  },
  answerFont: {
    fontSize: 16,
    padding: 15,
  },
  reportMargin: {
    marginTop: 10,
  },
})
