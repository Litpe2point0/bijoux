
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarShow: true,
  theme: 'light',
  //unfoldable: true
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    set: (state, action) => {
        //alert(action.payload.sidebarShow);
      return { ...state, ...action.payload };
    },
  },
});

export const { set } = uiSlice.actions;
export default uiSlice.reducer;
