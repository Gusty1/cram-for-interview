import { generateClient } from 'aws-amplify/api';
import { listSubtitles } from '../../../graphql/queries'

const getSubtitles = async (subject) => {
  try {
    const client = generateClient();
    const result = await client.graphql(
      {
        query: listSubtitles,
        variables: {
          filter: {
            enable: {
              eq: true
            },
            subject: {
              eq: subject,
            }
          }
        }
      }
    )

    return result.data.listSubtitles.items
  } catch (error) {
    console.error('getSubtitles error:　', error)
    return []
  }
}

export default getSubtitles
