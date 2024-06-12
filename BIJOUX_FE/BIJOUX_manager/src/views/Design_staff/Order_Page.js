import React, { createContext, useEffect, useState, useContext, useMemo } from "react";
import { AgGridReact } from 'ag-grid-react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import {
    CButtonGroup,
    CRow,
    CCol,
    CCardHeader,
    CButton,
    CSpinner,
} from '@coreui/react'
import Modal_Button from "../component_items/Modal/ModalButton"
import { image_url } from "../../api/Back_End_Url";
import AvatarInput from "../component_items/Avatar/Avatar";
import onGridReady, { resetHeaderProperties } from "../component_items/Ag-grid/useStickyHeader";
import './style/style.css'
import { get_account_list } from "../../api/accounts/Account_Api";
import { design_process_status_creator, quote_status_creator } from "../component_items/Ag-grid/status_badge";
import { MagicWand, Money } from "phosphor-react";
import { useNavigate } from 'react-router-dom';



export const DesignOrderPageContext = createContext();



const state_creator = (table, navigate) => {
    const state = {
        columnDefs: [
            { headerName: "ID", field: "id", flex: 0.3 },
            {
                headerName: "Product id", field: "product.id", flex: 0.5,
            },
            {
                headerName: "Image", flex: 0.5,
                cellRenderer: (params) => {
                    return (
                        <img width={'100%'} src={params.data.product.imageUrl} />)

                },
            },
            {
                headerName: "Customer Name",
                cellRenderer: (params) => {
                    return params.data.account.fullname
                },
            },
            {
                headerName: "Contact Number",
                cellRenderer: (params) => {
                    return params.data.account.phone
                },
                flex: 0.7
            },
            { headerName: "Created", field: "created", flex: 0.4 },
           
            {
                headerName: "Design Status",
                cellClass: 'd-flex align-items-center py-1',
                valueGetter: 'data.design_process_status.id',
                cellRenderer: (params) => {
                    const design_process_status = params.data.design_process_status;
                    return design_process_status_creator(design_process_status);


                },
            },
            {
                headerName: "Updating",
                cellClass: 'd-flex justify-content-center py-0',
                cellRenderer: (params) => {
                    
                    const design_process_status = params.data.design_process_status;
                    const order_id = params.data.id;

                    return (
                        <>
                            {design_process_status == null ?
                                <CButton style={{ border: 'none' }} onClick={() => {

                                    navigate('/orders_design_staff/detail/' + order_id);
                                }} className="border-none h-100">
                                    <MagicWand size={30} color="deeppink" weight="duotone" />
                                </CButton> 
                                :
                                <MagicWand size={30} color="gray" weight="duotone" />


                            }
                        </>

                    )

                },
                flex: 0.5,
            }

        ],
        rowData: table

    }
    return state
}



