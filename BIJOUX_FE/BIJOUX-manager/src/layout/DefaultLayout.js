import React, { useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTokenFromPersist, getUserFromPersist } from '../api/instance/axiosInstance';
import { checkTokenValidity } from '../useSyncTabs';
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CCardText,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,

  CToaster
} from '@coreui/react'
import { clearAuthToken } from '../redux/auth/authSlice';

const DefaultLayout = () => {
  const dispatch = useDispatch();
  const [toast, setToast] =useState(null);
  const new_toast = useSelector((state) => state.toast.toast_component);

  
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  

  useEffect(() => {
    //console.log(new_toast)
    setToast(new_toast);
  }, [new_toast]);


  

  
  useEffect(() => {
    if (!auth.token || !checkTokenValidity(auth.token) ) {
      //alert("đang navigate sang log in ")
      dispatch(clearAuthToken())
      navigate('/login');
    }
  }, [auth, navigate]);



  return (

    <div>
    <CToaster push={toast} placement="top-end" />
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
        
          <AppContent />

        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
