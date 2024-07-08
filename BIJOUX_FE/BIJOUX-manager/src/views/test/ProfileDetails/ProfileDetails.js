import React, { useState } from "react";
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
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CButtonGroup,
  CButtonToolbar,
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CCardText,

  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle
} from '@coreui/react'
import { AdapterDateFnsBase } from "@mui/x-date-pickers/AdapterDateFnsBase";


function BasicDateTimePicker() {
  return (
    <div>
      
       <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker label="Basic date time picker" />
      </DemoContainer>
      
    </LocalizationProvider> 
    </div>


    /* <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker label="Basic date time picker" />
      </DemoContainer>
      abc
    </LocalizationProvider> */
  );
}

const ModalButton = (props) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <CButton color={props.color} onClick={() => setVisible(!visible)}>
        {props.content}
      </CButton>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>Woohoo, you&#39;re reading this text in a modal!
          <BasicDateTimePicker />

        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary">Save changes</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const CustomButtonComponent = (props) => {
  const [visible, setVisible] = useState(false);

  return (
    <div >
      <CButtonGroup style={{ display: 'flex' }} role="group" aria-label="Basic mixed styles example">
        <ModalButton color="danger" content="Left" />
        <ModalButton color="warning" content="Middle" />
        <ModalButton color="success" content="Right" />

      </CButtonGroup>

    </div>

  )
};

const ProfileDetails = () => {
  const state = {
    columnDefs: [
      { headerName: "Make", field: "make", flex: 1 },
      { headerName: "Model", field: "model", flex: 1 },
      { headerName: "Price", field: "price", flex: 1 },
      { headerName: "Button", cellRenderer: CustomButtonComponent, flex: 1 }

    ],
    rowData: [
      { make: "Toyota", model: "Celica", price: 35000 },
      { make: "Ford", model: "Mondeo", price: 32000 },
      { make: "Porsche", model: "Boxster", price: 72000 }
    ]
  }

  return (
    <>
      <div
        className="ag-theme-quartz"
        style={{
          height: '500px',
          width: '100%'
        }}
      >
        <AgGridReact
          columnDefs={state.columnDefs}
          rowData={state.rowData}>
        </AgGridReact>

      </div>
      <CCard style={{ width: '18rem' }}>
        <CCardImage orientation="top" src={"http://127.0.0.1:8000/3D_upload/1715180317_unknow.png"} />
        <CCardBody>
          <CCardTitle>Card title</CCardTitle>
          <CCardText>
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </CCardText>
          <CButton color="primary" href="#">Go somewhere</CButton>
        </CCardBody>
      </CCard>
      <BasicDateTimePicker />

    </>


  );

}

export default ProfileDetails;
