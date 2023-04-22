import generateCustomHeader from '../Utils/generateCustomHeader.utils';

// type can be founder or startup.
const fetchPublicProfileData = async ({ id, type }) => {
	try {
		const response = await fetch(
			process.env.REACT_APP_BACKEND_URL + `/${type}/details/${id}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
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
			responseId: '3hXNxU2r5yssvfZt',
			responseUniqueCode: 'webapp_error',
			responsePayload: null,
		};
	}
};

export default fetchPublicProfileData;
