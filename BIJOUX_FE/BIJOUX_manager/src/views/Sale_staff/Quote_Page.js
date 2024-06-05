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
import { quote_status_creator } from "../component_items/Ag-grid/status_badge";
import { Money } from "phosphor-react";
import { useNavigate } from 'react-router-dom';



export const Staff_Page_Context = createContext();



const state_creator = (table, navigate) => {
    const state = {
        columnDefs: [
            { headerName: "id", field: "id", flex: 0.3 },
            {
                headerName: "Product id", field: "product_id", flex: 0.5,
            },
            {
                headerName: "Image", flex: 0.5,
                cellRenderer: (params) => {
                    return (
                        <img src={params.data.product.imageUrl} />)

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
            },
            { headerName: "Created", field: "created", flex: 0.4 },
            {
                headerName: "Status",
                cellClass: 'd-flex align-items-center py-1',
                valueGetter: 'data.quote_status.id',
                cellRenderer: (params) => {
                    const quote_status = params.data.quote_status;
                    return quote_status_creator(quote_status);


                },
            },
            {
                headerName: "Pricing",
                cellClass: 'd-flex justify-content-center py-0',
                cellRenderer: (params) => {
                    console.log(params.data)
                    const quote_status = params.data.quote_status;
                    const quote_id = params.data.id;

                    return (
                        <>
                            {quote_status.id == 2 ?
                                <CButton style={{border:'none'}} onClick={() => {

                                    navigate('/quotes_sale_staff/detail/' + quote_id);
                                }} className="border-none h-100">
                                    <Money size={40} color="green " weight="duotone" />
                                </CButton> :

                                <Money size={40} color="gray" weight="duotone" />


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
            id: 1,
            "product": {
                "id": 2,
                "imageUrl": "http://localhost:8000/image/Order/2/main.jpg",
                "mounting_type": {
                    "id": 2,
                    "name": "Band"
                },
                "model_id": 501,
                "mounting_size": "6.5",
                "product_diamond": [
                    // {
                    //     "id": 101,
                    //     "product_id": 201,
                    //     "diamond": {
                    //         "id": 3,
                    //         "size": "1.0",
                    //         "name": "Brilliant Round",
                    //         "imageUrl": "http://localhost:8000/image/Diamond/D_IF/main.jpg",
                    //         "color": "D",
                    //         "diamond_origin": {
                    //             "id": 2,
                    //             "name": 'man-made'
                    //              },
                    //         "IF": 5000.00,
                    //         "VVS1": 6754,
                    //         "VVS2": 345,
                    //         "VS1": 23425,
                    //         "VS2": 14124,
                    //         "deactivated": 0,
                    //         "created": "2024-05-15"
                    //     },
                    //     "diamond_color": "D",
                    //     "diamond_size": "1.0",
                    //     "diamond_clarity": "IF",
                    //     "price_in_one": 5000.00,
                    //     "diamond_shape": {
                    //         "id": 10,
                    //         "name": "Round",
                    //         "drawing_path": "https://example.com/shapes/round.png"
                    //     },
                    //     "count": 1,
                    //     "price": 5000.00,
                    //     "is_accepted": true
                    // },
                    // {
                    //     "id": 102,
                    //     "product_id": 202,
                    //     "diamond": {
                    //         "id": 2,
                    //         "size": "1.0",
                    //         "name": "Brilliant Round",
                    //         "imageUrl": "http://localhost:8000/image/Diamond/E_VVS1/main.jpg",
                    //         "color": "D",
                    //         "diamond_origin": {
                    //             "id": 1,
                    //             "name": 'natural'
                    //         },
                    //         "IF": 5000.00,
                    //         "VVS1": 2500.00,
                    //         "VVS2": 345,
                    //         "VS1": 23425,
                    //         "VS2": 14124,
                    //         "deactivated": 0,
                    //         "created": "2024-05-15"
                    //     },
                    //     "diamond_color": "E",
                    //     "diamond_size": "0.5",
                    //     "diamond_clarity": "VVS1",
                    //     "price_in_one": 2500.00,
                    //     "diamond_shape": {
                    //         "id": 11,
                    //         "name": "Princess",
                    //         "drawing_path": "https://example.com/shapes/princess.png"
                    //     },
                    //     "count": 2,
                    //     "price": 5000.00,
                    //     "is_accepted": false
                    // }
                ],
                "product_metal": [
                    // {
                    //     "product_id": 2,
                    //     "metal": {
                    //         id: 1,
                    //         imageUrl:"http://localhost:8000/image/Metal/1/main.jpg",
                    //         name: "Gold",
                    //         sale_price_per_gram: 501224.00
                    //     },
                    //     "volume": "10.0",
                    //     "weight": "20.0",
                    //     "is_accepted": true,
                    //     "price": 1500.00
                    // },
                    // {
                    //     "product_id": 2,
                    //     "metal": {
                    //         id: 5,
                    //         imageUrl:"http://localhost:8000/image/Metal/5/main.jpg",
                    //         name: "platinum",
                    //         sale_price_per_gram: 501224.00
                    //     },
                    //     "volume": "5.0",
                    //     "weight": "10.0",
                    //     "is_accepted": true,
                    //     "price": 800.00
                    // }
                ]
            },
            account: {
                id: 1,
                username: 'john_doe',
                password: 'hashed_password',
                image: 'http://example.com/image.jpg',
                dob: '1990-01-01',
                email: 'john.doe@example.com',
                fullname: 'John Doe',
                role_id: 2,
                phone: '123-456-7890',
                address: '123 Main St, Anytown, USA'
            },
            quote_status: {
                id: 2,
                name: 'Assign'
            },
            order_type: {
                id: 1,
                name: 'Standard'
            },
            product_price: 100.0,
            production_price: 70.0,
            profit_rate: 30.0,
            saleStaff_id: 3,
            designStaff_id: 4,
            productionStaff_id: 5,
            note: 'Urgent delivery required',
            created: '2023-05-24'
        }
    ]
    // template_quote_list: [
    //     {
    //         id: 2,
    //         "product": {
    //             "id": 2,
    //             "imageUrl": "http://localhost:8000/image/Order/2/main.jpg",
    //             "mounting_type": {
    //                 "id": 2,
    //                 "name": "Band"
    //             },
    //             "model_id": 501,
    //             "mounting_size": "6.5",
    //             "product_diamond": [
    //                 // {
    //                 //     "id": 101,
    //                 //     "product_id": 201,
    //                 //     "diamond": {
    //                 //         "id": 3,
    //                 //         "size": "1.0",
    //                 //         "name": "Brilliant Round",
    //                 //         "imageUrl": "http://localhost:8000/image/Diamond/D_IF/main.jpg",
    //                 //         "color": "D",
    //                 //         "diamond_origin": {
    //                 //             "id": 2,
    //                 //             "name": 'man-made'
    //                 //              },
    //                 //         "IF": 5000.00,
    //                 //         "VVS1": 6754,
    //                 //         "VVS2": 345,
    //                 //         "VS1": 23425,
    //                 //         "VS2": 14124,
    //                 //         "deactivated": 0,
    //                 //         "created": "2024-05-15"
    //                 //     },
    //                 //     "diamond_color": "D",
    //                 //     "diamond_size": "1.0",
    //                 //     "diamond_clarity": "IF",
    //                 //     "price_in_one": 5000.00,
    //                 //     "diamond_shape": {
    //                 //         "id": 10,
    //                 //         "name": "Round",
    //                 //         "drawing_path": "https://example.com/shapes/round.png"
    //                 //     },
    //                 //     "count": 1,
    //                 //     "price": 5000.00,
    //                 //     "is_accepted": true
    //                 // },
    //                 // {
    //                 //     "id": 102,
    //                 //     "product_id": 202,
    //                 //     "diamond": {
    //                 //         "id": 2,
    //                 //         "size": "1.0",
    //                 //         "name": "Brilliant Round",
    //                 //         "imageUrl": "http://localhost:8000/image/Diamond/E_VVS1/main.jpg",
    //                 //         "color": "D",
    //                 //         "diamond_origin": {
    //                 //             "id": 1,
    //                 //             "name": 'natural'
    //                 //         },
    //                 //         "IF": 5000.00,
    //                 //         "VVS1": 2500.00,
    //                 //         "VVS2": 345,
    //                 //         "VS1": 23425,
    //                 //         "VS2": 14124,
    //                 //         "deactivated": 0,
    //                 //         "created": "2024-05-15"
    //                 //     },
    //                 //     "diamond_color": "E",
    //                 //     "diamond_size": "0.5",
    //                 //     "diamond_clarity": "VVS1",
    //                 //     "price_in_one": 2500.00,
    //                 //     "diamond_shape": {
    //                 //         "id": 11,
    //                 //         "name": "Princess",
    //                 //         "drawing_path": "https://example.com/shapes/princess.png"
    //                 //     },
    //                 //     "count": 2,
    //                 //     "price": 5000.00,
    //                 //     "is_accepted": false
    //                 // }
    //             ],
    //             "product_metal": [
    //                 // {
    //                 //     "product_id": 2,
    //                 //     "metal": {
    //                 //         id: 1,
    //                 //         imageUrl:"http://localhost:8000/image/Metal/1/main.jpg",
    //                 //         name: "Gold",
    //                 //         sale_price_per_gram: 501224.00
    //                 //     },
    //                 //     "volume": "10.0",
    //                 //     "weight": "20.0",
    //                 //     "is_accepted": true,
    //                 //     "price": 1500.00
    //                 // },
    //                 // {
    //                 //     "product_id": 2,
    //                 //     "metal": {
    //                 //         id: 5,
    //                 //         imageUrl:"http://localhost:8000/image/Metal/5/main.jpg",
    //                 //         name: "platinum",
    //                 //         sale_price_per_gram: 501224.00
    //                 //     },
    //                 //     "volume": "5.0",
    //                 //     "weight": "10.0",
    //                 //     "is_accepted": true,
    //                 //     "price": 800.00
    //                 // }
    //             ]
    //         },
    //         account: {
    //             id: 2,
    //             username: 'jane_doe',
    //             password: 'hashed_password',
    //             image: 'http://example.com/image2.jpg',
    //             dob: '1992-02-02',
    //             email: 'jane.doe@example.com',
    //             fullname: 'Jane Doe',
    //             role_id: 3,
    //             phone: '098-765-4321',
    //             address: '456 Elm St, Othertown, USA'
    //         },
    //         quote_status: {
    //             id: 2,
    //             name: 'Assigned'
    //         },
    //         order_type: {
    //             id: 2,
    //             name: 'Express'
    //         },
    //         product_price: 150.0,
    //         production_price: 100.0,
    //         profit_rate: 50.0,
    //         saleStaff_id: 6,
    //         designStaff_id: 7,
    //         productionStaff_id: 8,
    //         note: 'Standard delivery time',
    //         created: '2023-05-24'
    //     }
    // ]





const Quote_Page = () => {
    const [key, setKey] = useState('customize');
    let [state, setState] = useState(null);
    const navigate = useNavigate();
    const handleTableChange = async () => {
        const accountList = await get_account_list();
        //const quoteList = accountList.staff_list;
        const quoteList = data
        console.log("staffLisst ", quoteList)
        setState({
            //template: state_creator(quoteList.template_quote_list, navigate),
            customize: state_creator(quoteList, navigate),
        })
    }

    useEffect(() => {
        handleTableChange()
    }, [])


    // const defaultColDef = useMemo(() => {
    //     return {
    //         flex: 1,
    //         filter: true,
    //         autoHeight: true,
    //         wrapText: true,
    //         cellClass: 'd-flex align-items-center',
    //         cellStyle: { fontSize: '11px' }
    //     };
    // }, [])
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
        <Staff_Page_Context.Provider value={{ onDataChange: handleTableChange }}>
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
                            {/* <Tab eventKey="template" title="By Template" selected>
                                {key === 'template' && <div
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
                                </div>}




                            </Tab> */}
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






        </Staff_Page_Context.Provider>
    );

}
export default Quote_Page;
