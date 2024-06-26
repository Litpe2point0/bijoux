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
import { ArrowCircleDown, ArrowCircleUp, CurrencyCircleDollar, Eye, Pencil, PlusCircle, UserCirclePlus } from "phosphor-react";
import { Button, ButtonGroup, IconButton } from "@mui/material";
export const Staff_Page_Context = createContext();


const PriceCard = ({ quote, handleChange }) => {
    const [profitRate, setProfitRate] = useState(quote.profit_rate)
    const [productionPrice, setProductionPrice] = useState(quote.production_price)


    useEffect(() => {
        handleChange(profitRate, productionPrice )
    },[profitRate,productionPrice] )
    return (
        <CCard className="bg-light metal-card" >
            <CCardHeader   >
                <CRow>
                    <CCol md={2} className="text-dark fw-bold fs-5 d-flex align-items-center">Price</CCol>

                </CRow>
            </CCardHeader>
            <CCardBody>
                <CRow className="w-100 my-2">
                    <CCol sm={6} md={6} lg={6} >
                        <span className="text-dark">Profit Rate: </span>
                    </CCol>
                    <CCol sm={6} md={6} lg={6} >

                        <CInputGroup >

                            <CFormInput type="number" step={50} min={0} max={100} disabled className="h-50 quote-detail-card" value={profitRate} />

                            <CInputGroupText className="p-0 m-0 "  >
                                    <IconButton  className="p-0 m-0" variant="contained" onClick={() => profitRate < 100 && setProfitRate(profitRate + 5)}>
                                        <ArrowCircleUp size={20} color="lime" weight="duotone" />

                                    </IconButton>
                                    <IconButton className="p-0 m-0" variant="contained" onClick={() => profitRate > 0 && setProfitRate(profitRate - 5)} >
                                        <ArrowCircleDown size={20} color="crimson" weight="duotone" />

                                    </IconButton>
                                

                            </CInputGroupText>
                        </CInputGroup>
                    </CCol>
                </CRow>
                <CRow className="w-100 my-2">
                    <CCol sm={6} md={6} lg={6}>
                        <span className="text-dark" >Production Price: </span>
                    </CCol>
                    <CCol sm={6} md={6} lg={6}>
                        <CInputGroup >
                            <CFormInput type="number" min={0} className="h-50 quote-detail-card" defaultValue={productionPrice}  onChange={(e)=>setProductionPrice(parseFloat(e.target.value)>0)}/>
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
export default PriceCard