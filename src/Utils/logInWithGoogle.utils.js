import { signInWithPopup } from 'firebase/auth';

import loginFounder from '../Apis/loginFounder.apis';

import { auth, provider } from '../Config/firebase.config';

const logInWithGoogle = async () => {
	try {
		const result = await signInWithPopup(auth, provider);

		const { user } = result;

		if (!user || !user.email) {
			return {
				responseType: 'error',
				responseUniqueCode: 'webapp_error',
				responsePayload: null,
				responseMessage: 'Error logging in. Please contact the team.',
				responseId: 'kQAmpp1VyP1czuD1',
				responseCode: 500,
			};
		}

		const { email } = user;

		const backendResponse = await loginFounder({ email });
		// no need to check if error or success because in either case, we have to return the response for the caller function to check.

		return backendResponse;
	} catch (error) {
		return {
			responseType: 'error',
			responseUniqueCode: 'webapp_error',
			responsePayload: null,
			responseMessage: 'Error logging in. Please contact the team.',
			responseId: 'deNR64KpiirqW9Sf',
			responseCode: 500,
		};
	}
};

export default logInWithGoogle;
