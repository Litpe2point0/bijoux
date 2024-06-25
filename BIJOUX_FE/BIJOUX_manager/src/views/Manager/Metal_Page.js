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
import { UsersThree, Eye, UserCirclePlus, CalendarX, Gear } from "phosphor-react";
import onGridReady, { resetHeaderProperties } from "../component_items/Ag-grid/useStickyHeader";
import './style/style.css'
import StaffUpdate from "./Modal_body/StaffUpdate";
import { quote_status_creator } from "../component_items/Ag-grid/status_badge";
import AssignForm from "./Modal_body/QuoteAssign";
import QuoteCancel from "./Modal_body/QuoteCancel";
import { get_account_list } from "../../api/main/accounts/Account_api";
import { IconButton } from "@mui/material";
import MetalUpdate from "./Modal_body/material/MetalUpdate";
import { get_metal_list } from "../../api/main/items/Metal_api";


export const MetalPageContext = createContext();



const state_creator = (table) => {
    const state = {
        columnDefs: [
            {
                headerName: "Image", field: "name",
                cellRenderer: (params) => {
                    return (
                        <img className="rounded-3" width={'50%'} src={params.data.imageUrl} />)
                },
            },
            { headerName: "ID", field: "id" },
            { headerName: "Name", field: "name" },
            { headerName: "Buy Price/g", field: "buy_price_per_gram",cellClass: 'd-flex align-items-center fw-bold  text-success' },
            { headerName: "Sale Price/g", field: "sale_price_per_gram", cellClass: 'd-flex align-items-center fw-bold  text-success' },
            { headerName: "S_Weight", field: "specific_weight", cellClass: 'd-flex align-items-center fw-bold  text-primary' },
            { headerName: "Updated Date", field: "created" },
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
                            style={{ width: '100%' }}
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
                    const update_props = {
                        updateForm: <MetalUpdate metal={params.data} />,
                        title: 'Update Metal [ID: #' + params.data.id + ']',
                        button: <IconButton color="light" aria-label="add an alarm">
                            <Gear size={20} color={'purple'} weight="duotone" />
                        </IconButton>,
                        //color: 'light',
                    }
                    return (

                        <CButtonGroup style={{ width: '100%', height: "100%" }} role="group" aria-label="Basic mixed styles example">
                            <Modal_Button
                                title={update_props.title}
                                content={update_props.button}
                                color={update_props.color} >
                                {update_props.updateForm}
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



const Metal_Page = () => {
    const [key, setKey] = useState('metal');
    let [state, setState] = useState(null);

    const [metalList, setMetalList] = useState([]);

    const handleDataChange = async () => {
        const metalList = await get_metal_list();
        setMetalList(metalList.data);

        setState({
            metal: state_creator(metalList.data)
        })
        //alert('ON DATA CHANGE NÈ')
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
        <MetalPageContext.Provider value={{ handleDataChange: handleDataChange }}>
            <CRow>
                <CCol xs={12}>
                    {state === null ? <CButton className="w-100" color="secondary" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton> :

                        <Tabs
                            defaultActiveKey="metal"
                            id="fill-tab-example"
                            className="mb-3"
                            activeKey={key}
                            fill
                            onSelect={(key) => {
                                setKey(key)
                                resetHeaderProperties();
                            }}

                        >
                            {key === 'metal' &&
                                <Tab eventKey="metal" title="Metal Price Table">
                                    <div
                                        id="metal"
                                        style={{
                                            boxSizing: "border-box",
                                            height: "100%",
                                            width: "100%"
                                        }}
                                        className="ag-theme-quartz"
                                    >
                                        <AgGridReact
                                            enableColResize={true}
                                            columnDefs={state.metal.columnDefs}
                                            rowData={state.metal.rowData}
                                            defaultColDef={defaultColDef}
                                            rowHeight={35}
                                            headerHeight={30}
                                            pagination={true}
                                            paginationPageSize={10}
                                            domLayout='autoHeight'
                                            onGridReady={onGridReady('metal')}
                                        />
                                    </div>

                                </Tab>}


                        </Tabs>
                    }

                </CCol>
            </CRow>
        </MetalPageContext.Provider>

    );

}
export default Metal_Page;
