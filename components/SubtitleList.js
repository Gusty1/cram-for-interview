import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  View,
} from 'react-native'
import { ListItem } from '@rneui/themed'

import MyText from '../components/MyText'
import Colors from '../constants/Colors'
import Styles from '../constants/Styles'
import { API, graphqlOperation } from 'aws-amplify'
import { listSubtitles, listQuestions } from '../src/graphql/queries'
import SubtitleImgPath from '../constants/SubtitleImgPath'

const screenHeight = Dimensions.get('window').height

/*
  顯示副標題和問題題目的組件
*/
export default function SubtitleList(props) {
  const [listAry, setListAry] = useState(null)
  const subject = props.route.params.subject

  useEffect(() => {
    //先查詢副標題有哪些
    async function fetchSubtitles() {
      await API.graphql(
        graphqlOperation(listSubtitles, {
          filter: {
            and: [
              {
                subject: {
                  eq: subject,
                },
              },
              {
                isShow: {
                  eq: true,
                },
              },
            ],
          },
        })
      ).then((response) => {
        const subtitleAry = response.data.listSubtitles.items
        if (subtitleAry.length === 0) {
          setListAry([])
          return
        }
        //副標題查到以後，再用副標題去查問題
        let finalAry = []
        subtitleAry.forEach((item, _) => {
          fetchQuestions(item.subtitle).then((response) => {
            let questionAry = []
            let questionListAry = response.data.listQuestions.items
            questionListAry = questionListAry.sort((a, b) =>
              a.question.localeCompare(b.question)
            )
            questionAry = questionListAry.map((item) => {
              return {
                id: item.id,
                question: item.question,
                clickCount: item.clickCount,
              }
            })
            //最後將查到的副標題、問題，整理成一個新狀態
            finalAry = [
              ...finalAry,
              {
                id: item.id,
                subject: item.subject,
                subtitle: item.subtitle,
                questionAry: questionAry,
                expanded: false,
              },
            ]
            //如果每放一筆都要set那就會爆炸，所以當finalAry和subtitleAry長度相同就結束了
            if (
              finalAry.length === subtitleAry.length &&
              subtitleAry.length > 0
            ) {
              finalAry = finalAry.sort((a, b) =>
                a.subtitle.localeCompare(b.subtitle)
              )
              setListAry(finalAry)
            }
          })
        })
      })
    }
    //查詢問題
    async function fetchQuestions(subtitle) {
      return await API.graphql(
        graphqlOperation(listQuestions, {
          filter: {
            and: [
              {
                subject: {
                  eq: subject,
                },
              },
              {
                subtitle: {
                  eq: subtitle,
                },
              },
              {
                isShow: {
                  eq: true,
                },
              },
            ],
          },
        })
      )
    }
    fetchSubtitles()
  }, [])

  const subtitleList = (itemData) => {
    return (
      <ListItem.Accordion
        containerStyle={styles.listStyle}
        isExpanded={itemData.item.expanded}
        onPress={() => {
          if (itemData.item.questionAry.length === 0) return
          setListAry(
            listAry.map((list) => {
              if (list.id === itemData.item.id) list.expanded = !list.expanded
              else {
                if (list.expanded) list.expanded = false
              }
              return list
            })
          )
        }}
        content={
          <>
            <ListItem.Content style={styles.itemCenter}>
              <Image
                source={SubtitleImgPath[itemData.item.subtitle]}
                style={styles.avatarStyle}
                resizeMode="contain"
              />
            </ListItem.Content>
            <ListItem.Content style={styles.itemCenter}>
              <MyText>{itemData.item.subtitle}</MyText>
              <MyText style={styles.questionCount}>
                {itemData.item.questionAry.length}題
              </MyText>
            </ListItem.Content>
          </>
        }>
        {itemData.item.questionAry.map((question) => {
          return (
            <ListItem
              containerStyle={styles.listItemContainer}
              onPress={() => {
                props.navigation.navigate('QuestionScreen', {
                  subtitle: itemData.item.subtitle,
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
  }

  return (
    <>
      {listAry === null ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          renderItem={subtitleList}
          data={listAry}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MyText style={styles.emptyText}>目前沒有資料，歡迎提供</MyText>
            </View>
          }
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  listStyle: {
    marginTop: '3%',
    width: '90%',
    alignSelf: 'center',
    ...Styles.defaultBorder,
    ...Styles.defaultShadow,
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
    color: 'red',
    fontSize: 20,
  },
  listItemContainer: {
    width: '80%',
    alignSelf: 'center',
    borderWidth: 1,
  },
})