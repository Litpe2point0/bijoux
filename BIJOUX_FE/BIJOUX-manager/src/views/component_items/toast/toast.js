import React, { useEffect, useRef, useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastClose,
  CToastHeader,
  CToaster,
} from '@coreui/react'


export const toastFormat =({color, title,mess,})=> (
    <CToast title="CoreUI for React.js" color={color}>
      <CToastHeader   closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#007aff"></rect>
        </svg>
        <strong className="me-auto">{title}</strong>
        <small>7 min ago</small>
      </CToastHeader>
      <CToastBody>{mess}</CToastBody>
    </CToast>
  )

