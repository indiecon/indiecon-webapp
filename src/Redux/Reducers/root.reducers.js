import { combineReducers } from 'redux';

import sessionReducer from './session.reducers';
import founderProfileReducer from './founderProfile.reducers';
import startupProfileReducer from './startupProfile.reducers';

const rootReducer = combineReducers({
	founderProfile: founderProfileReducer,
	userSession: sessionReducer,
	startupProfile: startupProfileReducer,
});

export default rootReducer;
