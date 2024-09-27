import { combineReducers } from 'redux';
import authReducer from './auth/authSlice';
import orebiSlice from './orebi/orebiSlice';
// import toastSlice from './notification/toastSlice';
// import uiReducer from './ui/uiSlice';
// Import các reducer khác nếu cần

const rootReducer = combineReducers({
  auth: authReducer,
  orebiReducer: orebiSlice,
});

export default rootReducer;