import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";
import { AgGridReact } from 'ag-grid-react';

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
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
import { ArrowCircleUp, CurrencyCircleDollar, Eye, Pencil, PlusCircle, UserCirclePlus } from "phosphor-react";
export const Staff_Page_Context = createContext();


const OtherCard = ({ mountingType, quote, product, handleChange }) => {
    const [typeId, setTypeId] = useState(product.mounting_type ? product.mounting_type.id : null);
    const [size, setSize] = useState(product.mounting_size)
    useEffect(() => {
        handleChange(typeId, size)
    }, [typeId, size])
    return (
        <CCard className="bg-light metal-card" >
            <CCardHeader   >
                <CRow>
                    <CCol md={12} className="text-dark fw-bold fs-5 d-flex align-items-center">Additional Information</CCol>

                </CRow>
            </CCardHeader>
            <CCardBody>
                <CRow className="w-100 my-2">
                    <CCol sm={6} md={6} lg={6} >
                        <span className="text-dark">Mounting Type: </span>
                    </CCol>
                    <CCol sm={6} md={6} lg={6} >

                        <CInputGroup >
                            <CFormSelect size="sm" className="quote-detail-card " aria-label="Small select example"  
                            onChange={(e) =>{ 
                                if(e.target.value == null || isNaN(e.target.value) || e.target.value == 3){
                                    setSize(0.0)
                                }    
                                setTypeId(parseInt(e.target.value) )}}>
                                <option  value={null} selected={!product.mounting_type}>
                                    No Specific Type
                                </option>
                                {mountingType.map((type) => (
                                    <option key={type.id} value={type.id} selected={product.mounting_type && type.id === product.mounting_type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </CFormSelect>
                            <CInputGroupText className="px-1 py-0">
                                <Pencil size={15} color="white" weight="duotone" />
                            </CInputGroupText>
                        </CInputGroup>
                    </CCol>
                </CRow>
                <CRow className="w-100 my-2">
                    <CCol sm={6} md={6} lg={6}>
                        <span className="text-dark" >Mounting Size: </span>
                    </CCol>
                    <CCol sm={6} md={6} lg={6}>
                        <CInputGroup >
                            <CFormInput 
                            type="number" 
                            step={0.25} 
                            className="h-50  quote-detail-card " 
                            defaultValue={product.mounting_size} 
                            value={size}
                            disabled={!typeId || typeId >2  } onChange={(e) => setSize(parseFloat(e.target.value))} />
                            <CInputGroupText className="px-1 py-0">
                                <Pencil size={15} color="white" weight="duotone" />
                            </CInputGroupText>
                        </CInputGroup>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    )
}
export default OtherCard