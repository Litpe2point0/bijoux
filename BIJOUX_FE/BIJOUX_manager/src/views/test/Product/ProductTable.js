import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";
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
  CCardBody,
  CCardImage,
  CCardTitle,
  CCardText,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,

  CToaster
} from '@coreui/react'
import { AdapterDateFnsBase } from "@mui/x-date-pickers/AdapterDateFnsBase";
import { get_product_list, update_product_list } from "../../../api/ProductApi";
import axios from 'axios';
import UpdateForm from "./forms/UpdateForm";
import RemoveForm from "./forms/RemoveForm";
import CustomAgGrid from "./agGridCustom/CustomAgGrid";
import AddForm from "./forms/AddFormInside";
import StoneShapeGroup from "../ItemsManage/StoneShape/MiniCardGroup";
import Modal_Button from "./../../component_items/Modal/ModalButton"
import stone_shapes from "../../../api/Stone_Shapes";
//import 'bootstrap/dist/css/bootstrap.css';



export const MyContext = createContext();

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



const CustomButtonComponent = (props) => {
  const [visible, setVisible] = useState(false);

  return (

    <CButtonGroup vertical style={{ width: '100%',height:"100%" }} role="group" aria-label="Basic mixed styles example">
      <Modal_Button title={"Add new product"} content={"Add"} color={'success'}><AddForm /></Modal_Button>
      <CButton className="p-0 " color="warning">Detail</CButton>
      <Modal_Button title={props.update_modal_title} content={props.update_modal_button} color={props.update_button_color} >{props.updateForm}</Modal_Button>
      <Modal_Button title={props.remove_modal_title} content={props.remove_modal_button} color={props.remove_button_color} >{props.removeForm}</Modal_Button>

    </CButtonGroup>
  )
};


const ProductTable = () => {
  let [table, setTable] = useState([]);
  // Tạo một context mới
  const [toast, setToast] = useState(0)
  let [loading, setLoading] = useState(true);

  const handleTableChange = () => {
    //setTable(new_table)
    const get_list = async () => {
      const studentList = await get_product_list();
      setTable(studentList);
    }
    get_list();
  }
  const state = {
    columnDefs: [
      { headerName: "id", field: "id" },
      {
        headerName: "image",
        cellRenderer: (params) => {
          return (

            <CCard style={{ width: '50%' }}>
              <CCardImage orientation="top" src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}/image_upload/${params.data.imageUrl}`} />
            </CCard>

          )

        },
        flex: 2,
        editable: false,
      },
      { headerName: "name", field: "name" },
      { headerName: "price", field: "price" },
      { headerName: "quantity", field: "quantity" },
      {
        headerName: "Button",
        cellRenderer: (params) => {
          const Modal_button_props = {
            updateForm: <UpdateForm product={params.data} />,
            removeForm: <RemoveForm product={params.data} />,
            update_modal_title: 'Update Product id: ' + params.data.id,
            remove_modal_title: 'Remove Product id: ' + params.data.id,

            update_modal_button: 'Update',
            remove_modal_button: 'Remove',

            update_button_color: 'success',
            remove_button_color: 'danger',
          }
          return (
            // <CustomButtonComponent {...params.data}></CustomButtonComponent>
            // <CustomButtonComponent updateForm={<UpdateForm product={params.data} />} removeForm={<RemoveForm product={params.data} />}  handle={handleTableChange}/> 
            <CustomButtonComponent {...Modal_button_props} />

          )

        },
        flex: 1,
        editable: false,
      }

    ],
    rowData: table
  }
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      editable: true,
      filter: true,
      enableCellChangeFlash: true,
      autoHeight: true
    };
  }, []);
  useEffect(() => {
    handleTableChange()
  }, [])

  
  return (
    <MyContext.Provider value={{ onDataChange: handleTableChange}}>
      {/* <CToaster push={toast} placement="top-end" /> */}
      <div
        className="ag-theme-quartz"
        style={{
          height: '800px',
          width: '100%'
        }}
      >
        <AgGridReact
          columnDefs={state.columnDefs}
          rowData={state.rowData}
          defaultColDef={defaultColDef}
          rowHeight={'50px'}
        />


      </div>
      <div className="d-flex justify-content-center mb-5"> 
      <Modal_Button  title={"Add new product"} content={"Add"} color={'success'}><AddForm /></Modal_Button>
      </div>


      <div className="d-flex"> 
      <StoneShapeGroup items={stone_shapes}/>
      </div>
      

      <CustomAgGrid />

      <div>
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
      </div>

    </MyContext.Provider>
  );

}
export default ProductTable;
