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
import Modal_Button from "../component_items/Modal/ModalButton"
import { ArrowCircleUp, Eye } from "phosphor-react";
import { image_url } from "../../api/Back_End_Url";
import AvatarInput from "../component_items/Avatar/Avatar";
import onGridReady from "../component_items/Ag-grid/useStickyHeader";
import CustomerUpdate from "./Modal_body/CustomerUpdate";
import { get_account_list, get_payment_history } from "../../api/main/accounts/Account_api";
import { payment_status_creator } from "../component_items/Ag-grid/status_badge";




export const CustomerPageContext = createContext();

const state_creator = (table) => {
    const state = {
        columnDefs: [
            { headerName: "Transaction ID", field: "id", },
            { headerName: "Order ID", field: "order_id", },
            { headerName: "Customer ID", field: "account.id", },
            { headerName: "Name", field: "account.fullname" },
            { headerName: "Contact Number", field: "account.phone" },
            { headerName: "Type", field: "payment_type.name" },
            { headerName: "Amount", field: "money" },
            {
                headerName: "Status",
                valueGetter: 'data.isSuccess',
                cellClass: 'd-flex align-items-center py-1',
                cellRenderer: (params) => {
                  return payment_status_creator(params.data.isSuccess);
                }
              },
            { headerName: "Date", field: "created" },

        ],
        rowData: table

    }
    return state
}


const Transaction_Page = () => {
    let [state, setState] = useState(null);


    
    const handleDataChange = async () => {
        const transactions_list = await get_payment_history();
       
        setState(state_creator(transactions_list.data))
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
            editable: false
        };
    }, [])
    return (
        <CustomerPageContext.Provider value={{ handleDataChange: handleDataChange }}>
            <CRow>
                <CCol xs={12}>
                   {state === null ? <CButton className="w-100" color="secondary" disabled>
                <CSpinner as="span" size="sm" aria-hidden="true" />
                Loading...
              </CButton> :
                    <div
                        id="customer-table"
                        className="ag-theme-quartz"
                        
                    >
                        <AgGridReact
                            enableColResize={true}
                            columnDefs={state.columnDefs}
                            rowData={state.rowData}
                            defaultColDef={defaultColDef}
                            rowHeight={'70px'}
                            headerHeight={40}
                            pagination={true}
                            paginationPageSize={10}
                            domLayout='autoHeight'
                            onGridReady={onGridReady('customer-table')}
                        />
                    </div>} 
                </CCol>



            </CRow>

        </CustomerPageContext.Provider>
    );

}
export default Transaction_Page;
