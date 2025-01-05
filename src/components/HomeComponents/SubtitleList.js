import { useState, useEffect } from 'react'
import { Image } from 'react-native'
import { List, Divider, IconButton } from 'react-native-paper'
import { Fontisto } from 'react-native-vector-icons'
import { defaultSetting } from '../../constants'
import MyText from '../MyComponents/MyText'
import useStore from '../../store'

//子項目的list
const SubtitleList = ({ navigation, subtitle, onDragStart, onDragEnd, subjectEN }) => {
  const [error, setError] = useState(false)
  const { en_name, zh_name, image, questions } = subtitle
  const { addFavorite, deleteFavorite } = useStore()

  useEffect(() => {
    questions.sort((a, b) => b.useful - a.useful)
  }, [])

  return (
    <>
      <List.Accordion
        title={<MyText>{zh_name}</MyText>}
        titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
        onLongPress={onDragStart}
        onPressOut={onDragEnd}
        description={
          questions.length === 0 ? (<MyText style={{ fontSize: 12 }}>還沒有題目，歡迎提供</MyText>) :
            (<MyText style={{ fontSize: 12 }}>共{questions.length}題</MyText>)
        }
        left={(props) => (
          <Image
            source={error ? require('../../assets/images/notFound.png') : { uri: image }}
            style={{ ...props.style, width: 40, height: 40 }}
            onError={() => setError(true)}
          />
        )}
      >
        {questions.map((item) => (
          <List.Item
            titleStyle={{ fontSize: 14 }}
            title={<MyText>{item.question}</MyText>}
            key={item.id}
            onPress={() => {
              navigation.navigate('QuestionScreen', {
                questionID: item.id,
                subtitleEN: en_name,
                subtitleZH: zh_name,
                subjectEN: subjectEN
              })
            }}
            description={
              item.useful > defaultSetting.hotUsefulCount ? (
                <MyText style={{ fontSize: 12 }}>
                  有{item.useful}↑個人覺得這個題目有用
                </MyText>
              ) : null
            }
            left={(props) => (
              <Fontisto
                name='fire'
                color={item.useful > 10 ? 'red' : 'transparent'}
                style={{ ...props.style }}
              />
            )}
            right={(props) => (
              <IconButton
                icon={item.favorite ? 'cards-heart' : 'cards-heart-outline'}
                iconColor='pink'
                style={{ ...props.style }}
                onPress={() => {
                  if (item.favorite) deleteFavorite(item.id)
                  else addFavorite(en_name, zh_name, subjectEN, item.id)
                }}
              />
            )}
          />
        ))}
      </List.Accordion>
      <Divider />
    </>
  )
}

export default SubtitleList
