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
import { get_account_list } from "../../api/main/accounts/Account_api";
import OrderDetail from "./Quote widget/OrderDetail";
import { get_assigned_complete_orders_production } from "../../api/main/orders/Order_api";



export const ProductionOrderCompletePageContext = createContext();

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
          return production_process_status_creator(production_status, params.data.order_status.id);
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
                context={ProductionOrderCompletePageContext}
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



const Order_Production_Complete_Page = () => {
  const [key, setKey] = useState('template');
  const [orderList, setOrderList] = useState(null);
  let [state, setState] = useState(null);

  const handleDataChange = async () => {
    
    const orderList = await get_assigned_complete_orders_production();
    setOrderList(orderList.data);

    setState({
      template: state_creator(orderList.data.template_order_list),
      customize: state_creator(orderList.data.customize_order_list)
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
    <ProductionOrderCompletePageContext.Provider value={{ handleDataChange: handleDataChange }}>
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
    </ProductionOrderCompletePageContext.Provider>

  );

}
export default Order_Production_Complete_Page;
