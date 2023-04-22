const startupListReducer = (state = [], action) => {
	switch (action.type) {
		case 'ADD_STARTUPS_LIST':
			// only add new elements to the list if the action.payload.id is not already in the list
			const newElements = action.payload.filter(
				(element) =>
					!state.some((stateElement) => stateElement.id === element.id)
			);

			return [...state, ...newElements];
		case 'REMOVE_STARTUPS_LIST':
			return [];
		default:
			return state;
	}
};

export default startupListReducer;
