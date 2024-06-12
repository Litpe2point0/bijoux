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
import { UsersThree, Eye, UserCirclePlus, CalendarX, Gear } from "phosphor-react";
import onGridReady, { resetHeaderProperties } from "../component_items/Ag-grid/useStickyHeader";
import './style/style.css'
import StaffUpdate from "./Modal_body/StaffUpdate";
import { quote_status_creator } from "../component_items/Ag-grid/status_badge";
import AssignForm from "./Modal_body/QuoteAssign";
import QuoteCancel from "./Modal_body/QuoteCancel";
import { get_account_list } from "../../api/accounts/Account_Api";
import { IconButton } from "@mui/material";
import MetalUpdate from "./Modal_body/material/MetalUpdate";


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
            { headerName: "Buy Price/g", field: "buy_price_per_gram" },
            { headerName: "Sale Price/g", field: "buy_price_per_gram" },
            { headerName: "S_Weight", field: "specific_weight" },
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
                        updateForm: <MetalUpdate metal={params.data}  />,
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

const data = [
    {
        "id": 1,
        "name": "10K Gold",
        "imageUrl": "http://localhost:8000/image/Metal/1/main.jpg",
        "buy_price_per_gram": 10000,
        "sale_price_per_gram": 111111,
        "specific_weight": 0.1,
        "deactivated": 0,
        "created": "2024-05-22"
    },
    {
        "id": 2,
        "name": "14K Gold",
        "imageUrl": "http://localhost:8000/image/Metal/2/main.jpg",
        "buy_price_per_gram": 11000,
        "sale_price_per_gram": 122222,
        "specific_weight": 0.2,
        "deactivated": 0,
        "created": "2024-05-23"
    },
    {
        "id": 3,
        "name": "18K Gold",
        "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
        "buy_price_per_gram": 12000,
        "sale_price_per_gram": 133333,
        "specific_weight": 0.3,
        "deactivated": 1,
        "created": "2024-05-24"
    },
    {
        "id": 4,
        "name": "10K Rose Gold",
        "imageUrl": "http://localhost:8000/image/Metal/4/main.jpg",
        "buy_price_per_gram": 13000,
        "sale_price_per_gram": 144444,
        "specific_weight": 0.4,
        "deactivated": 0,
        "created": "2024-03-25"
    },
    {
        "id": 5,
        "name": "14K Rose Gold",
        "imageUrl": "http://localhost:8000/image/Metal/5/main.jpg",
        "buy_price_per_gram": 14000,
        "sale_price_per_gram": 155555,
        "specific_weight": 0.5,
        "deactivated": 1,
        "created": "2024-03-26"
    },
    {
        "id": 6,
        "name": "18K Rose Gold",
        "imageUrl": "http://localhost:8000/image/Metal/6/main.jpg",
        "buy_price_per_gram": 15000,
        "sale_price_per_gram": 166666,
        "specific_weight": 0.6,
        "deactivated": 0,
        "created": "2024-03-27"
    },
    {
        "id": 7,
        "name": "Silver",
        "imageUrl": "http://localhost:8000/image/Metal/7/main.jpg",
        "buy_price_per_gram": 16000,
        "sale_price_per_gram": 177777,
        "specific_weight": 0.01049,
        "deactivated": 1,
        "created": "2024-04-18"
    },
    {
        "id": 8,
        "name": "Platinum",
        "imageUrl": "http://localhost:8000/image/Metal/8/main.jpg",
        "buy_price_per_gram": 17000,
        "sale_price_per_gram": 188888,
        "specific_weight": 0.02145,
        "deactivated": 0,
        "created": "2024-05-12"
    }
]


const Metal_Page = () => {
    const [key, setKey] = useState('metal');
    let [state, setState] = useState(null);

    const [metalList, setMetalList] = useState([]);

    const handleDataChange = async () => {
        await get_account_list();
        const metalList = data;
        setMetalList(metalList);


        setState({
            metal: state_creator(metalList)
        })
        alert('ON DATA CHANGE NÈ')
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
        <MetalPageContext.Provider   value={{ handleDataChange: handleDataChange}}>
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
