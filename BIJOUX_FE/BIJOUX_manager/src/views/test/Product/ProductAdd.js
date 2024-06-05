import React, { createContext, useEffect, useState, useRef, useContext } from "react";
import { faker } from "@faker-js/faker";
import { Link } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardHeader,
  CCardBody,
  CCardImage,
  CCardTitle,
  CCardText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CCol,
  CForm,
  CToaster
} from '@coreui/react'
import { AdapterDateFnsBase } from "@mui/x-date-pickers/AdapterDateFnsBase";
import { get_product_list, update_product_list } from "../../../api/ProductApi";
import axios from 'axios';
import UpdateForm from "./forms/UpdateForm";
import RemoveForm from "./forms/RemoveForm";
import AddForm from "./forms/AddForm";


export const AddContext = createContext();

function BasicDateTimePicker() {
  return (
    <div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateTimePicker']}>
          <DateTimePicker label="Basic date time picker" />
        </DemoContainer>

      </LocalizationProvider>
    </div>

  );
}



const ProductAdd = () => {
  let [table, setTable] = useState([]);
  // Tạo một context mới
  const [toast, setToast] = useState(0)



  return (
    <>
      {/* <CToaster push={toast}  placement="top-end" /> */}
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Add Form</strong>
        </CCardHeader>
        <CCardBody>
          <AddForm />
        </CCardBody>
      </CCard>
      <BasicDateTimePicker />
    </>







  );

}


export default ProductAdd;
