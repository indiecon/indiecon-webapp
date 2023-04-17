const startupProfileReducer = (state = {}, { type, payload }) => {
	switch (type) {
		case 'ADD_STARTUP_PROFILE':
			return {
				...state,
				...payload,
			};
		case 'REMOVE_STARTUP_PROFILE':
			return {
				...payload,
			};
		default:
			return state;
	}
};

export default startupProfileReducer;
