// @flow

import {combineReducers} from 'redux';
import { bsDmReducer } from '@brightsign/bsdatamodel';
import presentationReducer from './presentation';

const rootReducer = combineReducers({
  bsdm: bsDmReducer,
  presentation: presentationReducer
});

export default rootReducer;
