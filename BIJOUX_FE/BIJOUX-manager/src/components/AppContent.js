import React, { Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import { useDispatch, useSelector } from 'react-redux'
import { getUserFromPersist } from '../api/instance/axiosInstance'
import { checkTokenValidity } from '../useSyncTabs'

const AppContent = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    //console.log('auth', auth)
    if (auth.token && checkTokenValidity(auth.token)) {
      setReady(true)
    } else {
      setReady(false)
    }

  }, [auth]);
  return (
    <CContainer className="px-4 " xl style={{ minWidth: '100%' }}>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {ready && routes.map((route, idx) => {
            //console.log(route)
            return (
              route.element && (getUserFromPersist() && route.role_id?.some(item => item === getUserFromPersist().role_id)) && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element  {...route.props} />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
