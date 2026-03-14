import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { ActivityIndicator } from 'react-native-paper'
import { Alert } from 'react-native'
import PagerView from 'react-native-pager-view';
import { useNavigation } from '@react-navigation/native';
import { Questions, MyText } from '../../../../components'
import { commonStyle } from '../../../../styles'
import { defaultSetting } from '../../../../constants'
import useStore from '../../../../store'

const PAGER_STYLE = { flex: 1 }

const QuestionScreen = ({ route }) => {
  const { subtitleZH, subtitleEN, questionID, subjectEN, allQuestions } = route.params
  const swiperViewRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [questionList, setQuestionList] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const navigation = useNavigation()
  const getCachedQuestions = useStore((s) => s.getCachedQuestions)

  const initialPage = useMemo(
    () => questionList.findIndex(q => q.id === questionID),
    [questionList, questionID]
  )

  useEffect(() => {
    if (initialPage >= 0) setCurrentPage(initialPage)
  }, [initialPage])

  useEffect(() => {
    const getQuestionList = async () => {
      try {
        let questionAry = []
        setLoading(true)
        if (allQuestions && allQuestions.length > 0) {
          questionAry = allQuestions
        } else {
          questionAry = await getCachedQuestions(subtitleEN)
        }
        setQuestionList(questionAry)
      } catch (e) {
        Alert.alert(defaultSetting.errMsg)
        console.error('getQuestionList err: ', e)
      } finally {
        setLoading(false)
      }
    }
    getQuestionList()
  }, [])

  const handleSetPage = useCallback((index) => {
    swiperViewRef.current?.setPage(index)
  }, [])

  // 從收藏頁進入題目要可以瀏覽全部，然後換主題的時候 header 要跟著換
  const pageChange = useCallback((event) => {
    const position = event.nativeEvent.position
    setCurrentPage(position)
    if (allQuestions && allQuestions.length > 0) {
      const curQuestion = questionList[position]
      let showTitle = subtitleZH
      if (curQuestion && curQuestion.subtitleShow !== subtitleZH) {
        showTitle = curQuestion.subtitleShow
      }
      navigation.setOptions({
        headerTitle: () => (<MyText variant='headlineLarge'>{showTitle}</MyText>),
      })
    }
  }, [allQuestions, questionList, subtitleZH, navigation])

  if (loading) {
    return (
      <ActivityIndicator style={commonStyle.defaultLoading} size='large' />
    )
  }

  // 只渲染當前頁面及前後各一頁，大幅節省記憶體
  return (
    <PagerView style={PAGER_STYLE} ref={swiperViewRef} initialPage={initialPage}
      onPageSelected={pageChange} offscreenPageLimit={1}>
      {questionList.map((question, index) => (
        <Questions curQuestion={question} key={question.id} subtitleZH={subtitleZH}
          isActive={Math.abs(index - currentPage) <= 1}
          isFirst={index === 0}
          isLast={index === questionList.length - 1}
          pageIndex={index}
          ctrlMethod={handleSetPage} subjectEN={subjectEN}
        />
      ))}
    </PagerView>
  )
}

export default QuestionScreen
