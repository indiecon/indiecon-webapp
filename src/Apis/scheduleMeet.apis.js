import generateCustomHeader from '../Utils/generateCustomHeader.utils';

const scheduleMeet = async ({
	inviteId,
	token,
	googleCode,
	meetingAcceptedDateAndTimeId,
}) => {
	try {
		const backendUrl =
			process.env.REACT_APP_BACKEND_URL +
			'/invite/status/' +
			inviteId +
			'/' +
			'accepted';

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
			body: JSON.stringify({
				googleCode,
				meetingAcceptedDateAndTimeId,
			}),
		});

		const responseData = await response.json();

		return responseData;
	} catch (error) {
		console.log(error);
		return {
			responseType: 'error',
			responseUniqueCode: 'webapp_error',
			responsePayload: null,
			responseMessage: 'Error. Please contact the team.',
			responseId: 'lNnzTTYsDxpV6gWm',
			responseCode: 500,
		};
	}
};

export default scheduleMeet;
