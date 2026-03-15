import { useState, useMemo, useCallback } from 'react'
import { Image, View, StyleSheet } from 'react-native'
import { List, IconButton } from 'react-native-paper'
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
  const isDark = useStore((s) => s.setting?.darkMode)

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

  const questionCount = sortedQuestions.length
  const description = questionCount === 0
    ? <MyText style={styles.descEmpty}>還沒有題目，歡迎提供</MyText>
    : <MyText style={styles.descCount}>{questionCount} 題</MyText>

  return (
    <View style={[styles.accordionCard, { backgroundColor: isDark ? '#2a2a2a' : '#fff', borderColor: isDark ? '#444' : '#eee' }]}>
      <List.Accordion
        title={<MyText style={styles.titleText}>{zh_name}</MyText>}
        expanded={expanded}
        onPress={handleToggleExpand}
        onLongPress={onDragStart}
        onPressOut={onDragEnd}
        description={description}
        left={renderLeft}
        style={styles.accordion}
      >
        {sortedQuestions.map((item, index) => (
          <SubtitleListItem
            key={item.id}
            item={item}
            navigation={navigation}
            en_name={en_name}
            zh_name={zh_name}
            subjectEN={subjectEN}
            addFavorite={addFavorite}
            deleteFavorite={deleteFavorite}
            isLast={index === sortedQuestions.length - 1}
            isDark={isDark}
          />
        ))}
      </List.Accordion>
    </View>
  )
}

/** 單一題目列表項目 */
const SubtitleListItem = ({ item, navigation, en_name, zh_name, subjectEN, addFavorite, deleteFavorite, isLast, isDark }) => {
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
      color='#ff6b35'
      size={16}
      style={props.style}
    />
  ), [])

  const renderRight = useCallback((props) => (
    <IconButton
      icon={item.favorite ? 'cards-heart' : 'cards-heart-outline'}
      iconColor={item.favorite ? '#E74C3C' : '#ccc'}
      size={20}
      style={props.style}
      onPress={handleFavoritePress}
    />
  ), [item.favorite, handleFavoritePress])

  return (
    <>
      {!isLast && <View style={[styles.itemDivider, { borderColor: isDark ? '#3a3a3a' : '#f0f0f0' }]} />}
      <List.Item
        title={<MyText style={styles.itemTitle}>{item.question}</MyText>}
        onPress={handlePress}
        description={isHot
          ? <MyText style={styles.hotDesc}>{item.useful} 人覺得有用</MyText>
          : null
        }
        left={isHot ? renderLeft : undefined}
        right={renderRight}
        style={styles.listItem}
      />
    </>
  )
}

const styles = StyleSheet.create({
  accordionCard: {
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accordion: {
    paddingVertical: 4,
  },
  accordionImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  descCount: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  descEmpty: {
    fontSize: 12,
    color: '#bbb',
    fontStyle: 'italic',
    marginTop: 2,
  },
  listItem: {
    paddingVertical: 0,
    paddingLeft: 16,
  },
  itemTitle: {
    fontSize: 14,
  },
  itemDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  hotDesc: {
    fontSize: 11,
    color: '#ff6b35',
    marginTop: 1,
  },
})

export default SubtitleList
