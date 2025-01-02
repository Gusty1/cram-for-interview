import { API, graphqlOperation } from 'aws-amplify'
import { createBugReport } from '../../../graphql/mutations'

const addBugReport = async (sendData) => {
  try {
    await API.graphql(
      graphqlOperation(createBugReport, {
        input: {
          ...sendData,
          status: '',
          result: ''
        }
      })
    )
  } catch (error) {
    console.error('addBugReport error:　', error)
  }
}

export default addBugReport
