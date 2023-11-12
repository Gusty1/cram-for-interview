import { API, graphqlOperation } from 'aws-amplify'
import {
  listQuestions,
} from '../src/graphql/queries'
import {
  createSubject, createSubtitle, createQuestion
} from '../src/graphql/mutations'
import moment from 'moment'
import 'moment/locale/zh-tw'

export function IUDOption () {
  return new Promise((resolve, reject) => {
    // 新增、修改、刪除範例，注意用法不同引入的模型也需要替換
    API.graphql(
      graphqlOperation(createQuestion, {
        input: {
          subject: 'code',
          subtitle: 'Java',
          question: '說明集合List與Set區別?',
          answer: '',
          clickCount: 0,
          createDate: moment().format('YYYY/MM/DD HH:mm:ss (dd)'),
          updateDate: moment().format('YYYY/MM/DD HH:mm:ss (dd)'),
          isShow: true,
          remark: '',
        },
      })
    ).then((response) => {
      resolve(response)
    })
  })
}
export function queryData () {
  //查詢範例，用list和get最後取資料會有點不一樣
  //list
  API.graphql(
    graphqlOperation(listQuestions, {
      filter: {
        name: {
          eq: 'name',
        },
      },
    })
  ).then((response) => {
    //資料是Array
    resolve(response.data.listQuestions.items)
  })

  //get
  API.graphql(
    graphqlOperation(getQuestion, {
      id: 'id',
    })
  ).then((response) => {
    // 資料是obj
    resolve(response.data.getQuestion)
  })
}
