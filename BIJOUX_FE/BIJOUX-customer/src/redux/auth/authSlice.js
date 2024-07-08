import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
  },
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user; // Giải mã JWT để lấy thông tin user nếu cần
    },
    clearAuthToken: (state) => {
        
      state.token = null;
      state.user = null;
      //console.log("Persist: ",JSON.parse(localStorage.getItem('persist:root')));
      //localStorage.removeItem('persist:root')
    },
  },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;
export default authSlice.reducer;