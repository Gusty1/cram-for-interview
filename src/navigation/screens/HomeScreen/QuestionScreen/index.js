import { useEffect, useState, useRef } from 'react';
import { ActivityIndicator } from 'react-native-paper'
import uuid from 'react-native-uuid';
import PagerView from 'react-native-pager-view';
import { getQuestions } from '../../../../services'
import { Questions } from '../../../../components'
import { commonStyle } from '../../../../styles'

const QuestionScreen = ({ route }) => {
  const { subtitleEN, questionID } = route.params
  const swiperViewRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [questionList, setQuestionList] = useState([])

  useEffect(() => {
    const getQuestionList = async () => {
      try {
        setLoading(true)
        const questionAry = await getQuestions(subtitleEN)
        questionAry.sort((a, b) => b.useful - a.useful)
        setQuestionList(questionAry)
      } catch (e) {
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

  return loading ? <ActivityIndicator style={commonStyle.defaultLoading} size='large' /> :
    (<PagerView style={{ flex: 1 }} ref={swiperViewRef} initialPage={questionList.findIndex(q => q.id === questionID)}>
      {questionList.map((question, index) => {
        return <Questions curQuestion={question} key={uuid.v4()}
          swiperObj={{ left: index === 0, right: index === questionList.length - 1, index }}
          ctrlMethod={{ onRightSwiper, onLeftSwiper }}
        />
      })}
    </PagerView>)
};

export default QuestionScreen
