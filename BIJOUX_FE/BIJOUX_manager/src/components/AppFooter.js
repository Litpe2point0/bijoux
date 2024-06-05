import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4 py-1 d-flex justify-content-center" style={{height:'fit-content'}}>
      <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          Bijoux
        </a>
        <span className="ms-1">&copy; 2024 creativeLabs.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
