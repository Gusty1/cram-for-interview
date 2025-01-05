import { API, graphqlOperation } from 'aws-amplify'
import { createNewQuestion } from '../../../graphql/mutations'

//新增問題
const addNewQuestion = async (inputData) => {
	try {
		const result = await API.graphql(
			graphqlOperation(createNewQuestion, {
				input: inputData
			})
		)
		return result
	} catch (error) {
		console.error('addNewQuestion error:　', error)
		return null
	}
}

export default addNewQuestion
