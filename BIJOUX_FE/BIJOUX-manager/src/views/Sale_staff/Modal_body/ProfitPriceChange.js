import React, { useContext, useEffect, useState, useRef } from "react";

import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CRow,
    CSpinner,
    CCard,
    CCardHeader,
    CCardBody,
    CPlaceholder,
    CPopover,
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody,
    CInputGroup,
    CInputGroupText
} from '@coreui/react'


const CustomForm = ({ profitRate, handleProfitRate,onClose }) => {

    const [profit_rate, setProfitRate] = useState(profitRate);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleProfitRate(profit_rate)
        onClose();
    }
    return (

        <CForm
            className="row g-3 needs-validation"
            onSubmit={handleSubmit}
        >

            <CCol md={12}>

                <CInputGroup >
                    <CFormInput type="number" min={0} max={100} className="" defaultValue={profit_rate} onChange={(e) => setProfitRate(parseFloat(e.target.value))} />
                    <CInputGroupText className="px-1">
                        %
                    </CInputGroupText>
                </CInputGroup>
            </CCol>
            <CCol xs={12} className="d-flex justify-content-center align-items-center">
                
                <CButton className="mx-2" color="success" type="submit" >
                    Calculate
                </CButton>

            </CCol>

        </CForm>
    )
}

const ProfitChange = ({ profitRate, handleProfitRate,onClose }) => {
    return (
        <CustomForm profitRate={profitRate} handleProfitRate={handleProfitRate} onClose={onClose} />
    );
};

export default ProfitChange;
