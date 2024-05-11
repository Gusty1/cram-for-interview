import React, { useEffect, useState } from 'react'
import {
    View,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Dimensions,
    Image,
    RefreshControl,
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
import { errorHandler } from '../tools/OtherTool'

const screenHeight = Dimensions.get('window').height

export default function FavList (props) {
    const favoriteAry = useSelector((state) => state.favoriteAry.value)
    const [showFavAry, setShowFavAry] = useState(null)
    const [refreshing, setRefreshing] = React.useState(false)

    //下拉刷新
    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        buildFavData()
    }, [refreshing])

    //載入時用sqllite的資料找 主題、副標題、問題
    useEffect(() => {
        if (favoriteAry.length === 0) {
            setShowFavAry(favoriteAry)
            return
        }
        buildFavData()
    }, [favoriteAry])

    async function buildFavData () {
        setShowFavAry(null)
        //in不會用，所以B計畫，把參數組合成一個or陣列
        let params = favoriteAry.map((questionData) => {
            return {
                id: {
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
                            show: {
                                eq: true,
                            },
                        },
                        {
                            or: params,
                        },
                    ],
                },
            })
        )
            .then((response) => {
                myFavQuestionAry = response.data.listQuestions.items
                myFavQuestionAry = myFavQuestionAry.sort((a, b) => a.order - b.order)
            })
            .catch((err) => {
                errorHandler(err)
            })

        //問題陣列過濾副標題並組合查詢的or陣列
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

        //查詢副標題資料
        let mySubtitleAry = []
        await API.graphql(
            graphqlOperation(listSubtitles, {
                filter: {
                    and: [
                        {
                            show: {
                                eq: true,
                            },
                        },
                        {
                            or: subtitleAryParams,
                        },
                    ],
                },
            })
        )
            .then((response) => {
                mySubtitleAry = response.data.listSubtitles.items
            })
            .catch((err) => {
                errorHandler(err)
            })

        //副標題陣列過濾主題並組合查詢的or陣列
        let subjectAry = removeDuplicates(mySubtitleAry, 'subject').map(
            (item) => item.subject
        )
        let subjectAryParams = subjectAry.map((subjectData) => {
            return {
                subject: {
                    eq: subjectData,
                },
            }
        })

        //查詢主題資料
        let mySubjectAry = []
        await API.graphql(
            graphqlOperation(listSubjects, {
                filter: {
                    and: [
                        {
                            show: {
                                eq: true,
                            },
                        },
                        {
                            or: subjectAryParams,
                        },
                    ],
                },
            })
        )
            .then((response) => {
                mySubjectAry = response.data.listSubjects.items
            })
            .catch((err) => {
                errorHandler(err)
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
        setRefreshing(false)
    }

    //顯示清單組件
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
                <MyText style={styles.favSubject}>{itemData.item.subject_zh}</MyText>
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
                                                order: question.order,
                                                id: question.id,
                                                favQuestionAry: subtileData.questionAry,
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
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
