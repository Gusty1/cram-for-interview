import { memo, useState, useMemo, useCallback } from 'react'
import { Image, View, StyleSheet } from 'react-native'
import { List, IconButton, Divider } from 'react-native-paper'
import MyText from '../MyComponents/MyText'

const FALLBACK_IMAGE = require('../../assets/images/notFound.png')

/** 單一收藏題目項目 */
const FavoriteItem = memo(({ item, index, navigation, subtitle, subtitleShow, subject, allQuestions, delFavorite }) => {
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
      iconColor='pink'
      style={props.style}
      onPress={handleDelete}
    />
  ), [item.favorite, handleDelete])

  return (
    <List.Item
      contentStyle={styles.itemContent}
      titleStyle={styles.itemTitle}
      title={<MyText>{item.question}</MyText>}
      onPress={handlePress}
      left={renderLeft}
      right={renderRight}
    />
  )
})

/** 收藏主題的 Accordion List */
const FavoriteList = ({ navigation, favoriteSubtitle, allQuestions, delFavorite,
  onDragStart, onDragEnd, expanded, toggleExpand }) => {
  const [error, setError] = useState(false)
  const { subtitle, subtitleShow, image, questions, show, subject } = favoriteSubtitle

  const handleImageError = useCallback(() => setError(true), [])
  const handleToggleExpand = useCallback(() => toggleExpand(subtitle), [toggleExpand, subtitle])

  const accordionStyle = useMemo(
    () => show ? styles.visible : styles.hidden,
    [show]
  )

  const renderLeft = useCallback((props) => (
    <Image
      source={error ? FALLBACK_IMAGE : { uri: image }}
      style={[props.style, styles.accordionImage]}
      onError={handleImageError}
    />
  ), [error, image, handleImageError])

  return (
    <>
      <List.Accordion
        expanded={expanded}
        onPress={handleToggleExpand}
        onLongPress={onDragStart}
        onPressOut={onDragEnd}
        title={<MyText>{subtitleShow}</MyText>}
        description={<MyText style={styles.descText}>共{questions.length}題</MyText>}
        style={accordionStyle}
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
          />
        ))}
      </List.Accordion>
      <Divider />
    </>
  )
}

const styles = StyleSheet.create({
  accordionImage: {
    width: 40,
    height: 40
  },
  itemContent: {
    flex: 1
  },
  itemTitle: {
    fontSize: 14
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
  descText: {
    fontSize: 12
  },
  visible: {
    display: 'flex'
  },
  hidden: {
    display: 'none'
  }
})

export default memo(FavoriteList)
