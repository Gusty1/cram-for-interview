import { useEffect, useState, useCallback } from 'react'
import { View } from 'react-native'
import { ActivityIndicator, IconButton, HelperText } from 'react-native-paper'
import uuid from 'react-native-uuid'
import DragList from 'react-native-draglist';
import { useFocusEffect } from '@react-navigation/native';
import { getAllFavorite, getQuestions, getSettingData, setSettingData, deleteFavorite } from '../../../services'
import { MyText, FavoriteList, SubtitleFilterModal } from '../../../components'
import { commonStyle } from '../../../styles'
import useStore from '../../../store'
import { defaultSetting } from '../../../constants'

//取得收藏的完整資料
const getFavoriteListData = async (setLoading, setFavorites, setShowSubtitleItems, setAllQuestions) => {
  setLoading(true)
  let allQuestions = []
  const allFavorites = await getAllFavorite()
  // 過濾不重複的subtitle
  const seen = new Set();
  const filterSubtitle = allFavorites.filter(item => {
    if (!seen.has(item.subtitle)) {
      seen.add(item.subtitle)
      return true
    }
    return false
  })
  const thisSetting = await getSettingData()
  let sortStr = null
  if (thisSetting.favoriteSortStr) sortStr = JSON.parse(thisSetting.favoriteSortStr)
  //組合收藏ary的完整資訊
  const favoriteAry = await Promise.all(
    filterSubtitle.map(async (item) => {
      let questions = await getQuestions(item.subtitle)
      if (sortStr) {
        const findItem = sortStr.find(x => x.subtitle === item.subtitle)
        if (findItem) item = { ...item, sort: findItem.sort }
      } else item = { ...item, sort: 999 }
      questions = questions
        .filter(curQue => allFavorites.some(curFav => curFav.questionID === curQue.id))
        .map((curQue) => {
          return {
            ...curQue,
            favorite: true,
            subtitleShow: item.subtitleShow
          }
        })
      allQuestions = [...questions, ...allQuestions]
      return {
        ...item,
        id: uuid.v4(),
        image: defaultSetting.imageBaseUrl + item.subject + '/' + item.subtitle + '.png',
        show: true,
        questions
      }
    })
  )
  favoriteAry.sort((a, b) => a.sort - b.sort)
  //組出過濾項目的ary
  const modelShowSubtitleItems = favoriteAry.map(item => (
    {
      id: uuid.v4(),
      en_name: item.subtitle,
      zh_name: item.subtitleShow,
      selected: false
    }
  ))
  setShowSubtitleItems(modelShowSubtitleItems)
  setFavorites(favoriteAry)
  //TODO 從收藏list進入問題詳細頁，問題的排序會不太一樣...
  setAllQuestions(allQuestions)
  setLoading(false)
}

const FavoriteScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const [allQuestions, setAllQuestions] = useState([])
  const [showSubtitleItems, setShowSubtitleItems] = useState([])
  const [filterModalShow, setFilterModalShow] = useState(false)
  const { favoriteList, getFavoriteList } = useStore()

  useEffect(() => {
    getFavoriteListData(setLoading, setFavorites, setShowSubtitleItems, setAllQuestions)
  }, [favoriteList])

  useFocusEffect(
    useCallback(() => {
      //進入螢幕焦點的事件...

      // 螢幕失焦要做的事，由於刪除收藏沒有呼叫store，切換到其它到地方仍然會維持原樣，所以離開本螢幕時重新呼叫store
      return () => {
        getFavoriteList()
      }
    }, [])
  )

  if (loading) {
    return <ActivityIndicator style={commonStyle.defaultLoading} size={'large'} />
  }

  if (favorites.length === 0) {
    return (
      <View style={{ flex: 1, alignSelf: "center", justifyContent: 'center' }}>
        <MyText style={commonStyle.noDataMsg}>還沒有任何收藏的題目</MyText>
      </View>
    )
  }

  //拖曳的組件渲染，補上拖曳方法
  const renderItem = ({ item, onDragStart, onDragEnd }) => {
    return (
      <FavoriteList
        navigation={navigation}
        favoriteSubtitle={item}
        allQuestions={allQuestions}
        delFavorite={delFavorite}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    )
  }

  //過濾要顯示的選項
  const filterSubtile = (changeSubtitleItems) => {
    let changeFavorites = []
    //如果沒有選副主題就顯示全部
    if (showSubtitleItems.length > 0 && !changeSubtitleItems.some((item) => item.selected)) {
      changeFavorites = favorites.map((item) => ({ ...item, show: true }))
    } else {
      changeFavorites = favorites.map((item) => {
        if (changeSubtitleItems.some((x) => x.en_name === item.subtitle && x.selected)) {
          item.show = true
        } else {
          item.show = false
        }
        return item
      })
    }
    setFavorites(changeFavorites)
    setFilterModalShow(false)
  }

  //由於呼叫方法會整個刷新，所以先把資料刪除再去呼叫刪除方法
  const delFavorite = (subtitle, id) => {
    //過濾掉list的項目
    const newFavorites = favorites.map((item) => {
      if (item.subtitle === subtitle) {
        item.questions = item.questions.filter(x => x.id !== id)
      }
      return item
    }).filter(item => item.questions.length > 0)
    deleteFavorite(id)
    //全部收藏的題目過濾掉該問題
    const tampAllQuestions = allQuestions.filter(que => que.id !== id)
    setAllQuestions(tampAllQuestions)
    setFavorites(newFavorites)
  }

  //移動後的回調方法，就是位置的切換
  const onReordered = (fromIndex, toIndex) => {
    //拖曳的時候不知為啥有時index會超出範圍，這工具有bug阿，所以增加判斷
    if (fromIndex < 0 || fromIndex > favorites.length - 1 ||
      toIndex < 0 || toIndex > favorites.length - 1) return
    //我把換過的位置設定檔寫入setting裡面
    const changeFavorites = [...favorites]
    const temp = changeFavorites[fromIndex]
    changeFavorites[fromIndex] = changeFavorites[toIndex]
    changeFavorites[toIndex] = temp
    setFavorites(changeFavorites)
    //寫入移動後的位置
    if (favorites && favorites.length > 0 && setting) {
      const sortSrt = favorites.map((item, index) => {
        return {
          subtitle: item.subtitle,
          sort: index
        }
      })
      setSettingData({
        ...setting,
        favoriteSortStr: JSON.stringify(sortSrt)
      })
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <HelperText type="info" visible={true}>
        <MyText style={{ textAlign: 'center' }}>每個項目可以長按拖曳移動位置</MyText>
      </HelperText>
      <DragList
        style={{ height: "100%" }}
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onReordered={onReordered}
        refreshing={loading}
        onRefresh={() => getFavoriteListData(setLoading, setFavorites, setShowSubtitleItems, setAllQuestions)}
      />
      <SubtitleFilterModal
        filterModalShow={filterModalShow}
        filterSubtile={filterSubtile}
        showSubtitleItems={showSubtitleItems}
      />
      <IconButton
        style={commonStyle.rightBottomBtn}
        mode="contained-tonal"
        iconColor='#6b4faa'
        size={30}
        icon="filter-variant"
        onPress={() => setFilterModalShow(true)}
        disabled={loading || favorites.length === 0}
      />
    </View>
  )
}

export default FavoriteScreen