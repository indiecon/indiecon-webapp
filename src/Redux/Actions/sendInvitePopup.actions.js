const openSendInvitePopup = (payload) => {
	return {
		type: 'OPEN_SEND_INVITE_POPUP',
		payload,
	};
};

const closeSendInvitePopup = () => {
	return {
		type: 'CLOSE_SEND_INVITE_POPUP',
	};
};

export { openSendInvitePopup, closeSendInvitePopup };
