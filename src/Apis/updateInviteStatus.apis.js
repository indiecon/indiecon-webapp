import generateCustomHeader from '../Utils/generateCustomHeader.utils';

const updateInviteData = async ({ inviteId, status, token }) => {
	try {
		const backendUrl =
			process.env.REACT_APP_BACKEND_URL +
			'/invite/status/' +
			inviteId +
			'/' +
			status;

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
		});

		const responseData = await response.json();

		return responseData;
	} catch (error) {
		return {
			responseType: 'error',
			responseUniqueCode: 'webapp_error',
			responsePayload: null,
			responseMessage: 'Error. Please contact the team.',
			responseId: 'bnR56YuxV4MSYey1',
			responseCode: 500,
		};
	}
};

export default updateInviteData;
