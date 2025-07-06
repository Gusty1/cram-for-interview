import { generateClient } from 'aws-amplify/api';
import { listSubjects } from '../../../graphql/queries'

const getSubjects = async () => {
  try {
    const client = generateClient();
    const result = await client.graphql(
      {
        query: listSubjects,
        variables: {
          filter: {
            enable: {
              eq: true
            }
          }
        }
      }
    )

    return result.data.listSubjects.items;
  } catch (error) {
    console.error('getSubjects error:　', error)
    return []
  }
}

export default getSubjects
