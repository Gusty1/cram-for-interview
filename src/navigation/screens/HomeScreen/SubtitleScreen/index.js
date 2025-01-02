import { useEffect, useState } from 'react'
import { View, FlatList } from 'react-native'
import { ActivityIndicator, IconButton } from 'react-native-paper'
import uuid from 'react-native-uuid'
import { SubtitleList, MyText, SubtitleFilterModal } from '../../../../components'
import { getSubtitles, getQuestions } from '../../../../services'
import { commonStyle } from '../../../../styles'
import useStore from '../../../../store'

//取得全部資料，並設定給originSubtitleList保存，這樣以後設定就不會重新query
const getSubtitleList = async (setLoading, setSubtitleList, setOriginSubtitleList, subjectEN) => {
  try {
    setLoading(true)
    let subtitles = await getSubtitles(subjectEN);
    //aws DynamoDB 不支援in，所以用Promise.all一次處理全部請求
    subtitles = await Promise.all(
      subtitles.map(async (item) => {
        const question = await getQuestions(item.en_name)
        question.sort((a, b) => b.useful - a.useful)
        return { ...item, questions: question }
      })
    )
    subtitles.sort((a, b) => a.en_name.localeCompare(b.en_name))
    setSubtitleList(subtitles)
    setOriginSubtitleList(subtitles)
  } catch (e) {
    console.error('getSubtitleList error: ', e)
  } finally {
    setLoading(false);
  }
}

const SubtitleScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false)
  const [subtitleList, setSubtitleList] = useState([])
  const [filterModalShow, setFilterModalShow] = useState(false)
  //控制過濾要顯示的subtitle
  const [showSubtitleItems, setShowSubtitleItems] = useState([])
  //我覺得每次過濾都要重新loading會爆炸，所以把第一次資料存起來
  const [originSubtitleList, setOriginSubtitleList] = useState([])
  const { favoriteList } = useStore()
  const { subjectEN } = route.params

  useEffect(() => {
    //初次載入取得全部資料
    getSubtitleList(setLoading, setSubtitleList, setOriginSubtitleList, subjectEN)
  }, [])

  useEffect(() => {
    const subtitleListSetFav = () => {
      if (subtitleList.length === 0) return;
      const addFavSubtitleList = subtitleList.map((item) => {
        item.questions = item.questions.map((x) => {
          if (favoriteList && favoriteList.some((y) => y.questionID === x.id)) {
            x.favorite = true
          } else {
            x.favorite = false
          }
          return x
        })
        return item
      })
      setSubtitleList(addFavSubtitleList)
    }
    subtitleListSetFav()
  }, [favoriteList, originSubtitleList])

  //過濾副主題並關閉modal
  const filterSubtile = () => {
    //如果沒有選副主題就顯示全部
    if (showSubtitleItems.length > 0 && !showSubtitleItems.some((item) => item.selected)) {
      setSubtitleList(originSubtitleList)
    } else {
      setSubtitleList(
        originSubtitleList.filter((item) => {
          if (showSubtitleItems.length > 0 && showSubtitleItems.some((x) => x.en_name === item.en_name && x.selected)) {
            return true
          } else {
            return false
          }
        })
      )
    }
    setFilterModalShow(false)
  }

  //由於狀態初值還沒取得資料，所以取得資料後再去更新要過濾的subtitle選項
  useEffect(() => {
    setShowSubtitleItems(
      subtitleList.map((item) => {
        return {
          id: uuid.v4(),
          en_name: item.en_name,
          zh_name: item.zh_name,
          selected: false
        }
      })
    )
  }, [originSubtitleList])

  //判斷有沒有資料
  const judgeSubtitleList = () => {
    if (subtitleList.length === 0) {
      return (
        <View style={commonStyle.defaultLoading}>
          <MyText
            style={{ textAlign: 'center', fontSize: 24, color: 'orange' }}
          >
            還沒有項目，歡迎提供
          </MyText>
        </View>
      )
    } else {
      return (
        <FlatList
          data={subtitleList}
          renderItem={({ item }) => (
            <SubtitleList navigation={navigation} subtitle={item} />
          )}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={() => getSubtitleList(setLoading, setSubtitleList, setOriginSubtitleList, subjectEN)}
        />
      )
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {loading ? (<ActivityIndicator size='large' style={commonStyle.defaultLoading} />) : (judgeSubtitleList())}
      <SubtitleFilterModal
        filterModalShow={filterModalShow}
        filterSubtile={filterSubtile}
        showSubtitleItems={showSubtitleItems}
        setShowSubtitleItems={setShowSubtitleItems}
      />
      <IconButton
        mode='contained'
        icon='filter-variant'
        size={30}
        style={commonStyle.rightBottomBtn}
        onPress={() => setFilterModalShow(true)}
        disabled={loading || subtitleList.length === 0}
      />
    </View>
  )
}

export default SubtitleScreen
