// @flow

import {combineReducers} from 'redux';
import SignReducer from './sign';

const rootReducer = combineReducers({
  sign: SignReducer
});

export default rootReducer;
