import React, { createContext, useEffect, useState, useRef, useContext, useMemo } from "react";
import { AgGridReact } from 'ag-grid-react';

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
    CSpinner,
    CRow,
    CCol,
    CCardHeader,
} from '@coreui/react'
import { ArrowCircleUp, CurrencyCircleDollar, Eye, MagicWand, Pencil, PlusCircle, UserCirclePlus } from "phosphor-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import './style/style.css'
import { Button, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
export const Staff_Page_Context = createContext();
import Textarea from '@mui/joy/Textarea';
import AccountCard from "./Order widget/AccountCard";
import OrderDetailCard from "./Order widget/OrderDetailCard";
import NoteCard from "./Order widget/NoteCard";
import MetalCard from "./Modal_body/model/widget/MetalCard";
import DiamondCard from "./Modal_body/model/widget/DiamondCard";
import UploadSingle from "./Order widget/UploadSingle";
import OtherCard from "./Order widget/OtherCard";
import PriceCard from "./Order widget/PriceCard";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/notification/toastSlice";
import { get_account_list } from "../../api/main/accounts/Account_api";
import { getUserFromPersist } from "../../api/instance/axiosInstance";
import { get_order_detail, request_design_process } from "../../api/main/orders/Order_api";
import { get_mounting_type_list } from "../../api/main/items/Model_api";


const order_detail_data = {
    "order_detail": {
        "id": 1,
        "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
        "product": {
            "id": 101,
            "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
            "mounting_type": {
                "id": 1,
                "name": "Prong"
            },
            "model": {
                "name": "Elegant Ring",
                "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
                "mounting_type": {
                    "id": 1,
                    "name": "Prong"
                },
                "mounting_style": {
                    "id": 1,
                    "name": "Classic"
                },
                "base_width": 2.5,
                "base_height": 1.8,
                "volume": 12.3,
                "isAvailable": true,
                "deactivated": false
            },
            "mounting_size": "7",
            "product_diamond": [
                {
                    "id": 201,
                    "product_id": 101,
                    "diamond": {
                        "id": 301,
                        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
                        "size": 1.2,
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
                            "name": "Round"
                        },
                        "price": 5000,
                        "deactivated": false,
                        "created": "2024-05-01"
                    },
                    "diamond_shape": {
                        "id": 1,
                        "name": "Round",
                        "drawing_path": "https://example.com/shapes/round.jpg"
                    },
                    "count": 1,
                    "price": 5000,
                    "status": "Available"
                },
                {
                    "id": 202,
                    "product_id": 101,
                    "diamond": {
                        "id": 302,
                        "imageUrl": "http://localhost:8000/image/Diamond/E_VVS1.jpg",
                        "size": 1.5,
                        "diamond_color": {
                            "id": 2,
                            "name": "E"
                        },
                        "diamond_origin": {
                            "id": 1,
                            "name": "Natural"
                        },
                        "diamond_clarity": {
                            "id": 2,
                            "name": "VVS1"
                        },
                        "diamond_cut": {
                            "id": 2,
                            "name": "Princess"
                        },
                        "price": 7000,
                        "deactivated": false,
                        "created": "2024-05-01"
                    },
                    "diamond_shape": {
                        "id": 2,
                        "name": "Princess",
                        "drawing_path": "https://example.com/shapes/princess.jpg"
                    },
                    "count": 1,
                    "price": 7000,
                    "status": "Available"
                },
                {
                    "id": 203,
                    "product_id": 101,
                    "diamond": {
                        "id": 303,
                        "imageUrl": "http://localhost:8000/image/Diamond/F_VS1.jpg",
                        "size": 1.8,
                        "diamond_color": {
                            "id": 3,
                            "name": "F"
                        },
                        "diamond_origin": {
                            "id": 1,
                            "name": "Natural"
                        },
                        "diamond_clarity": {
                            "id": 3,
                            "name": "VS1"
                        },
                        "diamond_cut": {
                            "id": 3,
                            "name": "Emerald"
                        },
                        "price": 8000,
                        "deactivated": false,
                        "created": "2024-05-01"
                    },
                    "diamond_shape": {
                        "id": 3,
                        "name": "Emerald",
                        "drawing_path": "https://example.com/shapes/emerald.jpg"
                    },
                    "count": 1,
                    "price": 8000,
                    "status": "Available"
                }
            ],
            "product_metal": [
                {
                    "product_id": 101,
                    "metal": {
                        "id": 401,
                        "name": "18K White Gold",
                        "buy_price_per_gram": 70,
                        "sale_price_per_gram": 80,
                        "imageUrl": "http://localhost:8000/image/Metal/1/main.jpg",
                        "specific_weight": 19.3,
                        "deactivated": false,
                        "created": "2024-05-01"
                    },
                    "volume": 8,
                    "weight": 2.5,
                    "status": "Available",
                    "price": 200
                },
                {
                    "product_id": 101,
                    "metal": {
                        "id": 402,
                        "name": "Palladium",
                        "buy_price_per_gram": 90,
                        "sale_price_per_gram": 100,
                        "imageUrl": "http://localhost:8000/image/Metal/2/main.jpg",
                        "specific_weight": 12.0,
                        "deactivated": false,
                        "created": "2024-05-01"
                    },
                    "volume": 6,
                    "weight": 3,
                    "status": "Available",
                    "price": 300
                },
                {
                    "product_id": 101,
                    "metal": {
                        "id": 403,
                        "name": "Titanium",
                        "buy_price_per_gram": 40,
                        "sale_price_per_gram": 50,
                        "imageUrl": "http://localhost:8000/image/Metal/3/main.jpg",
                        "specific_weight": 4.5,
                        "deactivated": false,
                        "created": "2024-05-01"
                    },
                    "volume": 9,
                    "weight": 1.8,
                    "status": "Available",
                    "price": 90
                }
            ]
        },
        "account": {
            "id": 501,
            "username": "johndoe",
            "imageUrl": "http://localhost:8000/image/Account/1/main.jpg",
            "dob": "1980-01-01",
            "email": "johndoe@example.com",
            "fullname": "John Doe",
            "role": {
                "id": 1,
                "name": "Customer"
            },
            "phone": "123-456-7890",
            "address": "123 Main St, Anytown, USA",
            "deactivated": false,
            "deactivated_date": null
        },
        "order_status": {
            "id": 1,
            "name": "Pending"
        },
        "order_type": {
            "id": 1,
            "name": "Online"
        },
        "deposit_has_paid": true,
        "product_price": 15000,
        "profit_rate": 0.2,
        "production_price": 12000,
        "total_price": 18000,
        "note": "Urgent delivery",
        "sale_staff": {
            "id": 601,
            "username": "salestaff1",
            "imageUrl": "https://example.com/staff/salestaff1.jpg",
            "dob": "1985-07-15",
            "email": "salestaff1@example.com",
            "fullname": "Sales Staff One",
            "role": {
                "id": 2,
                "name": "Sales"
            },
            "phone": "234-567-8901",
            "address": "456 Oak St, Anytown, USA",
            "order_count": 30,
            "deactivated": false,
            "deactivated_date": null
        },
        "design_staff": {
            "id": 701,
            "username": "designstaff1",
            "imageUrl": "https://example.com/staff/designstaff1.jpg",
            "dob": "1990-02-20",
            "email": "designstaff1@example.com",
            "fullname": "Design Staff One",
            "role": {
                "id": 3,
                "name": "Designer"
            },
            "phone": "345-678-9012",
            "address": "789 Pine St, Anytown, USA",
            "order_count": 15,
            "deactivated": false,
            "deactivated_date": null
        },
        "production_staff": {
            "id": 801,
            "username": "productionstaff1",
            "imageUrl": "https://example.com/staff/productionstaff1.jpg",
            "dob": "1995-05-25",
            "email": "productionstaff1@example.com",
            "fullname": "Production Staff One",
            "role": {
                "id": 4,
                "name": "Production"
            },
            "phone": "456-789-0123",
            "address": "1010 Maple St, Anytown, USA",
            "order_count": 10,
            "deactivated": false,
            "deactivated_date": null
        },
        "created": "2024-05-01",
        "design_process_status": null,
        // {
        //     "id": 2,
        //     "name": "Completed"
        // }
    }
}


