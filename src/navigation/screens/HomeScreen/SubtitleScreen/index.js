import { useEffect, useState } from 'react'
import { View, Alert } from 'react-native'
import { ActivityIndicator, IconButton, HelperText } from 'react-native-paper'
import DragList from 'react-native-draglist';
import uuid from 'react-native-uuid'
import { SubtitleList, MyText, SubtitleFilterModal } from '../../../../components'
import { getSubtitles, getQuestions, getSubtitleSort, insertSubtitleSort } from '../../../../services'
import { commonStyle } from '../../../../styles'
import { defaultSetting } from '../../../../constants'
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
    //如果本地有排序紀錄，照本的排序，沒有就照名字排
    const sortList = await getSubtitleSort(subjectEN)
    if (sortList && sortList.length > 0) subtitles = disposeSort(subtitles, sortList)
    else subtitles.sort((a, b) => a.en_name.localeCompare(b.en_name))
    setSubtitleList(subtitles)
    setOriginSubtitleList(subtitles)
  } catch (e) {
    Alert(defaultSetting.errMsg)
    console.error('getSubtitleList error: ', e)
  } finally {
    setLoading(false);
  }
}

//處理預設排序，順序對得上就照指定順序排，對不上就排在最後面
const disposeSort = (subtitles, sortList) => {
  const ary = JSON.parse(sortList[0].subtitleJsonAry)
  const result = ary.map(item => {
    const foundObj = subtitles.find(obj => obj.en_name === item.subtitle);
    // 如果找到則返回對象，否則返回null
    return foundObj ? { ...foundObj, sort: item.sort } : null;
  })
    .filter(Boolean)  // 過濾掉null值
    .sort((a, b) => a.sort - b.sort); // 根據sort排序

  return result
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
          return {
            ...x,
            favorite: favoriteList?.some((y) => y.questionID === x.id) || false,
          }
        })
        return item
      })
      setSubtitleList(addFavSubtitleList)
    }
    subtitleListSetFav()
  }, [favoriteList, originSubtitleList])

  //過濾副主題並關閉modal
  const filterSubtile = (changeSubtitleItems) => {
    //如果沒有選副主題就顯示全部
    if (showSubtitleItems.length > 0 && !changeSubtitleItems.some((item) => item.selected)) {
      setSubtitleList(originSubtitleList)
    } else {
      setSubtitleList(
        originSubtitleList.filter((item) => {
          if (showSubtitleItems.length > 0 && changeSubtitleItems.some((x) => x.en_name === item.en_name && x.selected)) {
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

  //拖曳的組件渲染，補上拖曳方法
  const renderItem = ({ item, onDragStart, onDragEnd }) => {
    return (
      <SubtitleList
        navigation={navigation}
        subtitle={item}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        subjectEN={subjectEN}
      />
    )
  }

  //移動後的回調方法，就是位置的切換
  const onReordered = (fromIndex, toIndex) => {
    //拖曳的時候不知為啥有時index會超出範圍，這工具有bug阿，所以增加判斷
    if (fromIndex < 0 || fromIndex > subtitleList.length - 1 ||
      toIndex < 0 || toIndex > subtitleList.length - 1) return

    const changeSubtileList = [...subtitleList]
    const temp = changeSubtileList[fromIndex]
    changeSubtileList[fromIndex] = changeSubtileList[toIndex]
    changeSubtileList[toIndex] = temp
    setSubtitleList(changeSubtileList)
    //寫入移動後的位置
    if (subtitleList && subtitleList.length > 0) {
      insertSubtitleSort(subjectEN, JSON.stringify(changeSubtileList.map((item, index) => {
        return {
          subtitle: item.en_name,
          sort: index
        }
      })))
    }
  }

  //判斷有沒有資料
  const judgeSubtitleList = () => {
    if (subtitleList.length === 0) {
      return (
        <View style={commonStyle.defaultLoading}>
          <MyText style={commonStyle.noDataMsg}>
            還沒有項目，歡迎提供
          </MyText>
        </View>
      )
    } else {
      return (
        <>
          <HelperText type="info" visible={true}>
            <MyText style={{ textAlign: 'center' }}>每個項目可以長按拖曳移動位置</MyText>
          </HelperText>
          <DragList
            style={{ height: "100%" }}
            data={subtitleList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onReordered={onReordered}
            refreshing={loading}
            onRefresh={() => getSubtitleList(setLoading, setSubtitleList, setOriginSubtitleList, subjectEN)}
          />
        </>
      )
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {loading ? (<ActivityIndicator size='large' style={commonStyle.defaultLoading} />) :
        (judgeSubtitleList())}
      <SubtitleFilterModal
        filterModalShow={filterModalShow}
        filterSubtile={filterSubtile}
        showSubtitleItems={showSubtitleItems}
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
