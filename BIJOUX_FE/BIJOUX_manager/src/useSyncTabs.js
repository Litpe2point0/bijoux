import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getTokenFromPersist, getUserFromPersist } from './api/instance/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { clearAuthToken, setAuthToken } from './redux/auth/authSlice';
import { set } from './redux/ui/uiSlice';
import { jwtDecode } from "jwt-decode";



export const checkTokenValidity = (token) => {
  

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const now = Date.now() / 1000; // thời gian hiện tại tính bằng giây
      //alert(decodedToken.exp+  " và "+ now)
      if (decodedToken.exp < now) {
        //alert("TOKEN HẾT HẠN")
        return false;
      }else{
        //alert("TOKEN còn HẠN")
      }
      return true;
    } catch (error) {
      console.error("Error decoding token:", error);
      //alert('TOKEN KHÔNG HỢP LỆ')
      return false;
    }
  }
  return false;
};




const useSyncTabs = () => {
  const dispatch = useDispatch();
  //const navigate = useNavigate();



  useEffect(() => {
  
    const handleStorageChange = () => {
      const token = getTokenFromPersist();
      const user = getUserFromPersist();

      if (token == null) {
        //alert("trong use handleStorageChange trong default layout")
        dispatch(clearAuthToken())
        window.location.href = '/#/login';
      } else {
        if(checkTokenValidity(token)){
          const saveInfo = {
            token: token,
            user: user,
          };
  
          dispatch(setAuthToken(saveInfo))
        }else{
          dispatch(clearAuthToken());
          window.location.href = '/#/login';

        }

        
        //alert("ngu")
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [ dispatch]);

};

export default useSyncTabs;
