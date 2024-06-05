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
import { order_status_creator, quote_status_creator } from "../component_items/Ag-grid/status_badge";
import AssignForm from "./Modal_body/QuoteAssign";
import QuoteCancel from "./Modal_body/QuoteCancel";
import { get_account_list } from "../../api/accounts/Account_Api";
import OrderAssign from "./Modal_body/OrderAssign";
import OrderCancel from "./Modal_body/OrderCancel";





const state_creator = (table) => {
  const state = {
    columnDefs: [
      { headerName: "id", field: "id", flex: 0.4 },
      { headerName: "Product id", field: "product.id", flex: 0.6 },
      {
        headerName: "Image", flex: 0.6,
        cellRenderer: (params) => {
          return (
            <img className="rounded-3" width={'100%'} src={params.data.product.imageUrl} />)

        },
      },
      { headerName: "Customer", field: "account.fullname" },
      { headerName: "Materials Cost", field: "product_price", cellClass: 'd-flex align-items-center fw-bold text-primary'},
      { headerName: "Profit rate %", field: "profit_rate", cellClass: 'd-flex align-items-center fw-bold text-primary' },
      { headerName: "Production Cost", field: "production_price" , cellClass: 'd-flex align-items-center fw-bold text-primary'},
      { headerName: "Total Cost", field: "total_price", cellClass: 'd-flex align-items-center fw-bold text-danger' },
      { headerName: "Created", field: "created" },
      {
        headerName: "Status",
        valueGetter: 'data.order_status.id',
        cellClass: 'd-flex align-items-center py-1',
        cellRenderer: (params) => {
          const order_status = params.data.order_status;
          return order_status_creator(order_status);
        }
      },
      {
        headerName: "Option",
        cellClass: 'd-flex justify-content-center py-0',
        cellRenderer: (params) => {
          const assign_props = {
            assignForm: <OrderAssign order={params.data} />,
            title: 'Order Detail [ID: #' + params.data.id+']',
            button: <Eye size={30} color={params.data.order_status.id > 4 ? 'gray' : "purple"} weight="duotone" />,
            update_button_color: 'white',
            status: params.data.order_status.id,
          }
          const cancel_props = {
            assignForm: <OrderCancel order={params.data} />,
            title: 'Cancel Order [ID: #' + params.data.id+']',
            button: <CalendarX size={30} color='crimson' weight="duotone" />,
            update_button_color: 'white',
            status: params.data.order_status.id,
          }
          return (

            <CButtonGroup style={{ width: '100%', height: "100%" }} role="group" aria-label="Basic mixed styles example">
              <Modal_Button
                disabled={assign_props.status > 4}
                title={assign_props.title}
                content={assign_props.button}
                color={assign_props.color} >
                {assign_props.assignForm}
              </Modal_Button>
              <Modal_Button
                title={cancel_props.title}
                content={cancel_props.button}
                color={cancel_props.color} >
                {cancel_props.assignForm}
              </Modal_Button>
            </CButtonGroup>
          )

        },
        flex: 0.8,
      }

    ],
    rowData: table

  }
  return state
}

