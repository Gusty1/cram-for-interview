import { API, graphqlOperation } from 'aws-amplify'
import { listSubtitles } from '../../../graphql/queries'

const getSubtitles = async (subject) => {
  try {
    const result = await API.graphql(
      graphqlOperation(listSubtitles, {
        filter: {
          enable: {
            eq: true
          },
          subject: {
            eq: subject,
          }
        }
      })
    )
    return result.data.listSubtitles.items
  } catch (error) {
    console.error('getSubtitles error:　', error)
    return []
  }
}

export default getSubtitles
