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
import onGridReady, { resetHeaderProperties } from "../component_items/Ag-grid/useStickyHeader";
import './style/style.css'
import { design_process_status_creator, order_status_creator, quote_status_creator } from "../component_items/Ag-grid/status_badge";
import { BsFillClipboardCheckFill } from "react-icons/bs";
import DesignPricing from "./Modal_body/DesignPricing";
import { get_design_process_list } from "../../api/main/orders/Order_api";


export const SaleOrderPriceContext = createContext();


const state_creator = (table) => {
  const state = {
    columnDefs: [
      { headerName: "ID", field: "id", flex: 0.5 },
      { headerName: "Order ID", field: "order_id", flex: 0.6 },
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
            assignForm: <DesignPricing designProcess={params.data} />,
            title: 'Approve Order\'s Price Report [ID: #' + params.data.id + ']',
            button: <BsFillClipboardCheckFill size={25} color={params.data.design_process_status.id != 1 ? "gray" : "green"} weight="duotone" />,
            update_button_color: 'white'
          }
          return (

            <CButtonGroup style={{ width: '100%', height: "100%" }} role="group" aria-label="Basic mixed styles example">
              <Modal_Button
                disabled={params.data.design_process_status.id != 1}
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





const Order_Price = () => {
  const [key, setKey] = useState('customize');
  const [designList, setDesignList] = useState(null);
  let [state, setState] = useState(null);

  const handleDataChange = async () => {
    // await get_account_list();
    // setDesignList(data);
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
    <SaleOrderPriceContext.Provider value={{ handleDataChange:  handleDataChange}}>
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
    </SaleOrderPriceContext.Provider>

  );

}
export default Order_Price;
