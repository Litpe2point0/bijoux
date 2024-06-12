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
import { get_product_list, update_product_list } from "../../api/ProductApi";
import Modal_Button from "../component_items/Modal/ModalButton"
import { UsersThree, Eye, UserCirclePlus, CalendarX } from "phosphor-react";
import onGridReady, { resetHeaderProperties } from "../component_items/Ag-grid/useStickyHeader";
import './style/style.css'
import { order_status_creator, production_process_status_creator, quote_status_creator } from "../component_items/Ag-grid/status_badge";
import { get_account_list } from "../../api/accounts/Account_Api";
import OrderDetail from "./Quote widget/OrderDetail";



export const ProductionOrderPageContext = createContext();

const state_creator = (table) => {
  const state = {
    columnDefs: [
      { headerName: "ID", field: "id", flex: 0.4 },
      { headerName: "Product ID", field: "product.id", flex: 0.6 },
      {
        headerName: "Image", flex: 0.6,
        cellRenderer: (params) => {
          return (
            <img className="rounded-3" width={'100%'} src={params.data.product.imageUrl} />)

        },
      },
      { headerName: "Updated Date", field: "created" },
      {
        headerName: "Production Status",
        valueGetter: 'data.production_process.production_status.id',
        cellClass: 'd-flex align-items-center py-1',
        cellRenderer: (params) => {
          const production_status = params.data.production_process.production_status;
          return production_process_status_creator(production_status);
        }
      },
      {
        headerName: "Option",
        cellClass: 'd-flex justify-content-center py-0',
        cellRenderer: (params) => {
          const assign_props = {
            assignForm: <OrderDetail order={params.data} />,
            title: 'Order Detail [ID: #' + params.data.id + ']',
            button: <Eye size={30} color={params.data.order_status.id > 4 ? 'gray' : "purple"} weight="duotone" />,
            update_button_color: 'white',
            status: params.data.order_status.id,
          }
          return (

            <CButtonGroup style={{ width: '100%', height: "100%" }} role="group" aria-label="Basic mixed styles example">
              <Modal_Button
                //disabled={assign_props.status > 4}
                title={assign_props.title}
                content={assign_props.button}
                color={assign_props.color} >
                {assign_props.assignForm}
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
  "template_order_list": [
    {
      "id": 1,
      "product": {
        "id": 101,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "mounting_type_id": 1,
        "model_id": 201,
        "mounting_size": "6"
      },
      "account": {
        "id": 301,
        "username": "user1",
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "dob": "1990-01-01",
        "email": "user1@example.com",
        "fullname": "User One",
        "role": {
          "id": 1,
          "name": "Customer"
        },
        "phone": "1234567890",
        "address": "123 Main St",
        "deactivated": false,
        "deactivated_date": null
      },
      "order_status": {
        "id": 1,
        "name": "Pending"
      },
      "order_type": {
        "id": 1,
        "name": "Template"
      },
      "deposit_has_paid": 500,
      "profit_rate": 0.15,
      "product_price": 1000,
      "production_price": 800,
      "total_price": 1150,
      "note": "Urgent delivery",
      "saleStaff_id": 401,
      "designStaff_id": 501,
      "productionStaff_id": 601,
      "created": "2024-05-01",
      "production_process": {
        "id": 1,
        "order_id": 1,
        "production_status": {
          "id": 1,
          "name": "Unrealized"
        },
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "created": "2024-05-02"
      }
    },
    {
      "id": 2,
      "product": {
        "id": 102,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "mounting_type_id": 2,
        "model_id": 202,
        "mounting_size": "7"
      },
      "account": {
        "id": 302,
        "username": "user2",
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "dob": "1992-02-02",
        "email": "user2@example.com",
        "fullname": "User Two",
        "role": {
          "id": 1,
          "name": "Customer"
        },
        "phone": "2345678901",
        "address": "456 Main St",
        "deactivated": false,
        "deactivated_date": null
      },
      "order_status": {
        "id": 2,
        "name": "Shipped"
      },
      "order_type": {
        "id": 1,
        "name": "Template"
      },
      "deposit_has_paid": 600,
      "profit_rate": 0.16,
      "product_price": 1200,
      "production_price": 900,
      "total_price": 1380,
      "note": "Gift wrap",
      "saleStaff_id": 402,
      "designStaff_id": 502,
      "productionStaff_id": 602,
      "created": "2024-05-03",
      "production_process": {
        "id": 2,
        "order_id": 2,
        "production_status": {
          "id": 2,
          "name": "Casting"
        },
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "created": "2024-05-04"
      }
    },
    {
      "id": 3,
      "product": {
        "id": 103,
        "imageUrl":"http://localhost:8000/image/Diamond/D_IF.jpg",
        "mounting_type_id": 3,
        "model_id": 203,
        "mounting_size": "8"
      },
      "account": {
        "id": 303,
        "username": "user3",
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "dob": "1993-03-03",
        "email": "user3@example.com",
        "fullname": "User Three",
        "role": {
          "id": 1,
          "name": "Customer"
        },
        "phone": "3456789012",
        "address": "789 Main St",
        "deactivated": false,
        "deactivated_date": null
      },
      "order_status": {
        "id": 3,
        "name": "Delivered"
      },
      "order_type": {
        "id": 1,
        "name": "Template"
      },
      "deposit_has_paid": 700,
      "profit_rate": 0.17,
      "product_price": 1400,
      "production_price": 1000,
      "total_price": 1610,
      "note": "Include message card",
      "saleStaff_id": 403,
      "designStaff_id": 503,
      "productionStaff_id": 603,
      "created": "2024-05-05",
      "production_process": {
        "id": 3,
        "order_id": 3,
        "production_status": {
          "id": 3,
          "name": "Assembly"
        },
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "created": "2024-05-06"
      }
    }
  ],
  "customize_order_list": [
    {
      "id": 4,
      "product": {
        "id": 104,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "mounting_type_id": 1,
        "model_id": 204,
        "mounting_size": "6"
      },
      "account": {
        "id": 304,
        "username": "user4",
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "dob": "1994-04-04",
        "email": "user4@example.com",
        "fullname": "User Four",
        "role": {
          "id": 2,
          "name": "VIP Customer"
        },
        "phone": "4567890123",
        "address": "123 Broad St",
        "deactivated": false,
        "deactivated_date": null
      },
      "order_status": {
        "id": 1,
        "name": "Pending"
      },
      "order_type": {
        "id": 2,
        "name": "Customize"
      },
      "deposit_has_paid": 800,
      "profit_rate": 0.18,
      "product_price": 1600,
      "production_price": 1200,
      "total_price": 1880,
      "note": "Engrave initials",
      "saleStaff_id": 404,
      "designStaff_id": 504,
      "productionStaff_id": 604,
      "created": "2024-05-07",
      "production_process": {
        "id": 4,
        "order_id": 4,
        "production_status": {
          "id": 4,
          "name": "Stone Setting"
        },
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "created": "2024-05-08"
      }
    },
    {
      "id": 5,
      "product": {
        "id": 105,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "mounting_type_id": 2,
        "model_id": 205,
        "mounting_size": "7"
      },
      "account": {
        "id": 305,
        "username": "user5",
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "dob": "1995-05-05",
        "email": "user5@example.com",
        "fullname": "User Five",
        "role": {
          "id": 2,
          "name": "VIP Customer"
        },
        "phone": "5678901234",
        "address": "456 Broad St",
        "deactivated": false,
        "deactivated_date": null
      },
      "order_status": {
        "id": 2,
        "name": "Shipped"
      },
      "order_type": {
        "id": 2,
        "name": "Customize"
      },
      "deposit_has_paid": 900,
      "profit_rate": 0.19,
      "product_price": 1800,
      "production_price": 1350,
      "total_price": 2145,
      "note": "Gift packaging",
      "saleStaff_id": 405,
      "designStaff_id": 505,
      "productionStaff_id": 605,
      "created": "2024-05-09",
      "production_process": {
        "id": 5,
        "order_id": 5,
        "production_status": {
          "id": 5,
          "name": "Polishing"
        },
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "created": "2024-05-10"
      }
    },
    {
      "id": 6,
      "product": {
        "id": 106,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "mounting_type_id": 3,
        "model_id": 206,
        "mounting_size": "8"
      },
      "account": {
        "id": 306,
        "username": "user6",
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "dob": "1996-06-06",
        "email": "user6@example.com",
        "fullname": "User Six",
        "role": {
          "id": 2,
          "name": "VIP Customer"
        },
        "phone": "6789012345",
        "address": "789 Broad St",
        "deactivated": false,
        "deactivated_date": null
      },
      "order_status": {
        "id": 3,
        "name": "Delivered"
      },
      "order_type": {
        "id": 2,
        "name": "Customize"
      },
      "deposit_has_paid": 1000,
      "profit_rate": 0.2,
      "product_price": 2000,
      "production_price": 1500,
      "total_price": 2400,
      "note": "Special instructions included",
      "saleStaff_id": 406,
      "designStaff_id": 506,
      "productionStaff_id": 606,
      "created": "2024-05-11",
      "production_process": {
        "id": 6,
        "order_id": 6,
        "production_status": {
          "id": 6,
          "name": "Finished"
        },
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "created": "2024-05-12"
      }
    }
  ]
}


const Order_Page = () => {
  const [key, setKey] = useState('template');
  const [orderList, setOrderList] = useState(null);
  let [state, setState] = useState(null);

  const handleDataChange = async () => {
    await get_account_list();
    const orderList = data;
    setOrderList(orderList);

    setState({
      template: state_creator(orderList.template_order_list),
      customize: state_creator(orderList.customize_order_list)
    })
    alert("ON DATA CHANGE NÈ")
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
    <ProductionOrderPageContext.Provider value={{ handleDataChange: handleDataChange }}>
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
                      onGridReady={onGridReady('template')}
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
    </ProductionOrderPageContext.Provider>

  );

}
export default Order_Page;
