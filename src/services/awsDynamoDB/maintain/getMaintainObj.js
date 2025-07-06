import { generateClient } from 'aws-amplify/api';
import { getMaintain } from '../../../graphql/queries'
import { defaultSetting } from '../../../constants'

const getMaintainObj = async () => {
	try {
		const client = generateClient();
		const result = await client.graphql(
			{
				query: getMaintain,
				variables: {
					id: defaultSetting.maintainID
				}
			}
		)

		return result.data.getMaintain
	} catch (error) {
		console.error('getQuestions error:　', error)
		return null
	}
}

export default getMaintainObj
