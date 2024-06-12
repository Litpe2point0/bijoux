import React, { useContext, useEffect, useState,useRef } from "react";

import { faker } from "@faker-js/faker";
import { Link } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { delete_product_list, update_product_list } from "../../../../api/ProductApi";
import { MyContext } from "../ProductTable";
import { toastFormat } from "../../../component_items/toast/toast";
import {  setToast } from "../../../../redux/notification/toastSlice";
import { useDispatch } from "react-redux";

const status = ["warning", "danger", "success", "secondary"];

const tag = ["primary", "secondary", "info"];

const CustomStyles = ({ product }) => {
  const dispatch = useDispatch();
  const [validated, setValidated] = useState(true)
  const [disabled, setDisabled] = useState(false);

  const { onDataChange} = useContext(MyContext);

  const handleSubmit = async (event) => {
    
    event.preventDefault();
    const form = event.currentTarget
    
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }else if (form.checkValidity() === true){
      
      let response= await delete_product_list(product);
      setValidated(true);
      let mess='';
      let mess_color='';

      if (response.success) {
        onDataChange();
        mess= response.success;
        mess_color='success'
      } else if (response.error) {
        onDataChange();
        mess= response.error;
        mess_color='danger'
      }
      
      //setToast(toastFormat({ color: mess_color,title: 'Product id '+product.id, mess: mess }))
      dispatch(setToast({ color: mess_color,title: 'Product id '+product.id, mess: mess }))
      
    }
    
  }
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom01">Sure to remove Product id:</CFormLabel>
        <CFormInput type="text" id="validationCustom01" defaultValue={product.id}  disabled />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol xs={12} >
        <CButton color="primary" type="submit" disabled={disabled}>
          Confirm Remove
        </CButton>
      </CCol>
    </CForm>
  )
}

const RemoveForm = (props) => (

  <CustomStyles product={props.product} />
);

export default RemoveForm;
