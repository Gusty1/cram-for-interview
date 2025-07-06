import { generateClient } from 'aws-amplify/api';
import { createBugReport } from '../../../graphql/mutations'

const addBugReport = async (sendData) => {
  try {
    const client = generateClient();
    await client.graphql(
      {
        query: createBugReport,
        variables: {
          input: {
            ...sendData,
            status: '',
            result: ''
          }
        }
      }
    )
  } catch (error) {
    console.error('addBugReport error:　', error)
  }
}

export default addBugReport
