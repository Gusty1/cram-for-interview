import { API, graphqlOperation } from 'aws-amplify'
import { listQuestions } from '../../../graphql/queries'

const getQuestions = async (subtitle) => {
  try {
    const result = await API.graphql(
      graphqlOperation(listQuestions, {
        filter: {
          enable: {
            eq: true,
          },
          subtitle: {
            eq: subtitle,
          }
        }
      })
    )
    return result.data.listQuestions.items
  } catch (error) {
    console.error('getQuestions error:　', error)
    return []
  }
}

export default getQuestions
