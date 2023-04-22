import { combineReducers } from 'redux';

import sessionReducer from './session.reducers';
import founderProfileReducer from './founderProfile.reducers';
import startupProfileReducer from './startupProfile.reducers';
import founderListReducer from './foundersList.reducers';
import startupListReducer from './startupsList.reducers';

const rootReducer = combineReducers({
	founderProfile: founderProfileReducer,
	userSession: sessionReducer,
	startupProfile: startupProfileReducer,
	foundersList: founderListReducer,
	startupsList: startupListReducer,
});

export default rootReducer;
