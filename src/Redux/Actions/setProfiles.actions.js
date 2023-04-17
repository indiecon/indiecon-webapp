const setFounderProfileAction = (payload) => {
	return {
		type: 'ADD_FOUNDER_PROFILE',
		payload,
	};
};

const setStartupProfileAction = (payload) => {
	return {
		type: 'ADD_STARTUP_PROFILE',
		payload,
	};
};

const removeFounderProfileAction = () => {
	return {
		type: 'REMOVE_FOUNDER_PROFILE',
		payload: {},
	};
};

const removeStartupProfileAction = () => {
	return {
		type: 'REMOVE_STARTUP_PROFILE',
		payload: {},
	};
};

export {
	setFounderProfileAction,
	setStartupProfileAction,
	removeFounderProfileAction,
	removeStartupProfileAction,
};