const data = {
  "customize_order_list": [
    {
      "id": 1,
      "product": {
        "id": 101,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "mounting_type_id": 1,
        "model_id": 501,
        "mounting_size": 312
      },
      "account": {
        "id": 201,
        "username": "john_doe",
        "password": "password123",
        "imageUrl": "http://localhost:8000/image/Account/1/main.jpg",
        "dob": "1990-05-15",
        "email": "john_doe@example.com",
        "fullname": "John Doe",
        "role": {
          "id": 1,
          "name": "Customer"
        },
        "phone": "123-456-7890",
        "address": "123 Main St, Cityville, CA 12345"
      },
      "order_status": {
        "id": 1,
        "name": "Pending deposit"
      },
      "order_type": {
        "id": 2,
        "name": "Customize"
      },
      "deposit_has_paid": true,
      "product_price": 5000.00,
      "profit_rate": 0.2,
      "production_price": 4000.00,
      "total_price": 6000.00,
      "note": "Please add extra engraving",
      "saleStaff_id": 301,
      "designStaff_id": 302,
      "productionStaff_id": 303,
      "created": "2024-05-28"
    },
    {
      "id": 2,
      "product": {
        "id": 102,
        "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
        "mounting_type_id": 2,
        "model_id": 502,
        "mounting_size": 24.12
      },
      "account": {
        "id": 202,
        "username": "jane_smith",
        "password": "password456",
        "imageUrl": "http://localhost:8000/image/Account/6/main.jpg",
        "dob": "1985-08-25",
        "email": "jane_smith@example.com",
        "fullname": "Jane Smith",
        "role": {
          "id": 1,
          "name": "Customer"
        },
        "phone": "987-654-3210",
        "address": "456 Elm St, Townsville, TX 67890"
      },
      "order_status": {
        "id": 2,
        "name": "Designing"
      },
      "order_type": {
        "id": 2,
        "name": "Customize"
      },
      "deposit_has_paid": false,
      "product_price": 7000.00,
      "profit_rate": 0.25,
      "production_price": 5000.00,
      "total_price": 7500.00,
      "note": "Rush order, please prioritize",
      "saleStaff_id": 304,
      "designStaff_id": 305,
      "productionStaff_id": 306,
      "created": "2024-05-27"
    }
  ],
  "template_order_list": [
    {
      "id": 3,
      "product": {
        "id": 103,
        "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
        "mounting_type_id": 3,
        "model_id": 503,
        "mounting_size": 321.1
      },
      "account": {
        "id": 203,
        "username": "alice_brown",
        "password": "password789",
        "imageUrl": "http://localhost:8000/image/Account/3/main.jpg",
        "dob": "1992-12-10",
        "email": "alice_brown@example.com",
        "fullname": "Alice Brown",
        "role": {
          "id": 1,
          "name": "Customer"
        },
        "phone": "555-555-5555",
        "address": "789 Maple St, Village, FL 54321"
      },
      "order_status": {
        "id": 3,
        "name": "Manufacturing"
      },
      "order_type": {
        "id": 1,
        "name": "Template"
      },
      "deposit_has_paid": 12312,
      "product_price": 3000.00,
      "profit_rate": 0.15,
      "production_price": 2500.00,
      "total_price": 3500.00,
      "note": "Please gift wrap",
      "saleStaff_id": 307,
      "designStaff_id": 308,
      "productionStaff_id": 309,
      "created": "2024-05-26"
    },
    {
      "id": 4,
      "product": {
        "id": 104,
        "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
        "mounting_type_id": 4,
        "model_id": 504,
        "mounting_size": 12.3
      },
      "account": {
        "id": 204,
        "username": "bob_jones",
        "password": "password000",
        "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
        "dob": "1978-07-22",
        "email": "bob_jones@example.com",
        "fullname": "Bob Jones",
        "role": {
          "id": 1,
          "name": "Customer"
        },
        "phone": "444-444-4444",
        "address": "1010 Birch St, Hamlet, NY 67890"
      },
      "order_status": {
        "id": 4,
        "name": "Payment"
      },
      "order_type": {
        "id": 1,
        "name": "Template"
      },
      "deposit_has_paid": 0,
      "product_price": 8000.00,
      "profit_rate": 0.3,
      "production_price": 6000.00,
      "total_price": 9000.00,
      "note": "Include warranty card",
      "saleStaff_id": 310,
      "designStaff_id": 311,
      "productionStaff_id": 312,
      "created": "2024-05-25"
    }
  ]
}


const Order_Page = () => {
  const [key, setKey] = useState('template');
  const [orderList, setOrderList] = useState(null);
  let [state, setState] = useState(null);

  const handleTableChange = async () => {
    await get_account_list();
    const orderList = data;
    setOrderList(orderList);

    setState({
      template: state_creator(orderList.template_order_list),
      customize: state_creator(orderList.customize_order_list)
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

            <Tab eventKey="template" title="By Template Orders">
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
            </Tab>


            <Tab eventKey="customize" title="Customize Orders">
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
export default Order_Page;
