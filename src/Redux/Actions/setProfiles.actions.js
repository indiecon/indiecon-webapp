const setFounderProfileAction = (payload) => {
	return {
		type: 'ADD_FOUNDERS_PROFILE',
		payload,
	};
};

const setStartupProfileAction = (payload) => {
	return {
		type: 'ADD_STARTUPS_PROFILE',
		payload,
	};
};

const removeFounderProfileAction = () => {
	return {
		type: 'REMOVE_FOUNDERS_PROFILE',
		payload: {},
	};
};

const removeStartupProfileAction = () => {
	return {
		type: 'REMOVE_STARTUPS_PROFILE',
		payload: {},
	};
};

export {
	setFounderProfileAction,
	setStartupProfileAction,
	removeFounderProfileAction,
	removeStartupProfileAction,
};
