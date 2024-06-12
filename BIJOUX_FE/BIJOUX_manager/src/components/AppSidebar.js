import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import normalNavigation from '../_nav_sample'
import roleNavigation from '../_roleNav'
import { jwtDecode } from 'jwt-decode'
import { set } from '../redux/ui/uiSlice'
import { clearToast } from '../redux/notification/toastSlice'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const navigate= useNavigate();
  //let navigation = normalNavigation;
  const [navigation, setNavigation] = useState(normalNavigation);
  
  
  
  //const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  //const sidebarShow = useSelector((state) => state.sidebarShow)



  //const unfoldable = useSelector((state) => state.ui)
  const sidebarShow = useSelector((state) => state.ui.sidebarShow)


  const auth = useSelector((state) => state.auth);
  //alert(auth.token)

  const change_login_role = (auth) => {
    if(auth.token){
      const user = jwtDecode(auth.token);
      setNavigation(roleNavigation(user.role_id, user.id));
      
    }else{
      dispatch(clearToast())
      navigate("/login")
    }
    
  }

  useEffect(() => {
    change_login_role(auth);
  }, [auth])

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      //unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(set({ sidebarShow: visible }))
        //dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom py-0" >
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={20} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton 
          size={10}
          className="d-lg-none"
          dark
          onClick={() => {
            dispatch(set({ sidebarShow: false }))
            //dispatch({ type: 'set', sidebarShow: false })}
          }}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
