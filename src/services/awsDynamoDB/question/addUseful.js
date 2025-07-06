import { generateClient } from 'aws-amplify/api';
import { getQuestion } from '../../../graphql/queries'
import { updateQuestion } from '../../../graphql/mutations'

//更新question覺得讚的資料()
const addUseful = async (id, option = null) => {
	try {
		const client = generateClient();
		//先查詢最新的資料
		const question = await client.graphql(
			{
				query: getQuestion,
				variables: {
					id: id
				}
			}
		)

		//增加讚
		if (option === 'add' && question) {
			//如果有資料就把當前的useful+1
			if (question) {
				await client.graphql(
					{
						query: updateQuestion,
						variables: {
							input: {
								id: id,
								useful: question.data.getQuestion.useful + 1
							}
						}
					}
				)
			}
		}
		//減少讚
		if (option === 'minus' && question) {
			//如果有資料就把當前的useful-1
			if (question) {
				// console.log(question.data.getQuestion.useful)
				let newUseful = question.data.getQuestion.useful - 1
				if (newUseful < 0) newUseful = 0
				await client.graphql(
					{
						query: updateQuestion,
						variables: {
							input: {
								id: id,
								useful: newUseful
							}
						}
					}
				)
			}
		}
	} catch (error) {
		console.error('getQuestions error:　', error)
	}
}

export default addUseful
