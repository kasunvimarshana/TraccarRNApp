import { combineReducers } from 'redux';
import counter from './counterReducer';
import head from './headReducer';
import user from './userReducer';
import { RESET_STORE } from '../actions/actionTypes';
 
// to combine all reducers together
const appReducer = combineReducers({
  counter,
  head,
  user
});
 
// reset the state of a redux store
const rootReducer = (state, action) => {
  if (action.type === RESET_STORE) {
    state = undefined;
  }
  return appReducer(state, action)
}
 
export default rootReducer;