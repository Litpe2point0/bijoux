import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";
import { AgGridReact } from 'ag-grid-react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
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
  CCol,
  CCardHeader,
  CSpinner,
} from '@coreui/react'
import AppBar from '@mui/material/AppBar';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import { get_product_list, update_product_list } from "../../api/ProductApi";
import Modal_Button from "../component_items/Modal/ModalButton"
import { UsersThree, Eye, UserCirclePlus, CalendarX } from "phosphor-react";
import onGridReady, { resetHeaderProperties } from "../component_items/Ag-grid/useStickyHeader";
import './style/style.css'
import { design_process_status_creator, order_status_creator, quote_status_creator } from "../component_items/Ag-grid/status_badge";
import { get_account_list } from "../../api/main/accounts/Account_api";
import { BsFillClipboardCheckFill } from "react-icons/bs";
import DesignDetail from "./Modal_body/DesignDetail";
import { get_design_process_list } from "../../api/main/orders/Order_api";


export const DesignPageContext = createContext();


const state_creator = (table) => {
  const state = {
    columnDefs: [
      { headerName: "ID", field: "id", flex: 0.5 },
      { headerName: "Order id", field: "order_id", flex: 0.6 },
      {
        headerName: "Image",
        cellRenderer: (params) => {
          return (
            <img className="rounded-3" width={'100%'} style={{ maxHeight: '100px' }} src={params.data.imageUrl} />)

        },
      },
      { headerName: "Created", field: "created" },
      {
        headerName: "Status",
        valueGetter: 'data.design_process_status.id',
        cellClass: 'd-flex align-items-center py-1',
        cellRenderer: (params) => {
          const design_process_status = params.data.design_process_status;
          return design_process_status_creator(design_process_status);
        }
      },
      {
        headerName: "Option",
        cellClass: 'd-flex justify-content-center py-0',
        cellRenderer: (params) => {
          const Modal_props = {
            assignForm: <DesignDetail designProcess={params.data} />,
            title: 'Approve Order\'s Price Report [ID: #' + params.data.id + ']',
            button: <Eye size={25} color={"purple"} weight="duotone" />,
            update_button_color: 'white'
          }
          return (

            <CButtonGroup style={{ width: '100%', height: "100%" }} role="group" aria-label="Basic mixed styles example">
              <Modal_Button
                disabled={false}
                title={Modal_props.title}
                content={Modal_props.button}
                color={Modal_props.color} >
                {Modal_props.assignForm}
              </Modal_Button>
            </CButtonGroup>
          )

        },

      }

    ],
    rowData: table

  }
  return state
}

const data = [
  {
    "id": 1,
    "order_id": 1001,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Special engraving",
    "mounting_type": {
      "id": 1,
      "name": "Prong"
    },
    "mounting_size": "6",
    "design_process_status": {
      "id": 1,
      "name": "Pending priced"
    },
    "production_price": 5000,
    "profit_rate": 0.15,
    "total_price": 5750,
    "product_price": 6500,
    "created": "2024-05-01"
  },
  {
    "id": 2,
    "order_id": 1002,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Custom size",
    "mounting_type": {
      "id": 2,
      "name": "Bezel"
    },
    "mounting_size": "7",
    "design_process_status": {
      "id": 2,
      "name": "Priced"
    },
    "production_price": 4500,
    "profit_rate": 0.2,
    "total_price": 5400,
    "product_price": 6000,
    "created": "2024-05-02"
  },
  {
    "id": 3,
    "order_id": 1003,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Include additional diamonds",
    "mounting_type": {
      "id": 3,
      "name": "Channel"
    },
    "mounting_size": "5",
    "design_process_status": {
      "id": 3,
      "name": "Approved"
    },
    "production_price": 6000,
    "profit_rate": 0.18,
    "total_price": 7080,
    "product_price": 8000,
    "created": "2024-05-03"
  },
  {
    "id": 4,
    "order_id": 1004,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Inlay gemstones",
    "mounting_type": {
      "id": 1,
      "name": "Prong"
    },
    "mounting_size": "6",
    "design_process_status": {
      "id": 4,
      "name": "Cancel"
    },
    "production_price": 5200,
    "profit_rate": 0.17,
    "total_price": 6084,
    "product_price": 6800,
    "created": "2024-05-04"
  },
  {
    "id": 5,
    "order_id": 1005,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Special engraving",
    "mounting_type": {
      "id": 2,
      "name": "Bezel"
    },
    "mounting_size": "8",
    "design_process_status": {
      "id": 3,
      "name": "Approved"
    },
    "production_price": 4900,
    "profit_rate": 0.19,
    "total_price": 5831,
    "product_price": 6800,
    "created": "2024-05-05"
  }
]




const Design_Page = () => {
  const [key, setKey] = useState('customize');
  const [designList, setDesignList] = useState(null);
  let [state, setState] = useState(null);

  const handleDataChange = async () => {
    const orderList = await get_design_process_list();
    setDesignList(orderList.data); 

    setState({
      customize: state_creator(orderList.data)
    })
    //alert("ON DATA CHANGE NÈ")
  }

  useEffect(() => {

    handleDataChange()
  }, [])




  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      autoHeight: true,
      wrapText: true,
      cellClass: 'd-flex align-items-center',
    };
  }, [])
  return (
    <DesignPageContext.Provider value={{ handleDataChange:  handleDataChange}}>
      <CRow>
        <CCol xs={12}>
          {state === null ? <CButton className="w-100" color="secondary" disabled>
            <CSpinner as="span" size="sm" aria-hidden="true" />
            Loading...
          </CButton> :

            <Tabs
              defaultActiveKey="template"
              id="fill-tab-example"
              className="mb-3"
              activeKey={key}
              fill
              onSelect={(key) => {
                setKey(key)
                resetHeaderProperties();
              }}

            >
              <Tab eventKey="customize" title="Customize Orders Price Report Approvement">
                {
                  key === 'customize' &&
                  <div
                    id="customize"
                    style={{
                      boxSizing: "border-box",
                      height: "100%",
                      width: "100%"
                    }}
                    className="ag-theme-quartz"
                  >
                    <AgGridReact
                      enableColResize={true}
                      columnDefs={state.customize.columnDefs}
                      rowData={state.customize.rowData}
                      defaultColDef={defaultColDef}
                      rowHeight={35}
                      headerHeight={30}
                      pagination={true}
                      paginationPageSize={10}
                      domLayout='autoHeight'
                      onGridReady={onGridReady('customize')}
                    />
                  </div>
                }
              </Tab>



            </Tabs>
          }

        </CCol>
      </CRow>
    </DesignPageContext.Provider>

  );

}
export default Design_Page;
