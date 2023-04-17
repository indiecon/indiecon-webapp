const founderProfileReducer = (state = {}, { type, payload }) => {
	switch (type) {
		case 'ADD_FOUNDER_PROFILE':
			return {
				...state,
				...payload,
			};
		case 'REMOVE_FOUNDER_PROFILE':
			return {
				...payload,
			};
		default:
			return state;
	}
};

export default founderProfileReducer;
