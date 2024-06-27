import { combineReducers } from 'redux';
import authReducer from './auth/authSlice';
import uiReducer from './ui/uiSlice';
import toastSlice from './notification/toastSlice';
// Import các reducer khác nếu cần

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  toast: toastSlice
  // Các reducer khác
});

export default rootReducer;