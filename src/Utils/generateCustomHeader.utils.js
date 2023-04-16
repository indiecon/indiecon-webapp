import encrypt from './encrypt.utils';

// This function generates a custom header for the API calls
// The header is encrypted using AES-256 encryption
// The header is a string of the following format:
// origin::timestamp::randomString
const generateCustomHeader = () => {
	const origin = 'indiecon_webapp';
	const timestamp = new Date().getTime();
	const randomString =
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15);

	const headerString = `${origin}::${timestamp}::${randomString}`;
	return encrypt(headerString);
};

export default generateCustomHeader;
