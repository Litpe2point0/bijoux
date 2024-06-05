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
import StaffUpdate from "./Modal_body/StaffUpdate";
import { design_process_status_creator, order_status_creator, quote_status_creator } from "../component_items/Ag-grid/status_badge";
import AssignForm from "./Modal_body/QuoteAssign";
import QuoteCancel from "./Modal_body/QuoteCancel";
import { get_account_list } from "../../api/accounts/Account_Api";
import OrderAssign from "./Modal_body/OrderAssign";
import OrderCancel from "./Modal_body/OrderCancel";
import QuoteApprove from "./Modal_body/QuoteApprove";
import { BsFillClipboardCheckFill } from "react-icons/bs";
import DesignApprove from "./Modal_body/DesignApprove";





const state_creator = (table) => {
  const state = {
    columnDefs: [
      { headerName: "id", field: "id",flex: 0.5},
      { headerName: "Order id", field: "order_id",flex: 0.6 },
      {
        headerName: "Image",
        cellRenderer: (params) => {
          return (
            <img className="rounded-3" width={'100%'} style={{maxHeight: '100px'}} src={params.data.imageUrl} />)

        },
      },
      { headerName: "Created", field: "created"},
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
            assignForm: <DesignApprove designProcess={params.data} />,
            title: 'Approve Order\'s Price Report [ID: #' + params.data.id + ']',
            button: <BsFillClipboardCheckFill size={25} color={params.data.design_process_status.id != 2 ? "gray" : "green"} weight="duotone" />,
            update_button_color: 'white'
          }
          return (

            <CButtonGroup style={{ width: '100%', height: "100%" }} role="group" aria-label="Basic mixed styles example">
              <Modal_Button
                disabled={params.data.design_process_status.id != 2}
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
    "order_id": 1,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Initial design phase",
    "mounting_type": {
      "id": 1,
      "name": "Ring"
    },
    "mounting_size": 6,
    "design_process_status": {
      "id": 1,
      "name": "Pending Review"
    },
    "production_price": 15000.00,
    "profit_rate": 0.25,
    "created": "2024-01-01"
  },
  {
    "id": 2,
    "order_id": 2,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Design review stage",
    "mounting_type": {
      "id": 2,
      "name": "Bezel"
    },
    "mounting_size": 7,
    "design_process_status": {
      "id": 2,
      "name": "priced"
    },
    "production_price": 16000.00,
    "profit_rate": 0.30,
    "created": "2024-01-05"
  },
  {
    "id": 3,
    "order_id": 3,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Final design",
    "mounting_type": {
      "id": 3,
      "name": "Channel"
    },
    "mounting_size": 8,
    "design_process_status": {
      "id": 3,
      "name": "Approved"
    },
    "production_price": 17000.00,
    "profit_rate": 0.20,
    "created": "2024-01-10"
  },
  {
    "id": 4,
    "order_id": 4,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Awaiting customer approval",
    "mounting_type": {
      "id": 4,
      "name": "Tension"
    },
    "mounting_size": 9,
    "design_process_status": {
      "id": 4,
      "name": "Cancel"
    },
    "production_price": 18000.00,
    "profit_rate": 0.35,
    "created": "2024-01-15"
  },
  {
    "id": 5,
    "order_id": 5,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Design modifications requested",
    "mounting_type": {
      "id": 5,
      "name": "Pave"
    },
    "mounting_size": 6.5,
    "design_process_status": {
      "id": 2,
      "name": "Priced"
    },
    "production_price": 14000.00,
    "profit_rate": 0.22,
    "created": "2024-01-20"
  },
  {
    "id": 6,
    "order_id": 6,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Design approved, ready for production",
    "mounting_type": {
      "id": 6,
      "name": "Cluster"
    },
    "mounting_size": 7.5,
    "design_process_status": {
      "id": 4,
      "name": "Cancelled"
    },
    "production_price": 15500.00,
    "profit_rate": 0.28,
    "created": "2024-01-25"
  },
  {
    "id": 7,
    "order_id": 7,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Design in progress",
    "mounting_type": {
      "id": 7,
      "name": "Halo"
    },
    "mounting_size": 6.75,
    "design_process_status": {
      "id": 1,
      "name": "Pending"
    },
    "production_price": 16500.00,
    "profit_rate": 0.33,
    "created": "2024-01-30"
  },
  {
    "id": 8,
    "order_id": 8,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Awaiting customer feedback",
    "mounting_type": {
      "id": 8,
      "name": "Bar"
    },
    "mounting_size": 8.5,
    "design_process_status": {
      "id": 3,
      "name": "Approved"
    },
    "production_price": 17500.00,
    "profit_rate": 0.27,
    "created": "2024-02-01"
  },
  {
    "id": 9,
    "order_id": 9,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Design ready for final approval",
    "mounting_type": {
      "id": 9,
      "name": "Flush"
    },
    "mounting_size": 7.25,
    "design_process_status": {
      "id": 2,
      "name": "Priced"
    },
    "production_price": 18500.00,
    "profit_rate": 0.32,
    "created": "2024-02-04"
  },
  {
    "id": 10,
    "order_id": 10,
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "note": "Final review stage",
    "mounting_type": {
      "id": 10,
      "name": "Cathedral"
    },
    "mounting_size": 6.25,
    "design_process_status": {
      "id": 1,
      "name": "Pending"
    },
    "production_price": 19000.00,
    "profit_rate": 0.30,
    "created": "2024-02-10"
  }
]



const Order_Price = () => {
  const [key, setKey] = useState('customize');
  const [designList, setDesignList] = useState(null);
  let [state, setState] = useState(null);

  const handleTableChange = async () => {
    await get_account_list();
    setDesignList(data);

    setState({
      customize: state_creator(data)
    })
  }

  useEffect(() => {

    handleTableChange()
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

            {/* <Tab eventKey="template" title="By Template Orders">
              {
                key === 'template' && <div
                  id="template"
                  style={{
                    boxSizing: "border-box",
                    height: "100%",
                    width: "100%"
                  }}
                  className="ag-theme-quartz"
                >
                  <AgGridReact
                    enableColResize={true}
                    columnDefs={state.template.columnDefs}
                    rowData={state.template.rowData}
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
            </Tab> */}


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
  );

}
export default Order_Price;
