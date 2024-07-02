import axios from 'axios';
import { backend_url } from '../Back_End_Url';
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';

// Tạo axios instance
const api_admin = axios.create({
  baseURL: backend_url + '/admin',
});

const api = axios.create({
  baseURL: backend_url,
});
const login_required_api = axios.create({
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

export const loginRequiredAlert = () => {

  Swal.fire({
    title: `You haven't login yet`,
    text: "Please login to continue!",
    icon: 'warning',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Login',
  }).then((result) => {
    if (result.isConfirmed) {
      const redirectUrl = window.location.href;
      localStorage.setItem('redirectUrl', redirectUrl);

      window.location.href = '/login';
    }
  })

};
export const instantAlertMaker = (icon, title, text) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'OK',
  })
};
export const paymentAlertMaker = (navigate, icon, title, text) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    allowOutsideClick: false,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'OK',
  }).then((result) => {
    if (result.isConfirmed) {
      navigate(window.location.pathname)
    }
  })
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

login_required_api.interceptors.request.use(
  (config) => {
    const token = getTokenFromPersist();

    if (token) {
      const decodedToken = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decodedToken.exp < now) {

        //window.location.href = '/#/login'; 
        // alert('ngu2')
        loginRequiredAlert();
        return Promise.reject(new Error('Token expired'));
      }

      //console.log(token)
      config.headers.Authorization = `Bearer ${token}`;
    } else {

      //window.location.href = '/#/login'; 
      loginRequiredAlert();
      return Promise.reject(new Error('No token found'));
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.request.use(
  (config) => {
    // const token = getTokenFromPersist();
    // config.headers.Authorization = `Bearer ${token}`;

    // const token = getTokenFromPersist();
    // if (token) {
    //   const decodedToken = jwtDecode(token);
    //   const now = Date.now() / 1000; 

    //   if (decodedToken.exp < now) {

    //     //window.location.href = '/#/login'; 
    //     loginRequiredAlert();
    //     return Promise.reject(new Error('Token expired'));
    //   }


    //   config.headers.Authorization = `Bearer ${token}`;
    // } else {

    //   //window.location.href = '/#/login'; 
    //   loginRequiredAlert();
    //   return Promise.reject(new Error('No token found'));
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api_admin.interceptors.request.use(
  (config) => {
    // const token = getTokenFromPersist();
    // config.headers.Authorization = `Bearer ${token}`;

    const token = getTokenFromPersist();
    if (token) {
      const decodedToken = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decodedToken.exp < now) {

        //window.location.href = '/#/login'; 
        loginRequiredAlert();
        return Promise.reject(new Error('Token expired'));
      }


      config.headers.Authorization = `Bearer ${token}`;
    } else {

      //window.location.href = '/#/login';
      loginRequiredAlert();
      return Promise.reject(new Error('No token found'));
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api_admin, api, login_required_api };
