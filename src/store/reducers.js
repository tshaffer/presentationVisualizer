// @flow

import {combineReducers} from 'redux';
import PlaceholderReducer from './placeholder';

const rootReducer = combineReducers({
  sign: PlaceholderReducer
});

export default rootReducer;
