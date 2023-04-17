import generateCustomHeader from '../Utils/generateCustomHeader.utils';

const updateProfileData = async ({ data, profileType, token }) => {
	try {
		console.log(data);

		const backendUrl =
			process.env.REACT_APP_BACKEND_URL + '/' + profileType + '/update';

		const response = await fetch(backendUrl, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token,
				'x-custom-header':
					generateCustomHeader().responseType === 'success'
						? generateCustomHeader().responsePayload
						: '',
			},
			body: JSON.stringify(data),
		});

		const responseData = await response.json();

		return responseData;
	} catch (error) {
		return {
			responseType: 'error',
			responseUniqueCode: 'webapp_error',
			responsePayload: null,
			responseMessage: 'Error. Please contact the team.',
			responseId: 'kJfPfzqTb4isbCmW',
			responseCode: 500,
		};
	}
};

export default updateProfileData;