const data = [
    {
        "id": 1,
        "product": {
            "id": 101,
            "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
            "mounting_type_id": 1,
            "model_id": 11,
            "mounting_size": "Medium"
        },
        "account": {
            "id": 201,
            "username": "johndoe",
            "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
            "dob": "1990-01-01",
            "email": "johndoe@example.com",
            "fullname": "John Doe",
            "role": {
                "id": 1,
                "name": "Customer"
            },
            "phone": "123-456-7890",
            "address": "123 Main St, Anytown, USA"
        },
        "order_status": {
            "id": 2,
            "name": "design"
        },
        "order_type": {
            "id": 2,
            "name": "Customize"
        },
        "deposit_has_paid": 12312,
        "profit_rate": 12,
        "product_price": 1000,
        "production_price": 800,
        "total_price": 1200,
        "note": "Rush order",
        "saleStaff_id": 301,
        "designStaff_id": 401,
        "productionStaff_id": 501,
        "created": "2024-05-01",
        "design_process_status": null
    },
    {
        "id": 2,
        "product": {
            "id": 102,
            "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
            "mounting_type_id": 2,
            "model_id": 12,
            "mounting_size": "Large"
        },
        "account": {
            "id": 202,
            "username": "janedoe",
            "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
            "dob": "1985-05-15",
            "email": "janedoe@example.com",
            "fullname": "Jane Doe",
            "role": {
                "id": 2,
                "name": "Customer"
            },
            "phone": "987-654-3210",
            "address": "456 Elm St, Anytown, USA"
        },
        "order_status": {
            "id": 2,
            "name": "Completed"
        },
        "order_type": {
            "id": 2,
            "name": "In-Store"
        },
        "deposit_has_paid": 123,
        "profit_rate": 0.20,
        "product_price": 1500,
        "production_price": 1000,
        "total_price": 1800,
        "note": "Gift wrapping",
        "saleStaff_id": 302,
        "designStaff_id": 402,
        "productionStaff_id": 502,
        "created": "2024-05-02",
        "design_process_status": {
            "id": 2,
            "name": "Completed"
        }
    },
    {
        "id": 3,
        "product": {
            "id": 103,
            "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
            "mounting_type_id": 3,
            "model_id": 13,
            "mounting_size": "Small"
        },
        "account": {
            "id": 203,
            "username": "bobsmith",
            "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
            "dob": "1978-03-22",
            "email": "bobsmith@example.com",
            "fullname": "Bob Smith",
            "role": {
                "id": 3,
                "name": "Customer"
            },
            "phone": "555-555-5555",
            "address": "789 Oak St, Anytown, USA"
        },
        "order_status": {
            "id": 3,
            "name": "Cancelled"
        },
        "order_type": {
            "id": 1,
            "name": "Online"
        },
        "deposit_has_paid": 0,
        "profit_rate": 0.10,
        "product_price": 2000,
        "production_price": 1500,
        "total_price": 2200,
        "note": "Special instructions",
        "saleStaff_id": 303,
        "designStaff_id": 403,
        "productionStaff_id": 503,
        "created": "2024-05-03",
        "design_process_status": {
            "id": 3,
            "name": "Cancelled"
        }
    },
    {
        "id": 4,
        "product": {
            "id": 104,
            "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
            "mounting_type_id": 4,
            "model_id": 14,
            "mounting_size": "Medium"
        },
        "account": {
            "id": 204,
            "username": "alicesmith",
            "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
            "dob": "1992-12-10",
            "email": "alicesmith@example.com",
            "fullname": "Alice Smith",
            "role": {
                "id": 4,
                "name": "Customer"
            },
            "phone": "666-666-6666",
            "address": "321 Pine St, Anytown, USA"
        },
        "order_status": {
            "id": 4,
            "name": "Pending"
        },
        "order_type": {
            "id": 3,
            "name": "Phone"
        },
        "deposit_has_paid": 0,
        "profit_rate": 0.25,
        "product_price": 2500,
        "production_price": 2000,
        "total_price": 3000,
        "note": "Urgent delivery",
        "saleStaff_id": 304,
        "designStaff_id": 404,
        "productionStaff_id": 504,
        "created": "2024-05-04",
        "design_process_status": null
    },
    {
        "id": 5,
        "product": {
            "id": 105,
            "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
            "mounting_type_id": 5,
            "model_id": 15,
            "mounting_size": "Large"
        },
        "account": {
            "id": 205,
            "username": "charliebrown",
            "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
            "dob": "1980-06-15",
            "email": "charliebrown@example.com",
            "fullname": "Charlie Brown",
            "role": {
                "id": 5,
                "name": "Customer"
            },
            "phone": "777-777-7777",
            "address": "123 Maple St, Anytown, USA"
        },
        "order_status": {
            "id": 2,
            "name": "Completed"
        },
        "order_type": {
            "id": 1,
            "name": "Online"
        },
        "deposit_has_paid": true,
        "profit_rate": 0.18,
        "product_price": 1800,
        "production_price": 1500,
        "total_price": 2100,
        "note": "Anniversary gift",
        "saleStaff_id": 305,
        "designStaff_id": 405,
        "productionStaff_id": 505,
        "created": "2024-05-05",
        "design_process_status": {
            "id": 2,
            "name": "Completed"
        }
    }
]


const Order_Page = () => {
    const [key, setKey] = useState('customize');
    let [state, setState] = useState(null);
    const navigate = useNavigate();
    const handleDataChange = async () => {
        await get_account_list();
        const orderList = data

        setState({
            customize: state_creator(orderList, navigate),
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
        <DesignOrderPageContext.Provider value={{ handleDataChange: handleDataChange }}>
            <CRow>
                <CCol xs={12} className="quote-table">
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
                            {key === 'customize' &&
                                <Tab eventKey="customize" title="Customize">
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

                                </Tab>
                            }

                        </Tabs>
                    }

                </CCol>

            </CRow>

        </DesignOrderPageContext.Provider>
    );

}
export default Order_Page;
