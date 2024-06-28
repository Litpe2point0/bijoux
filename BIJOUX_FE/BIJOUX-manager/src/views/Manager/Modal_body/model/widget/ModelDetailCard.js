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
const ModelDetailCard = ({ model, title }) => {

    return (
        <CCard className="h-100">
            <CCardHeader className="text-center text-light fw-bold" >
                {title ? title : 'INFORMATION OF QUOTE'}
            </CCardHeader>
            <CCardBody className="d-flex flex-column justify-content-between">
                <CRow>
                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center' >
                        <span style={{ fontSize: '15px' }}>Name: </span>
                    </CCol>
                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                        <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={model.name} />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center' >
                        <span style={{ fontSize: '15px' }}>Mounting Type: </span>
                    </CCol>
                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                        <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={model.mounting_type.name} />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                        <span style={{ fontSize: '15px' }}>Mounting Style: </span>
                    </CCol>
                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                        <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={model.mounting_style.name} />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                        <span style={{ fontSize: '15px' }}>Base Width: </span>
                    </CCol>
                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                        <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={model.base_width} />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                        <span style={{ fontSize: '15px' }}>Base Height: </span>
                    </CCol>
                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                        <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={model.base_height} />
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                        <span style={{ fontSize: '15px' }}>Volume: </span>
                    </CCol>
                    <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                        <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={model.volume ? model.volume : 'No Specific Volume ('+(model.mounting_type.name)+')'} />
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    )


}
export default ModelDetailCard