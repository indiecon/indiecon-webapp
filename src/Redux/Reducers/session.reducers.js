const sessionReducer = (state = { sessionActive: false }, action) => {
	switch (action.type) {
		case 'SIGN_IN':
			return {
				...state,
				sessionActive: true,
			};
		case 'SIGN_OUT':
			return {
				...state,
				sessionActive: false,
			};
		default:
			return state;
	}
};

export default sessionReducer;
