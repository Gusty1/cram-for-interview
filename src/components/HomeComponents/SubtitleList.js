import { useState, useMemo, useCallback } from 'react'
import { Image, StyleSheet } from 'react-native'
import { List, Divider, IconButton } from 'react-native-paper'
import { Fontisto } from '@expo/vector-icons'
import { defaultSetting } from '../../constants'
import MyText from '../MyComponents/MyText'
import useStore from '../../store'

const FALLBACK_IMAGE = require('../../assets/images/notFound.png')

/** 子項目的 Accordion List */
const SubtitleList = ({ navigation, subtitle, onDragStart, onDragEnd, subjectEN, expanded, toggleExpand }) => {
  const [error, setError] = useState(false)
  const { en_name, zh_name, image, questions } = subtitle
  const { addFavorite, deleteFavorite } = useStore()

  // 使用 useMemo 產生排序後的新陣列，避免直接 mutate props
  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => b.useful - a.useful),
    [questions]
  )

  const handleImageError = useCallback(() => setError(true), [])
  const handleToggleExpand = useCallback(() => toggleExpand(en_name), [toggleExpand, en_name])

  const renderLeft = useCallback((props) => (
    <Image
      source={error ? FALLBACK_IMAGE : { uri: image }}
      style={[props.style, styles.accordionImage]}
      onError={handleImageError}
    />
  ), [error, image, handleImageError])

  const description = sortedQuestions.length === 0
    ? <MyText style={styles.descText}>還沒有題目，歡迎提供</MyText>
    : <MyText style={styles.descText}>共{sortedQuestions.length}題</MyText>

  return (
    <>
      <List.Accordion
        title={<MyText>{zh_name}</MyText>}
        titleStyle={styles.titleStyle}
        expanded={expanded}
        onPress={handleToggleExpand}
        onLongPress={onDragStart}
        onPressOut={onDragEnd}
        description={description}
        left={renderLeft}
      >
        {sortedQuestions.map((item) => (
          <SubtitleListItem
            key={item.id}
            item={item}
            navigation={navigation}
            en_name={en_name}
            zh_name={zh_name}
            subjectEN={subjectEN}
            addFavorite={addFavorite}
            deleteFavorite={deleteFavorite}
          />
        ))}
      </List.Accordion>
      <Divider />
    </>
  )
}

/** 單一題目列表項目 - 抽出避免父層 re-render 時重建 inline functions */
const SubtitleListItem = ({ item, navigation, en_name, zh_name, subjectEN, addFavorite, deleteFavorite }) => {
  const handlePress = useCallback(() => {
    navigation.navigate('QuestionScreen', {
      questionID: item.id,
      subtitleEN: en_name,
      subtitleZH: zh_name,
      subjectEN
    })
  }, [navigation, item.id, en_name, zh_name, subjectEN])

  const handleFavoritePress = useCallback(() => {
    if (item.favorite) deleteFavorite(item.id)
    else addFavorite(en_name, zh_name, subjectEN, item.id)
  }, [item.favorite, item.id, en_name, zh_name, subjectEN, addFavorite, deleteFavorite])

  const isHot = item.useful > defaultSetting.hotUsefulCount

  const renderLeft = useCallback((props) => (
    <Fontisto
      name='fire'
      color='red'
      style={props.style}
    />
  ), [])

  const renderRight = useCallback((props) => (
    <IconButton
      icon={item.favorite ? 'cards-heart' : 'cards-heart-outline'}
      iconColor='pink'
      style={props.style}
      onPress={handleFavoritePress}
    />
  ), [item.favorite, handleFavoritePress])

  return (
    <List.Item
      titleStyle={styles.itemTitleStyle}
      title={<MyText>{item.question}</MyText>}
      onPress={handlePress}
      description={
        item.useful > defaultSetting.hotUsefulCount
          ? <MyText style={styles.descText}>有{item.useful}個人覺得這個題目有用</MyText>
          : null
      }
      left={isHot ? renderLeft : undefined}
      right={renderRight}
    />
  )
}

const styles = StyleSheet.create({
  accordionImage: {
    width: 40,
    height: 40
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  itemTitleStyle: {
    fontSize: 14
  },
  descText: {
    fontSize: 12
  }
})

export default SubtitleList
