const invitePopupStateReducer = (state = {}, { type, payload }) => {
	switch (type) {
		case 'OPEN_SEND_INVITE_POPUP':
			return {
				...state,
				...payload,
			};
		case 'CLOSE_SEND_INVITE_POPUP':
			return {};
		default:
			return state;
	}
};

export default invitePopupStateReducer;
