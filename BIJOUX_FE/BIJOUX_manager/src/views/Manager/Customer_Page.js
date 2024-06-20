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
import { get_account_list } from "../../api/main/accounts/Account_api";




export const CustomerPageContext = createContext();

const state_creator = (table) => {
    const state = {
        columnDefs: [
            { headerName: "id", field: "id", flex: 0.4 },
            {
                headerName: "Avatar", flex: 0.5,
                cellRenderer: (params) => {
                    return (
                        <AvatarInput size={50} src={params.data.imageUrl} />)

                },
                editable: false,
            },
            { headerName: "Name", field: "fullname" },
            { headerName: "Contact Number", field: "phone" },
            { headerName: "Address", field: "address" },
            {
                headerName: "Status",
                editable: false,
                cellClass: 'd-flex align-items-center ',
                valueGetter: 'data.deactivated',
                cellRenderer: (params) => {
                    const status = {
                        title: ((params.data.deactivated == 0) ? 'Activated' : 'Deactivated'),
                        color: ((params.data.deactivated == 0) ? 'success' : 'danger'),
                        bg: 'light'
                    }
                    return (
                        <CCard
                            textColor={`${status.color}`}
                            style={{ width: '100px' }}
                            className={` text-center fw-bold rounded-pill px-1 border-2 border-${status.color} bg-${status.bg}`}>
                            {status.title}
                        </CCard>
                    )


                },
            },
            {
                headerName: "Option",
                cellClass: 'd-flex justify-content-center py-0',
                cellRenderer: (params) => {
                    const Modal_props = {
                        updateForm: <CustomerUpdate account={params.data} />,
                        title: 'Update Customer [ID: #' + params.data.id+']',
                        button: <Eye size={30} color="purple" weight="duotone" />,
                        update_button_color: 'white'
                    }
                    return (

                        <CButtonGroup style={{ width: '100%', height: "100%" }} role="group" aria-label="Basic mixed styles example">
                            <Modal_Button
                                disabled={false}
                                title={Modal_props.title}
                                content={Modal_props.button}
                                color={Modal_props.color} >
                                {Modal_props.updateForm}
                            </Modal_Button>
                        </CButtonGroup>
                    )

                },
                flex: 0.5,
            }

        ],
        rowData: table

    }
    return state
}


const Customer_Page = () => {
    let [state, setState] = useState(null);


    
    const handleDataChange = async () => {
        const accountList = await get_account_list();
       
        setState(state_creator(accountList.data.customer_list))
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
export default Customer_Page;
