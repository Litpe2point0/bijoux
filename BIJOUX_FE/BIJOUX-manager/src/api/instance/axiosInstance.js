import axios from 'axios';
import { backend_url } from '../Back_End_Url';
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux';
import { clearAuthToken } from '../../redux/auth/authSlice';
import { get_account_detail, get_update_account_detail } from '../main/accounts/Account_api';

// Tạo axios instance
const api_admin = axios.create({
  baseURL: backend_url + '/admin',
});

const api = axios.create({
  baseURL: backend_url,
});

// Lấy token từ Redux Persist
export const getTokenFromPersist = () => {
  try {
    const persistedState = JSON.parse(localStorage.getItem('persist:root'));
    if (persistedState && persistedState.auth) {
      const authState = JSON.parse(persistedState.auth);
      return authState.token;
    }
  } catch (error) {
    console.error('Error getting token from persisted state:', error);
  }
  return null;
};

// Lấy token từ Redux Persist
export const getUserFromPersist = () => {
  try {
    const persistedState = JSON.parse(localStorage.getItem('persist:root'));
    if (persistedState && persistedState.auth) {
      const authState = JSON.parse(persistedState.auth);
      return authState.user;
    }
  } catch (error) {
    console.error('Error getting user from persisted state:', error);
  }
  return null;
};

// api.interceptors.request.use(
//   (config ) => {
//     const token = getTokenFromPersist();



//     if (token) {
//       const decodedToken = jwtDecode(token);
//       const now = Date.now() / 1000; 

//       if (decodedToken.exp < now) {

//         window.location.href = '/#/login'; 
//         return Promise.reject(new Error('Token expired'));
//       }


//       config.headers.Authorization = `Bearer ${token}`;
//     } else {

//       window.location.href = '/#/login'; 
//       return Promise.reject(new Error('No token found'));
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// api_admin.interceptors.request.use(
//   (config ) => {
//     const token = getTokenFromPersist();



//     if (token) {
//       const decodedToken = jwtDecode(token);
//       const now = Date.now() / 1000; 

//       if (decodedToken.exp < now) {

//         window.location.href = '/#/login'; 
//         return Promise.reject(new Error('Token expired'));
//       }


//       config.headers.Authorization = `Bearer ${token}`;
//     } else {

//       window.location.href = '/#/login'; 
//       return Promise.reject(new Error('No token found'));
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
api.interceptors.request.use(
  async (config) => {
    const check_deactivate = await checkDeactivate(getUserFromPersist());
    if (check_deactivate == false) {
      //localStorage.removeItem('persist:root');
      window.location.href = '/#/login';
      return Promise.reject(new Error('is deactivated'));
    }

    const token = getTokenFromPersist();
    if (token) {
      const decodedToken = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decodedToken.exp < now) {

        window.location.href = '/#/login';
        return Promise.reject(new Error('Token expired'));
      }


      config.headers.Authorization = `Bearer ${token}`;
    } else {

      window.location.href = '/#/login';
      return Promise.reject(new Error('No token found'));
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api_admin.interceptors.request.use(
  async (config) => {
    const check_deactivate = await checkDeactivate(getUserFromPersist());
    if (check_deactivate == false) {
      //localStorage.removeItem('persist:root');
      window.location.href = '/#/login';
      return Promise.reject(new Error('is deactivated'));
    }

    const token = getTokenFromPersist();
    if (token) {
      const decodedToken = jwtDecode(token);
      const now = Date.now() / 1000;



      if (decodedToken.exp < now) {

        window.location.href = '/#/login';
        return Promise.reject(new Error('Token expired'));
      }


      config.headers.Authorization = `Bearer ${token}`;
    } else {

      window.location.href = '/#/login';
      return Promise.reject(new Error('No token found'));
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const checkDeactivate = async (user) => {
 
  const formData = new FormData();
  formData.append('account_id', user.id);
  let response = await get_update_account_detail(formData);
  if (response.success  && response.data.account_detail.deactivated == 0) {
    //alert(user.id)
    return true;
  } else {
    return false;
  }
}

export { api_admin, api };
