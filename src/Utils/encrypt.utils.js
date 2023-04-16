// function to encrypt a string or object using AES encryption
import CryptoJS from 'crypto-js';

// data can be an object or a string
const encrypt = (data) => {
	try {
		const key = process.env.REACT_APP_ENCRYPTION_KEY;
		// encrypted is an object of type CryptoJS.lib.CypherParams. We have to convert it to string later.
		// we are stringifying the data because it could be an object. But if it's a string we still need to stringify because in the decrypt function we are parsing the stringified data. So, it's better to stringify it here.
		const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key);
		const encryptedString = encrypted.toString();

		return {
			responseType: 'success',
			responseMessage: '',
			responseUniqueCode: 'webapp_success',
			responseCode: 200,
			responseId: 'Vedqy5NiTyKs0wGm',
			responsePayload: encryptedString,
		};
	} catch (err) {
		console.log(err);
		return {
			responseType: 'error',
			responseUniqueCode: 'webapp_error',
			responsePayload: null,
			responseMessage: 'Internal error. Please contact the team.',
			responseCode: 500,
			responseId: 'tEHtQVfJ5yWmFmki',
		};
	}
};

export default encrypt;
