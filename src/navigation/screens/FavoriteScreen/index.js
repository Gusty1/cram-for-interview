import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { View } from 'react-native'
import { ActivityIndicator, IconButton, HelperText } from 'react-native-paper'
import uuid from 'react-native-uuid'
import DragList from 'react-native-draglist'
import { useFocusEffect } from '@react-navigation/native';
import { getAllFavorite, getSettingData, setSettingData, deleteFavorite } from '../../../services'
import { MyText, FavoriteList, SubtitleFilterModal } from '../../../components'
import { commonStyle } from '../../../styles'
import useStore from '../../../store'
import { defaultSetting } from '../../../constants'

const FavoriteScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const [showSubtitleItems, setShowSubtitleItems] = useState([])
  const [filterModalShow, setFilterModalShow] = useState(false)
  // 集中管理各收藏 subtitle 的展開狀態，避免子組件重建時丟失
  const [expandedMap, setExpandedMap] = useState({})
  const { favoriteList, getFavoriteList, setting, getCachedQuestionsBatch } = useStore()
  const isDelRef = useRef(false)

  //取得收藏的完整資料，使用快取 + 批次查詢
  const getFavoriteListData = useCallback(async () => {
    setLoading(true)
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

    // 使用 Set 優化收藏比對：O(n) lookup
    const favoriteIdSet = new Set(allFavorites.map(f => f.questionID))

    // 批次查詢所有 subtitle 的問題（解決 N+1 問題）
    const subtitleENList = filterSubtitle.map(item => item.subtitle)
    const questionsMap = await getCachedQuestionsBatch(subtitleENList)

    //組合收藏ary的完整資訊
    const favoriteAry = filterSubtitle.map((item) => {
      let currentItem = item
      if (sortStr) {
        const findItem = sortStr.find(x => x.subtitle === item.subtitle)
        if (findItem) currentItem = { ...item, sort: findItem.sort }
      } else currentItem = { ...item, sort: 999 }

      const questions = (questionsMap[item.subtitle] || [])
        .filter(curQue => favoriteIdSet.has(curQue.id))
        .map((curQue) => ({
          ...curQue,
          favorite: true,
          subtitleShow: item.subtitleShow
        }))

      return {
        ...currentItem,
        id: uuid.v4(),
        image: defaultSetting.imageBaseUrl + item.subject + '/' + item.subtitle + '.png',
        show: true,
        questions
      }
    })

    favoriteAry.sort((a, b) => a.sort - b.sort)
    //組出過濾項目的ary
    const modelShowSubtitleItems = favoriteAry.map(item => ({
      id: uuid.v4(),
      en_name: item.subtitle,
      zh_name: item.subtitleShow,
      selected: false
    }))
    setShowSubtitleItems(modelShowSubtitleItems)
    setFavorites(favoriteAry)
    setLoading(false)
  }, [getCachedQuestionsBatch])

  useEffect(() => {
    getFavoriteListData()
  }, [favoriteList])

  useFocusEffect(
    useCallback(() => {
      // 螢幕失焦時：若有刪除操作，同步 store 狀態
      return () => {
        if (isDelRef.current) {
          getFavoriteList()
          isDelRef.current = false
        }
      }
    }, [getFavoriteList])
  )

  // useMemo 必須在所有 hooks 之後、條件 return 之前
  const allQuestions = useMemo(() => {
    const result = []
    favorites.forEach(item => result.push(...item.questions))
    return result
  }, [favorites])

  // 切換某個收藏 subtitle 的展開/收合
  const toggleExpand = useCallback((subtitle) => {
    setExpandedMap(prev => ({ ...prev, [subtitle]: !prev[subtitle] }))
  }, [])

  // 拖曳的組件渲染，補上拖曳方法
  const renderItem = useCallback(({ item, onDragStart, onDragEnd }) => {
    return (
      <FavoriteList
        navigation={navigation}
        favoriteSubtitle={item}
        delFavorite={delFavorite}
        allQuestions={allQuestions}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        expanded={!!expandedMap[item.subtitle]}
        toggleExpand={toggleExpand}
      />
    )
  }, [navigation, allQuestions, delFavorite, expandedMap, toggleExpand])

  // 過濾要顯示的選項
  const filterSubtile = useCallback((changeSubtitleItems) => {
    let changeFavorites = []
    // 如果沒有選副主題就顯示全部
    if (showSubtitleItems.length > 0 && !changeSubtitleItems.some((item) => item.selected)) {
      changeFavorites = favorites.map((item) => ({ ...item, show: true }))
    } else {
      changeFavorites = favorites.map((item) => {
        const show = changeSubtitleItems.some((x) => x.en_name === item.subtitle && x.selected)
        return { ...item, show }
      })
    }
    setFavorites(changeFavorites)
    setFilterModalShow(false)
  }, [showSubtitleItems, favorites])

  // 由於呼叫方法會整個刷新，所以先把資料刪除再去呼叫刪除方法
  const delFavorite = useCallback((subtitle, id) => {
    const newFavorites = favorites.map((item) => {
      if (item.subtitle === subtitle) {
        return { ...item, questions: item.questions.filter(x => x.id !== id) }
      }
      return item
    }).filter(item => item.questions.length > 0)
    isDelRef.current = true
    deleteFavorite(id)
    setFavorites(newFavorites)
  }, [favorites])

  // 移動後的回調方法，就是位置的切換
  const onReordered = useCallback((fromIndex, toIndex) => {
    // 拖曳的時候不知為啥有時 index 會超出範圍，這工具有 bug，所以增加判斷
    if (fromIndex < 0 || fromIndex > favorites.length - 1 ||
      toIndex < 0 || toIndex > favorites.length - 1) return
    const changeFavorites = [...favorites]
    const temp = changeFavorites[fromIndex]
    changeFavorites[fromIndex] = changeFavorites[toIndex]
    changeFavorites[toIndex] = temp
    // 寫入移動後的位置，不用 async 拖曳會卡卡的
    const writeSortSetting = async () => {
      if (changeFavorites && changeFavorites.length > 0 && setting) {
        const sortSrt = changeFavorites.map((item, index) => ({
          subtitle: item.subtitle,
          sort: index
        }))
        await setSettingData({
          ...setting,
          favoriteSortStr: JSON.stringify(sortSrt)
        })
      }
    }
    writeSortSetting()
    setFavorites(changeFavorites)
  }, [favorites, setting])

  const handleRefresh = useCallback(() => getFavoriteListData(), [getFavoriteListData])
  const handleFilterPress = useCallback(() => setFilterModalShow(true), [])

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
        onRefresh={handleRefresh}
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
        onPress={handleFilterPress}
        disabled={loading || favorites.length === 0}
      />
    </View>
  )
}

export default FavoriteScreen
