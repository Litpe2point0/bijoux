import { createSlice } from '@reduxjs/toolkit';
import { toastFormat } from '../../views/component_items/toast/toast';

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    toast_component : null,
  },
  reducers: {
    setToast: (state, action) => {
     
      //console.log(action.payload)
      state.toast_component =toastFormat({ color: action.payload.color,title: action.payload.title, mess: action.payload.mess }) ;
     
    },
    clearToast: (state) => {
        
      state.toast_component = null;
      
    },
  },
});
//setToast(toastFormat({ color: mess_color,title: 'Product id '+product.id, mess: mess }))


export const { setToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;