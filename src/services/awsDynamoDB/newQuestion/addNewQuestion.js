import { generateClient } from 'aws-amplify/api';
import { createNewQuestion } from '../../../graphql/mutations'

//新增問題
const addNewQuestion = async (inputData) => {
	try {
		const client = generateClient();
		const result = await client.graphql(
			{
				query: createNewQuestion,
				variables: {
					input: inputData
				}
			}
		)

		return result
	} catch (error) {
		console.error('addNewQuestion error:　', error)
		return null
	}
}

export default addNewQuestion
