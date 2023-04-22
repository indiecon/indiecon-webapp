const setFoundersListAction = (foundersList) => {
	return {
		type: 'ADD_FOUNDER_LIST',
		payload: foundersList,
	};
};

const removeFoundersListAction = () => {
	return {
		type: 'REMOVE_FOUNDER_LIST',
	};
};

const setStartupsListAction = (startupsList) => {
	return {
		type: 'ADD_STARTUP_LIST',
		payload: startupsList,
	};
};

const removeStartupsListAction = () => {
	return {
		type: 'REMOVE_STARTUP_LIST',
	};
};

export {
	setFoundersListAction,
	removeFoundersListAction,
	setStartupsListAction,
	removeStartupsListAction,
};
