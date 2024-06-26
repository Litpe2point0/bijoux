import storage from 'redux-persist/lib/storage'; // sử dụng sessionStorage
import { persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Slice bạn muốn lưu trữ, ví dụ như auth chứa JWT
};

export default persistConfig;