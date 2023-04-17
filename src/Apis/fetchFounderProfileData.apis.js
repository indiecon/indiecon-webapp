import generateCustomHeader from '../Utils/generateCustomHeader.utils';

const fetchFounderProfileData = async (authToken) => {
	try {
		const response = await fetch(
			`${process.env.REACT_APP_BACKEND_URL}/founder/profile`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`,
					'x-custom-header':
						generateCustomHeader().responseType === 'success'
							? generateCustomHeader().responsePayload
							: '',
				},
			}
		);

		const data = await response.json();

		return data;
	} catch (error) {
		return {
			responseType: 'error',
			responseMessage:
				'Internal error. Please refresh the page. If the error persists, please contact the team',
			responseCode: 500,
			responseId: '0zUUyXnJIfikSxW1',
			responseUniqueCode: 'webapp_error',
			responsePayload: null,
		};
	}
};

export default fetchFounderProfileData;
