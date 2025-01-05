import { useEffect, useState, useRef } from 'react';
import { ActivityIndicator } from 'react-native-paper'
import { Alert } from 'react-native'
import uuid from 'react-native-uuid';
import PagerView from 'react-native-pager-view';
import { useNavigation } from '@react-navigation/native';
import { getQuestions } from '../../../../services'
import { Questions, MyText } from '../../../../components'
import { commonStyle } from '../../../../styles'
import { defaultSetting } from '../../../../constants'

const QuestionScreen = ({ route }) => {
  const { subtitleZH, subtitleEN, questionID, subjectEN, allQuestions } = route.params
  const swiperViewRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [questionList, setQuestionList] = useState([])
  const navigation = useNavigation();

  useEffect(() => {
    const getQuestionList = async () => {
      try {
        let questionAry = []
        setLoading(true)
        if (allQuestions && allQuestions.length > 0) {
          questionAry = allQuestions
        } else {
          questionAry = await getQuestions(subtitleEN)
          questionAry.sort((a, b) => b.useful - a.useful)
        }
        setQuestionList(questionAry)
      } catch (e) {
        Alert(defaultSetting.errMsg)
        console.error('getQuestionList err: ', e)
      } finally {
        setLoading(false)
      }
    }
    getQuestionList()
  }, [])

  const onRightSwiper = (index) => {
    swiperViewRef.current?.setPage(index)
  }
  const onLeftSwiper = (index) => {
    swiperViewRef.current?.setPage(index)
  }

  //從收藏頁進入題目要可以瀏覽全部，然後換主題的時候header要跟著換
  const pageChange = (event) => {
    if (allQuestions && allQuestions.length > 0) {
      const curQuestion = questionList[event.nativeEvent.position]
      let showTitle = subtitleZH
      if (curQuestion && curQuestion.subtitleShow !== subtitleZH) {
        showTitle = curQuestion.subtitleShow
      }
      navigation.setOptions({
        headerTitle: () => (<MyText variant='headlineLarge'>{showTitle}</MyText>),
      })
    }
  }

  return loading ? <ActivityIndicator style={commonStyle.defaultLoading} size='large' /> :
    (<PagerView style={{ flex: 1 }} ref={swiperViewRef} initialPage={questionList.findIndex(q => q.id === questionID)}
      onPageSelected={pageChange}>
      {questionList.map((question, index) => {
        return <Questions curQuestion={question} key={uuid.v4()} subtitleZH={subtitleZH}
          swiperObj={{ left: index === 0, right: index === questionList.length - 1, index }}
          ctrlMethod={{ onRightSwiper, onLeftSwiper }} subjectEN={subjectEN}
        />
      })}
    </PagerView>)
};

export default QuestionScreen