const mounting_type = [
    {
        id: 1,
        name: "Ring",
    },
    {
        id: 2,
        name: "Band",
    },
    {
        id: 3,
        name: "Pendant",
    }
]




const Order_Detail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const index = useParams();

    const [order, setOrder] = useState(null);
    const [account, setAccount] = useState(null);
    const [product, setProduct] = useState(null);
    const [mountingType, setMountingType] = useState([]);
    const [imageBase64, setImageBase64] = useState(null);

    const [loading, setLoading] = useState(true);
    //report
    const [typeId, setTypeId] = useState(null);
    const [size, setSize] = useState(null);
    const [metalList, setMetalList] = useState([]);
    const [diamondList, setDiamondList] = useState([]);
    const [note, setNote] = useState(`Designer [ID: #${getUserFromPersist().id}] Note: \n`);


    const handleSingleFileBase64 = (base64) => {
        console.log('file nè', base64)
        setImageBase64(base64)
    }
    const handleNote = (note) => {
        console.log('note', note)
        setNote(note);
    }
    const handleMetal = (metal_list) => {
        console.log('metal_list', metal_list)
        setMetalList([...metal_list])
    }
    const handleDiamond = (diamond_list) => {
        console.log('diamond_list', diamond_list)
        setDiamondList([...diamond_list])
    }
    const handleOther = (type_id, mounting_size) => {
        console.log('mounting_type id', type_id)
        console.log('mounting_size', mounting_size)
        setTypeId(type_id);
        setSize(mounting_size > 0 ? mounting_size : 0);
    }



    useEffect(() => {
        const setAttribute = async () => {


            const formData = new FormData();
            formData.append('order_id', index.id);
            const detail_data = await get_order_detail(formData);
            const mounting_type = await get_mounting_type_list()

            const order_detail = detail_data.data.order_detail


            console.log('order_detail', order_detail)
            if (order_detail.design_process_status != null) {
                dispatch(setToast({ color: "danger", title: 'Order [ID: #' + order_detail.id + ']', mess: "This order is already have a design process" }))
                navigate('/orders_design_staff/table')
            }

            setOrder(order_detail)
            setAccount(order_detail.account)
            setProduct(order_detail.product)
            setMountingType(mounting_type.data)
            setTypeId(order_detail.product.mounting_type ? order_detail.product.mounting_type.id : null)
            setSize(parseFloat(order_detail.product.mounting_size))

            setLoading(false)

        }
        setAttribute();

    }, [])



    const handleReport = async () => {
        const new_design_process = {
            "order_id": order.id,
            "imageUrl": imageBase64 ? imageBase64 : null,
            "note": note.trim(),
            "mounting_type_id": isNaN(typeId) ? null : typeId,
            "mounting_size": isNaN(size) ? null : size,
            "metal_list": metalList,
            "diamond_list": diamondList,
            "production_price": null,
            "profit_rate": null,

        }
        console.log('new_design_process', new_design_process)
        const formData = new FormData();
        formData.append('new_design_process', JSON.stringify(new_design_process));


        let response = await request_design_process(formData, 'New Design Process');
        dispatch(setToast(response.mess))
        if (response.success) {
            //handleDataChange();
            navigate('/orders_design_staff/table')
        }
       
        

        
    }
    return (
        <div>
            <CRow>
                <CCol xs={12}>
                    {loading ? <CButton className="w-100" color="secondary" disabled>
                        <CSpinner as="span" size="sm" aria-hidden="true" />
                        Loading...
                    </CButton> :
                        <CCard className="mb-4">
                            <CCardHeader>
                                <strong>CREATE DESIGN PROCESS FOR ORDER ID [ #{order.id} ]</strong> <small><MagicWand size={30} color="lime" weight="duotone" /></small>
                            </CCardHeader>
                            <CCardBody className="bg-light">

                                <CRow >
                                    <CCol className="d-flex flex-column " xs={12} md={7} lg={7} >

                                        <AccountCard account={account} avatarSize={130} cardHeight={'120px'} />
                                        <div className="flex-grow-1">
                                            <NoteCard handleChange={handleNote} note={note} />

                                        </div>
                                    </CCol>
                                    <CCol xs={12} md={5} lg={5} style={{ height: '450px' }}>
                                        <div className="h-50">
                                            <OrderDetailCard order={order} />
                                        </div>
                                        <div className="h-50 d-flex p-2 flex-column mt-1 rounded"  >

                                            <span className="text-dark fw-bold fs-5 text-center">Product Image</span>

                                            <UploadSingle defaultImage={product.imageUrl} disabled={false} handleSingleFileBase64={handleSingleFileBase64} />

                                        </div>
                                    </CCol>

                                </CRow>


                                <div className="d-flex flex-column align-items-center my-3">
                                    <hr style={{ height: '2px', backgroundColor: 'black', border: 'none', width: '70%' }} />
                                    <h2 className="text-dark">Product Information</h2>
                                </div>
                                <div className="my-4">
                                    <MetalCard handleChange={handleMetal} product={product} />
                                </div>
                                <div className="my-4">
                                    <DiamondCard handleChange={handleDiamond} product={product} />
                                </div>
                                <CRow>


                                    <OtherCard handleChange={handleOther} mountingType={mountingType} order={order} product={product} />



                                </CRow>
                                <div className="d-flex justify-content-center mt-5">
                                    <Button
                                        disabled={metalList.length === 0}
                                        onClick={() => handleReport()}
                                        color="success"
                                        variant="outlined"
                                        className="fw-bold d-flex align-items-center text-center">
                                        Confirm Create Design Process <MagicWand size={30} color="lime" weight="duotone" /></Button>
                                </div>

                            </CCardBody>
                        </CCard>
                    }

                </CCol>
            </CRow>
        </div>
    );

}
export default Order_Detail;
