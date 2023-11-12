import React, { useEffect, useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  TouchableNativeFeedback,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { API, graphqlOperation } from 'aws-amplify'
import { listSubjects } from '../src/graphql/queries'
// import { createSubject } from '../src/graphql/mutation'
import SubjectImgPath from '../constants/SubjectImgPath'

import MyText from './MyText'
import Styles from '../constants/Styles'

/*
  首頁的主題方塊組件
*/
export default function SubjectCube(props) {
  const [subjectAry, setSubjectAry] = useState([])

  //查詢主題有哪些
  useEffect(() => {
    async function fetchSubjects() {
      await API.graphql(
        graphqlOperation(listSubjects, { filter: { isShow: { eq: true } } })
      ).then((response) => {
        //資料會放在response.data.listSubjects.items
        setSubjectAry(
          response.data.listSubjects.items.sort((a, b) =>
            a.subject.localeCompare(b.subject)
          )
        )
      })
    }
    fetchSubjects()
  }, [])

  const subjectCube = (itemData) => {
    return (
      <View style={styles.gridItem}>
        <TouchableNativeFeedback
          onPress={() =>
            props.navigation.navigate('SubtitleScreen', {
              subject: itemData.item.subject,
              chineseName: itemData.item.chineseName,
            })
          }>
          <View style={styles.itemShow}>
            <ImageBackground
              source={SubjectImgPath[itemData.item.subject]}
              resizeMode="contain"
              style={styles.bgImg}>
              <View>
                <MyText style={styles.cubeTitleFont}>
                  {itemData.item.chineseName}
                </MyText>
              </View>
            </ImageBackground>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  return (
    <View style={{ ...Styles.defaultMainContainer }}>
      {subjectAry.length === 0 ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          renderItem={subjectCube}
          data={subjectAry}
          numColumns={2}
          keyExtractor={(item, _) => item.subject}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  gridItem: {
    margin: 15,
    height: 130,
    width: Dimensions.get('window').width / 2.4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bgImg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  itemShow: {
    justifyContent: 'flex-end',
    padding: 0,
    width: '100%',
    height: '100%',
  },
  cubeTitleFont: {
    textAlign: 'center',
    fontSize: 20,
    color: 'yellow',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
})
