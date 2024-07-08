import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,

} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { SignOut, SignIn } from "phosphor-react";
import { set } from '../redux/ui/uiSlice'
import { clearAuthToken } from '../redux/auth/authSlice'
import { clearToast, setToast } from '../redux/notification/toastSlice'

const AppHeader = () => {
  const auth = useSelector((state) => state.auth);
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);

  const dispatch = useDispatch()

  const [user, setUser] = useState(auth.user ? auth.user : null);

  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')




  // const sidebarShow = ui.sidebarShow;
  //const sidebarShow = useSelector((state) => state.sidebarShow);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  useEffect(() => {
    if (auth.token) {
      setUser(auth.user);
    }
  }, [auth]);

  const handleLogout = () => {

    dispatch(clearAuthToken());
    dispatch(clearToast());
  }
  return (
    <CHeader style={{height:"fit-content"}} position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => {

            dispatch(set({ sidebarShow: !sidebarShow }))
          }}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="md" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="md" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="md" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="md" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="md" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="md" />
              ) : (
                <CIcon icon={cilSun} size="md" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="md" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="md" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="md" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

        </CHeaderNav>


        {user ? (
          <CHeaderNav >
            <AppHeaderDropdown user={user} />
            <CNavItem className='mx-3'>
              <CButton onClick={handleLogout} title='logout' className='bg-danger btn-sm fw-bold'>
                LOG OUT
                <SignOut className='fw-bold' size={25} color="hotpink" weight="bold" />
              </CButton>
            </CNavItem>
          </CHeaderNav>
        ) : (
          <CHeaderNav >
            <CNavItem className='mx-1'>
              <CButton href="#/login" title='login' className='bg-info fw-bold'>
                LOG IN
                <SignIn size={32} color="aqua" weight="bold" />

              </CButton>
            </CNavItem>
          </CHeaderNav>

        )}
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>

    </CHeader>
  )
}

export default AppHeader
