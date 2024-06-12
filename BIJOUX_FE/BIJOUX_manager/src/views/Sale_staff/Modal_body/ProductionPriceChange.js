import React, { useContext, useEffect, useState, useRef } from "react";

import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText
} from '@coreui/react'



const CustomForm = ({ productionPrice, handleProductionPrice,onClose }) => {

    const [production_price, setProductionPrice] = useState(productionPrice);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleProductionPrice(production_price)
        onClose();
    }
    return (

        <CForm
            className="row g-3 needs-validation"
            onSubmit={handleSubmit}
        >

            <CCol md={12}>

                <CInputGroup >
                    <CFormInput type="number" min={0}  className="" defaultValue={production_price} onChange={(e) => setProductionPrice(parseFloat(e.target.value))} />
                    <CInputGroupText className="px-1">
                        vnd
                    </CInputGroupText>
                </CInputGroup>
            </CCol>
            <CCol xs={12} className="d-flex justify-content-center align-items-center">
                
                <CButton className="mx-2" color="success" type="submit" >
                    Carculate
                </CButton>

            </CCol>

        </CForm>
    )
}

const ProductionPriceChange = ({ productionPrice, handleProductionPrice,onClose }) => {
    return (
        <CustomForm productionPrice={productionPrice} handleProductionPrice={handleProductionPrice} onClose={onClose} />
    );
};

export default ProductionPriceChange;
