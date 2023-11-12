import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image,
} from 'react-native'
import { API, graphqlOperation } from 'aws-amplify'
import { ListItem } from '@rneui/themed'
import { useSelector } from 'react-redux'

import {
  listQuestions,
  listSubjects,
  listSubtitles,
} from '../src/graphql/queries'
import { removeDuplicates, randomColor } from '../tools/OtherTool'
import MyText from '../components/MyText'
import Styles from '../constants/Styles'
import Colors from '../constants/Colors'
import SubtitleImgPath from '../constants/SubtitleImgPath'

const screenHeight = Dimensions.get('window').height

export default function FavList(props) {
  const favoriteAry = useSelector((state) => state.favoriteAry.value)
  const [showFavAry, setShowFavAry] = useState(null)

  useEffect(() => {
    if (favoriteAry.length === 0) {
      setShowFavAry(favoriteAry)
      return
    }
    ;(async function buildFavData() {
      // console.log(favoriteAry)
      setShowFavAry(null)

      //in不會用，所以B計畫，把參數組合成一個or陣列
      let params = favoriteAry.map((questionData) => {
        return {
          question: {
            eq: questionData,
          },
        }
      })
      let myFavQuestionAry = []
      //用收藏的問題找到問題詳情
      await API.graphql(
        graphqlOperation(listQuestions, {
          filter: {
            and: [
              {
                isShow: {
                  eq: true,
                },
              },
              {
                or: params,
              },
            ],
          },
        })
      ).then((response) => {
        myFavQuestionAry = response.data.listQuestions.items
      })

      //查到問題詳情以後再過濾出標題和副標題，並組合出各自的or陣列
      let subjectAry = removeDuplicates(myFavQuestionAry, 'subject').map(
        (item) => item.subject
      )
      let subjectAryParams = subjectAry.map((subjectData) => {
        return {
          subject: {
            eq: subjectData,
          },
        }
      })
      let subtitleAry = removeDuplicates(myFavQuestionAry, 'subtitle').map(
        (item) => item.subtitle
      )
      let subtitleAryParams = subtitleAry.map((subtitleData) => {
        return {
          subtitle: {
            eq: subtitleData,
          },
        }
      })

      //用主題查詢主題詳情
      let mySubjectAry = []
      await API.graphql(
        graphqlOperation(listSubjects, {
          filter: {
            and: [
              {
                isShow: {
                  eq: true,
                },
              },
              {
                or: subjectAryParams,
              },
            ],
          },
        })
      ).then((response) => {
        mySubjectAry = response.data.listSubjects.items
      })

      //用副主題查詢副主題祥情
      let mySubtitleAry = []
      await API.graphql(
        graphqlOperation(listSubtitles, {
          filter: {
            and: [
              {
                isShow: {
                  eq: true,
                },
              },
              {
                or: subtitleAryParams,
              },
            ],
          },
        })
      ).then((response) => {
        mySubtitleAry = response.data.listSubtitles.items
      })

      //排序主題和副主題陣列
      mySubjectAry = mySubjectAry.sort((a, b) =>
        a.subject.localeCompare(b.subject)
      )
      mySubtitleAry = mySubtitleAry.sort((a, b) =>
        a.subtitle.localeCompare(b.subtitle)
      )
      //最後用嵌套的方式 主題 嵌 副主題
      for (let i = 0; i < mySubtitleAry.length; i++) {
        mySubtitleAry[i].questionAry = []
        for (let j = 0; j < myFavQuestionAry.length; j++) {
          if (mySubtitleAry[i].subtitle === myFavQuestionAry[j].subtitle) {
            mySubtitleAry[i].questionAry.push({
              ...myFavQuestionAry[j],
              expanded: false,
            })
          }
        }
      }
      //副主題 嵌 問題詳情
      for (let i = 0; i < mySubjectAry.length; i++) {
        mySubjectAry[i].color = randomColor(0.3)
        mySubjectAry[i].subtitleAry = []
        for (let j = 0; j < mySubtitleAry.length; j++) {
          if (mySubjectAry[i].subject === mySubtitleAry[j].subject) {
            mySubjectAry[i].subtitleAry.push(mySubtitleAry[j])
          }
        }
      }
      setShowFavAry(mySubjectAry)
    })()
  }, [favoriteAry])

  const subtitleList = (itemData) => {
    return (
      <View
        style={{
          margin: 10,
          borderRadius: 10,
          backgroundColor: itemData.item.color,
          borderColor: '#FFC78E',
          paddingBottom: 10,
          borderWidth: 2,
        }}>
        <MyText style={styles.favSubject}>{itemData.item.chineseName}</MyText>
        {itemData.item.subtitleAry.map((subtileData) => {
          return (
            <ListItem.Accordion
              key={subtileData.id}
              containerStyle={styles.listStyle}
              isExpanded={subtileData.expanded}
              onPress={() => {
                setShowFavAry(
                  showFavAry.map((subject) => {
                    return {
                      ...subject,
                      subtitleAry: subject.subtitleAry.map((subtitle) => {
                        if (subtileData.id === subtitle.id)
                          subtitle.expanded = !subtitle.expanded
                        else {
                          if (subtitle.expanded) subtitle.expanded = false
                        }
                        return subtitle
                      }),
                    }
                  })
                )
              }}
              content={
                <>
                  <ListItem.Content style={styles.itemCenter}>
                    <Image
                      source={SubtitleImgPath[subtileData.subtitle]}
                      style={styles.avatarStyle}
                      resizeMode="contain"
                    />
                  </ListItem.Content>
                  <ListItem.Content style={styles.itemCenter}>
                    <MyText>{subtileData.subtitle}</MyText>
                    <MyText style={styles.questionCount}>
                      {subtileData.questionAry.length}題
                    </MyText>
                  </ListItem.Content>
                </>
              }>
              {subtileData.questionAry.map((question) => {
                return (
                  <ListItem
                    containerStyle={styles.listItemContainer}
                    onPress={() => {
                      props.navigation.navigate('FavQuestionScreen', {
                        subtitle: question.subtitle,
                        question: question.question,
                        id: question.id,
                      })
                    }}
                    key={question.id}>
                    <ListItem.Content>
                      <MyText>{question.question}</MyText>
                    </ListItem.Content>
                  </ListItem>
                )
              })}
            </ListItem.Accordion>
          )
        })}
      </View>
    )
  }

  return (
    <>
      {showFavAry === null ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          renderItem={subtitleList}
          data={showFavAry}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MyText style={styles.emptyText}>尚未收藏任何題目</MyText>
            </View>
          }
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  listStyle: {
    backgroundColor: Colors.backgroundColor,
    marginTop: '5%',
    width: '80%',
    alignSelf: 'center',
    ...Styles.defaultBorder,
  },
  itemCenter: {
    alignItems: 'center',
  },
  avatarStyle: {
    width: '100%',
    height: screenHeight / 15,
  },
  questionCount: {
    color: Colors.accentColor,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '60%',
  },
  emptyText: {
    color: Colors.primaryColor,
    fontSize: 20,
  },
  listItemContainer: {
    width: '70%',
    alignSelf: 'center',
    backgroundColor: Colors.backgroundColor,
    borderWidth: 1,
  },
  favSubject: {
    fontSize: 22,
    marginTop: 10,
    color: '#8600FF',
    textAlign: 'center',
  },
})
