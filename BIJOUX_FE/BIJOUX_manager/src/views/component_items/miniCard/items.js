import React from 'react'
import {
    CBreadcrumb,
    CBreadcrumbItem,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CButton,
    CCardText,
    CCardImage,
    CCardTitle
} from '@coreui/react'

function CustomCard(item) {
    return (

        <CCard className='p-0 ' style={{ width: '100px' }}>
            <CCardHeader className='bg-light py-2 d-flex justify-content-center'>
                <svg  fill='none' viewBox="0 0 18 18" style={{ width: 'fit-content' }} height="40" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="#151542" stroke-linejoin="bevel" stroke-width="0.3" d={item.path} />
                </svg>

            </CCardHeader>

            <CCardBody className='p-0'>
                <CCardTitle >
                    <p className="fs-6">{item.name}</p>
                </CCardTitle>
            </CCardBody>
        </CCard>
    )

}

export default function Items({item}) {
    return (    
              <CustomCard {...item}  />
    )
}


