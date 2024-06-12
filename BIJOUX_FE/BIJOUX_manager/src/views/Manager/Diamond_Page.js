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
import DiamondUpdate from "./Modal_body/material/DiamondUpdate";


export const DiamondPageContext = createContext();



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
            { headerName: "Color", field: "diamond_color.name" },
            { headerName: "Clarity", field: "diamond_clarity.name" },
            { headerName: "Cut", field: "diamond_cut.name" },
            { headerName: "Size", field: "size" },
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
                        updateForm: <DiamondUpdate diamond={params.data} />,
                        title: 'Update Metal [ID: #' + params.data.id + ']',
                        button: <IconButton color="light" aria-label="add an alarm">
                            <Gear size={20} color={'purple'} weight="duotone" />
                        </IconButton>,
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
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "size": 5.2,
        "diamond_color": {
            "id": 1,
            "name": "D"
        },
        "diamond_origin": {
            "id": 1,
            "name": "Natural"
        },
        "diamond_clarity": {
            "id": 1,
            "name": "IF"
        },
        "diamond_cut": {
            "id": 1,
            "name": "Cut 1"
        },
        "price": 54500000,
        "deactivated": 0,
        "created": "2024-08-06"
    },
    {
        "id": 2,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "size": 5.2,
        "diamond_color": {
            "id": 1,
            "name": "D"
        },
        "diamond_origin": {
            "id": 1,
            "name": "Natural"
        },
        "diamond_clarity": {
            "id": 1,
            "name": "IF"
        },
        "diamond_cut": {
            "id": 2,
            "name": "Cut 2"
        },
        "price": 52800000,
        "deactivated": 0,
        "created": "2024-08-06"
    },
    {
        "id": 3,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "size": 5.2,
        "diamond_color": {
            "id": 1,
            "name": "D"
        },
        "diamond_origin": {
            "id": 1,
            "name": "Natural"
        },
        "diamond_clarity": {
            "id": 1,
            "name": "IF"
        },
        "diamond_cut": {
            "id": 3,
            "name": "Cut 3"
        },
        "price": 49800000,
        "deactivated": 0,
        "created": "2024-08-06"
    },
    {
        "id": 4,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "size": 5.2,
        "diamond_color": {
            "id": 1,
            "name": "D"
        },
        "diamond_origin": {
            "id": 1,
            "name": "Natural"
        },
        "diamond_clarity": {
            "id": 1,
            "name": "IF"
        },
        "diamond_cut": {
            "id": 4,
            "name": "Excellent"
        },
        "price": 46600000,
        "deactivated": 0,
        "created": "2024-08-06"
    },
    {
        "id": 5,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "size": 5.2,
        "diamond_color": {
            "id": 1,
            "name": "D"
        },
        "diamond_origin": {
            "id": 1,
            "name": "Natural"
        },
        "diamond_clarity": {
            "id": 1,
            "name": "IF"
        },
        "diamond_cut": {
            "id": 5,
            "name": "Cut 5"
        },
        "price": 42100000,
        "deactivated": 0,
        "created": "2024-08-06"
    },
    {
        "id": 6,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "size": 5.2,
        "diamond_color": {
            "id": 2,
            "name": "E"
        },
        "diamond_origin": {
            "id": 1,
            "name": "Natural"
        },
        "diamond_clarity": {
            "id": 1,
            "name": "IF"
        },
        "diamond_cut": {
            "id": 1,
            "name": "Cut 1"
        },
        "price": 38100000,
        "deactivated": 0,
        "created": "2024-08-06"
    },
    {
        "id": 7,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "size": 5.2,
        "diamond_color": {
            "id": 2,
            "name": "E"
        },
        "diamond_origin": {
            "id": 1,
            "name": "Natural"
        },
        "diamond_clarity": {
            "id": 1,
            "name": "IF"
        },
        "diamond_cut": {
            "id": 2,
            "name": "Cut 2"
        },
        "price": 35800000,
        "deactivated": 0,
        "created": "2024-08-06"
    },
    {
        "id": 8,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "size": 5.2,
        "diamond_color": {
            "id": 2,
            "name": "E"
        },
        "diamond_origin": {
            "id": 1,
            "name": "Natural"
        },
        "diamond_clarity": {
            "id": 1,
            "name": "IF"
        },
        "diamond_cut": {
            "id": 3,
            "name": "Cut 3"
        },
        "price": 33000000,
        "deactivated": 0,
        "created": "2024-08-06"
    },
    {
        "id": 9,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "size": 5.2,
        "diamond_color": {
            "id": 2,
            "name": "E"
        },
        "diamond_origin": {
            "id": 1,
            "name": "Natural"
        },
        "diamond_clarity": {
            "id": 1,
            "name": "IF"
        },
        "diamond_cut": {
            "id": 4,
            "name": "Excellent"
        },
        "price": 30100000,
        "deactivated": 0,
        "created": "2024-08-06"
    },
    {
        "id": 10,
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "size": 5.2,
        "diamond_color": {
            "id": 2,
            "name": "E"
        },
        "diamond_origin": {
            "id": 1,
            "name": "Natural"
        },
        "diamond_clarity": {
            "id": 1,
            "name": "IF"
        },
        "diamond_cut": {
            "id": 5,
            "name": "Cut 5"
        },
        "price": 29000000,
        "deactivated": 0,
        "created": "2024-08-06"
    }
]



