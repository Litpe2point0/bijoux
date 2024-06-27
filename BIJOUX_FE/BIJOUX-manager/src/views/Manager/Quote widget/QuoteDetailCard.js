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
    CSpinner,
    CRow,
    CCol,
    CCardHeader,
    CFormInput,
    CInputGroupText,
    CInputGroup,
    CFormSelect,
    CFormTextarea,
} from '@coreui/react'
const QuoteDetailCard = ({ quote, title }) => {
    
    return (
        <CCard className="h-100">
            <CCardHeader className="text-center text-light fw-bold" >
                {title? title : 'INFORMATION OF QUOTE'} 
            </CCardHeader>
            <CCardBody className="d-flex flex-column justify-content-between">
                
                    <CRow>
                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center' >
                            <span style={{fontSize:'15px'}}>Quote ID: </span>
                        </CCol>
                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={`#${quote.id}`} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                            <span style={{fontSize:'15px'}}>Product ID: </span>
                        </CCol>
                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={quote.product.id} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                            <span style={{fontSize:'15px'}}>Quote Type: </span>
                        </CCol>
                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={"Customize"} />
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                            <span style={{fontSize:'15px'}}>Created: </span>
                        </CCol>
                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                            <CFormInput  disabled className="h-75 w-100 quote-detail-card" defaultValue={quote.created} />
                        </CCol>

                    </CRow>

                
            </CCardBody>
        </CCard>
    )


}
export default QuoteDetailCard