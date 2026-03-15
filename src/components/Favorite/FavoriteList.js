import { memo, useState, useMemo, useCallback } from 'react'
import { Image, View, StyleSheet } from 'react-native'
import { List, IconButton } from 'react-native-paper'
import MyText from '../MyComponents/MyText'
import useStore from '../../store'

const FALLBACK_IMAGE = require('../../assets/images/notFound.png')

/** 單一收藏題目項目 */
const FavoriteItem = memo(({ item, index, navigation, subtitle, subtitleShow, subject, allQuestions, delFavorite, isLast, isDark }) => {
  const handlePress = useCallback(() => {
    navigation.navigate('QuestionScreen', {
      questionID: item.id,
      subtitleEN: subtitle,
      subtitleZH: subtitleShow,
      subjectEN: subject,
      allQuestions
    })
  }, [navigation, item.id, subtitle, subtitleShow, subject, allQuestions])

  const handleDelete = useCallback(() => {
    delFavorite(subtitle, item.id)
  }, [delFavorite, subtitle, item.id])

  const renderLeft = useCallback((props) => (
    <View style={[props.style, styles.indexContainer]}>
      <MyText style={styles.indexText}>{index + 1}.</MyText>
    </View>
  ), [index])

  const renderRight = useCallback((props) => (
    <IconButton
      icon={item.favorite ? 'cards-heart' : 'cards-heart-outline'}
      iconColor={item.favorite ? '#E74C3C' : '#ccc'}
      size={20}
      style={props.style}
      onPress={handleDelete}
    />
  ), [item.favorite, handleDelete])

  return (
    <>
      {index > 0 && <View style={[styles.itemDivider, { borderColor: isDark ? '#3a3a3a' : '#f0f0f0' }]} />}
      <List.Item
        contentStyle={styles.itemContent}
        title={<MyText style={styles.itemTitle}>{item.question}</MyText>}
        onPress={handlePress}
        left={renderLeft}
        right={renderRight}
        style={styles.listItem}
      />
    </>
  )
})

/** 收藏主題的 Accordion List */
const FavoriteList = ({ navigation, favoriteSubtitle, allQuestions, delFavorite,
  onDragStart, onDragEnd, expanded, toggleExpand }) => {
  const [error, setError] = useState(false)
  const { subtitle, subtitleShow, image, questions, show, subject } = favoriteSubtitle
  const isDark = useStore((s) => s.setting?.darkMode)

  const handleImageError = useCallback(() => setError(true), [])
  const handleToggleExpand = useCallback(() => toggleExpand(subtitle), [toggleExpand, subtitle])

  const cardStyle = useMemo(() => [
    styles.accordionCard,
    {
      backgroundColor: isDark ? '#2a2a2a' : '#fff',
      borderColor: isDark ? '#444' : '#eee',
      display: show ? 'flex' : 'none',
    }
  ], [isDark, show])

  const renderLeft = useCallback((props) => (
    <Image
      source={error ? FALLBACK_IMAGE : { uri: image }}
      style={[props.style, styles.accordionImage]}
      onError={handleImageError}
    />
  ), [error, image, handleImageError])

  const questionCount = questions.length
  const description = questionCount === 0
    ? <MyText style={styles.descEmpty}>沒有收藏的題目</MyText>
    : <MyText style={styles.descCount}>{questionCount} 題</MyText>

  return (
    <View style={cardStyle}>
      <List.Accordion
        expanded={expanded}
        onPress={handleToggleExpand}
        onLongPress={onDragStart}
        onPressOut={onDragEnd}
        title={<MyText style={styles.titleText}>{subtitleShow}</MyText>}
        description={description}
        style={styles.accordion}
        left={renderLeft}
      >
        {questions.map((item, index) => (
          <FavoriteItem
            key={item.id}
            item={item}
            index={index}
            navigation={navigation}
            subtitle={subtitle}
            subtitleShow={subtitleShow}
            subject={subject}
            allQuestions={allQuestions}
            delFavorite={delFavorite}
            isLast={index === questions.length - 1}
            isDark={isDark}
          />
        ))}
      </List.Accordion>
    </View>
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
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
  },
  itemDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  indexText: {
    color: '#6b4faa',
    fontWeight: 'bold',
  },
  indexContainer: {
    width: 36,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default memo(FavoriteList)
