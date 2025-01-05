import { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { List, IconButton, Divider } from 'react-native-paper'
import MyText from '../MyComponents/MyText'

//收藏的list
const FavoriteList = ({ navigation, favoriteSubtitle, allQuestions, delFavorite,
  onDragStart, onDragEnd }) => {
  const [thisFavorite, setThisFavorite] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    setThisFavorite(favoriteSubtitle)
  }, [favoriteSubtitle])

  if (!thisFavorite) return null

  return (
    <>
      <List.Accordion
        onLongPress={onDragStart}
        onPressOut={onDragEnd}
        title={<MyText>{thisFavorite.subtitleShow}</MyText>}
        description={<MyText style={{ fontSize: 12 }}>共{thisFavorite.questions.length}題</MyText>}
        style={thisFavorite.show ? { display: 'flex' } : { display: 'none' }}
        left={(props) => (
          <Image
            source={error ? require('../../assets/images/notFound.png') : { uri: thisFavorite.image }}
            style={{ ...props.style, width: 40, height: 40 }}
            onError={() => setError(true)}
          />
        )}>
        {thisFavorite.questions.map((item, index) => (<List.Item
          onPress={() => {
            navigation.navigate('QuestionScreen', {
              questionID: item.id,
              subtitleEN: thisFavorite.subtitle,
              subtitleZH: thisFavorite.subtitleShow,
              subjectEN: thisFavorite.subject,
              allQuestions: allQuestions
            })
          }}
          contentStyle={{ flex: 1 }}
          titleStyle={{ fontSize: 14 }}
          title={<MyText>{item.question}</MyText>}
          key={item.id}
          left={(props) => (<MyText style={{ ...props.style, color: '#6b4faa' }} >
            {index + 1}.
          </MyText>)}
          right={(props) => (
            <IconButton
              icon={item.favorite ? 'cards-heart' : 'cards-heart-outline'}
              iconColor='pink'
              style={{ ...props.style }}
              onPress={() => delFavorite(thisFavorite.subtitle, item.id)}
            />
          )}
        />))}
      </List.Accordion>
      <Divider />
    </>
  )
}

export default FavoriteList
