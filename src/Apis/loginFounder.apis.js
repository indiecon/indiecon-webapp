import generateCustomHeader from '../Utils/generateCustomHeader.utils';

const loginFounder = async (context) => {
	try {
		let { email } = context;

		if (!email || typeof email !== 'string' || !email.trim()) {
			return {
				responseType: 'error',
				responseUniqueCode: 'webapp_error',
				responsePayload: null,
				responseMessage: 'Error logging in. Please contact the team.',
				responseId: 'kPIT9KoxVaoN9TFt',
				responseCode: 500,
			};
		}

		email = email.trim();

		// test email
		const emailRegex = new RegExp(
			'^(([^<>()[\\]\\.,;:\\s@"]+(\\.[^<>()[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
		);
		if (!emailRegex.test(email)) {
			return {
				responseType: 'error',
				responseUniqueCode: 'webapp_error',
				responsePayload: null,
				responseMessage: 'Error logging in. Please contact the team.',
				responseId: 'Hay5Aer2689TDkza',
				responseCode: 500,
			};
		}

		const response = await fetch(
			process.env.REACT_APP_BACKEND_URL + '/founder/auth',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-custom-header':
						generateCustomHeader().responseType === 'success'
							? generateCustomHeader().responsePayload
							: '',
				},
				body: JSON.stringify({ email }),
			}
		);

		const fetchedData = await response.json();
		const { responseType, responsePayload } = fetchedData;
		if (responseType !== 'success') {
			// can return the error message from the backend. The message should be readable by the user.
			return fetchedData;
		}

		// validating the response payload.
		const { token } = responsePayload;
		if (!token || typeof token !== 'string' || !token.trim()) {
			return {
				responseType: 'error',
				responseUniqueCode: 'webapp_error',
				responsePayload: null,
				responseMessage: 'Error logging in. Please contact the team.',
				responseId: 'cVlpBWq3Y91qtLOr',
				responseCode: 500,
			};
		}

		return fetchedData;
	} catch (error) {
		return {
			responseType: 'error',
			responseUniqueCode: 'webapp_error',
			responsePayload: null,
			responseMessage: 'Error logging in. Please contact the team.',
			responseId: 'cVlpBWq3Y91qtLOr',
			responseCode: 500,
		};
	}
};

export default loginFounder;
