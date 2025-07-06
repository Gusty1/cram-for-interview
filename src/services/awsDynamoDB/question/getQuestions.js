import { generateClient } from 'aws-amplify/api';
import { listQuestions } from '../../../graphql/queries'

const getQuestions = async (subtitle) => {
  try {
    const client = generateClient();
    const result = await client.graphql(
      {
        query: listQuestions,
        variables: {
          filter: {
            enable: {
              eq: true,
            },
            subtitle: {
              eq: subtitle,
            }
          }
        }
      }
    )

    return result.data.listQuestions.items
  } catch (error) {
    console.error('getQuestions error:　', error)
    return []
  }
}

export default getQuestions