const Diamond_Page = () => {
    const [key, setKey] = useState('natural');
    let [state, setState] = useState(null);

    const [diamondList, setDiamondList] = useState([]);

    const handleDataChange = async () => {
        await get_account_list();
        const diamondList = data;
        setDiamondList(diamondList);

        alert('ON DATA CHANGE NÈ')
        setState({
            natural: state_creator(diamondList),
            lab: state_creator(diamondList),
        })
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
        <DiamondPageContext.Provider value={{ handleDataChange: handleDataChange }}>
            <CRow>
                <CCol xs={12}>
                    {state === null ? <CButton className="w-100" color="secondary" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton> :

                        <Tabs
                            defaultActiveKey="natural"
                            id="fill-tab-example"
                            className="mb-3"
                            activeKey={key}
                            fill
                            onSelect={(key) => {
                                setKey(key)
                                resetHeaderProperties();
                            }}

                        >

                            <Tab eventKey="natural" title="Natural Diamond Price Table">
                                {key === 'natural' &&
                                    <div
                                        id="natural"
                                        style={{
                                            boxSizing: "border-box",
                                            height: "100%",
                                            width: "100%"
                                        }}
                                        className="ag-theme-quartz"
                                    >
                                        <AgGridReact
                                            enableColResize={true}
                                            columnDefs={state.natural.columnDefs}
                                            rowData={state.natural.rowData}
                                            defaultColDef={defaultColDef}
                                            rowHeight={35}
                                            headerHeight={30}
                                            pagination={true}
                                            paginationPageSize={10}
                                            domLayout='autoHeight'
                                            onGridReady={onGridReady('natural')}
                                        />
                                    </div>
                                }
                            </Tab>



                            <Tab eventKey="lab" title="Lab Diamond Price Table">
                                {key === 'lab' &&
                                    <div
                                        id="lab"
                                        style={{
                                            boxSizing: "border-box",
                                            height: "100%",
                                            width: "100%"
                                        }}
                                        className="ag-theme-quartz"
                                    >
                                        <AgGridReact
                                            enableColResize={true}
                                            columnDefs={state.lab.columnDefs}
                                            rowData={state.lab.rowData}
                                            defaultColDef={defaultColDef}
                                            rowHeight={35}
                                            headerHeight={30}
                                            pagination={true}
                                            paginationPageSize={10}
                                            domLayout='autoHeight'
                                            onGridReady={onGridReady('lab')}
                                        />
                                    </div>
                                }
                            </Tab>


                        </Tabs>

                    }

                </CCol>
            </CRow>
        </DiamondPageContext.Provider>

    );

}
export default Diamond_Page;
