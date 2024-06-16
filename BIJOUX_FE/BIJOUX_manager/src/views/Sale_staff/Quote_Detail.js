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
    CFormInput,
    CInputGroupText,
    CInputGroup,
    CFormSelect,
    CFormTextarea,
} from '@coreui/react'
import { get_product_list, update_product_list } from "../../api/ProductApi";
import Modal_Button from "../component_items/Modal/ModalButton"
import { ArrowCircleUp, CurrencyCircleDollar, Eye, Pencil, PlusCircle, UserCirclePlus } from "phosphor-react";
import AvatarInput from "../component_items/Avatar/Avatar";
//import useStickyHeader, { StickyText } from "../component_items/Ag-grid/useStickyHeader";
import onGridReady, { resetHeaderProperties } from "../component_items/Ag-grid/useStickyHeader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import './style/style.css'
import { Button, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
export const Staff_Page_Context = createContext();
import Textarea from '@mui/joy/Textarea';
import AccountCard from "./Quote widget/AccountCard";
import QuoteDetailCard from "./Quote widget/QuoteDetailCard";
import NoteCard from "./Quote widget/NoteCard";
import MetalCard from "./Modal_body/model/widget/MetalCard";
import DiamondCard from "./Modal_body/model/widget/DiamondCard";
import UploadSingle from "./Quote widget/UploadSingle";
import OtherCard from "./Quote widget/OtherCard";
import PriceCard from "./Quote widget/PriceCard";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/notification/toastSlice";
import { get_account_list } from "../../api/main/accounts/Account_api";
import { get_quote_detail, pricing_quote } from "../../api/main/orders/Quote_api";
import { get_mounting_type_list } from "../../api/main/items/Model_api";


const quote_detail_data = {
    "quote_detail": {
        "id": 1,
        "product": {
            "id": 1,
            "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
            "mounting_type": {
                "id": 1,
                "name": "Prong"
            },
            //"mounting_type": null,
            "model": null,
            "mounting_size": 123,
            "product_diamond": [
                // {
                //     "id": 1,
                //     "product_id": 1,
                //     "diamond": {
                //         "id": 1,
                //         "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
                //         "size": 1.0,
                //         "diamond_color": {
                //             "id": 1,
                //             "name": "D"
                //         },
                //         "diamond_origin": {
                //             "id": 1,
                //             "name": "Natural"
                //         },
                //         "diamond_clarity": {
                //             "id": 1,
                //             "name": "IF"
                //         },
                //         "diamond_cut": {
                //             "id": 1,
                //             "name": "Excellent"
                //         },
                //         "price": 10000.00,
                //         "deactivated": false,
                //         "created": "2023-01-01T00:00:00.000Z"
                //     },
                //     "diamond_shape": {
                //         "id": 1,
                //         "name": "Round",
                //         "drawing_path": "https://example.com/shapes/round.png"
                //     },
                //     "count": 1,
                //     "price": 10000.00,
                //     "isAccepted": true
                // },
                // {
                //     "id": 2,
                //     "product_id": 1,
                //     "diamond": {
                //         "id": 2,
                //         "imageUrl": "http://localhost:8000/image/Diamond/E_VVS1.jpg",
                //         "size": 0.5,
                //         "diamond_color": {
                //             "id": 2,
                //             "name": "E"
                //         },
                //         "diamond_origin": {
                //             "id": 1,
                //             "name": "Natural"
                //         },
                //         "diamond_clarity": {
                //             "id": 2,
                //             "name": "VVS1"
                //         },
                //         "diamond_cut": {
                //             "id": 2,
                //             "name": "Very Good"
                //         },
                //         "price": 5000.00,
                //         "deactivated": false,
                //         "created": "2023-01-01"
                //     },
                //     "diamond_shape": {
                //         "id": 2,
                //         "name": "Princess",
                //         "drawing_path": "http://localhost:8000/image/Metal/1/main.jpg",
                //     },
                //     "count": 2,
                //     "price": 10000.00,
                //     "isAccepted": true
                // }
            ],
            "product_metal": [
                // {
                //     "product_id": 1,
                //     "metal": {
                //         "id": 1,
                //         "name": "Gold",
                //         "buy_price_per_gram": 50.00,
                //         "sale_price_per_gram": 75.00,
                //         "imageUrl": "http://localhost:8000/image/Metal/1/main.jpg",
                //         "specific_weight": 19.32,
                //         "deactivated": false,
                //         "created": "2023-01-01T00:00:00.000Z"
                //     },
                //     "volume": 3.0,
                //     "weight": 60.0,
                //     "isAccepted": true,
                //     "price": 4500.00
                // },
                // {
                //     "product_id": 1,
                //     "metal": {
                //         "id": 2,
                //         "name": "Platinum",
                //         "buy_price_per_gram": 100.00,
                //         "sale_price_per_gram": 150.00,
                //         "imageUrl": "http://localhost:8000/image/Metal/2/main.jpg",
                //         "specific_weight": 21.45,
                //         "deactivated": false,
                //         "created": "2023-01-01T00:00:00.000Z"
                //     },
                //     "volume": 2.0,
                //     "weight": 50.0,
                //     "isAccepted": true,
                //     "price": 7500.00
                // }
            ]
        },
        "account": {
            "id": 1,
            "username": "john_doe",
            "password": "hashed_password",
            "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
            "dob": "1985-06-15",
            "email": "john.doe@example.com",
            "fullname": "John Doe",
            "role": {
                "id": 1,
                "name": "Customer"
            },
            "phone": "+1234567890",
            "address": "123 Main St, Springfield, IL"
        },
        "quote_status": {
            "id": 2,
            "name": "Assign"
        },
        "order_type": {
            "id": 1,
            "name": "Custom"
        },
        "product_price": 0,
        "production_price": 0,
        "profit_rate": 0,
        "sale_staff": {
            "id": 2,
            "username": "sales_jane",
            "password": "hashed_password",
            "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
            "dob": "1990-07-20",
            "email": "jane.sales@example.com",
            "fullname": "Jane Sales",
            "role": {
                "id": 2,
                "name": "Sales"
            },
            "phone": "+1230987654",
            "address": "456 Elm St, Shelbyville, IL"
        },
        "design_staff": {
            "id": 3,
            "username": "design_bob",
            "password": "hashed_password",
            "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
            "dob": "1988-05-22",
            "email": "bob.design@example.com",
            "fullname": "Bob Designer",
            "role": {
                "id": 3,
                "name": "Designer"
            },
            "phone": "+3216549870",
            "address": "789 Maple St, Capital City, IL"
        },
        "production_staff": {
            "id": 4,
            "username": "prod_alice",
            "password": "hashed_password",
            "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
            "dob": "1992-11-30",
            "email": "alice.prod@example.com",
            "fullname": "Alice Producer",
            "role": {
                "id": 4,
                "name": "Production"
            },
            "phone": "+3214560987",
            "address": "321 Oak St, Ogdenville, IL"
        },
        "note": "This is a special custom order.",
        "created": "2024-05-20T08:30:00.000Z"
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




const Quote_Detail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const index = useParams();

    const [quote, setQuote] = useState(null);
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
    const [productionPrice, setProductionPrice] = useState(0);
    const [profitRate, setProfitRate] = useState(0);
    const [note, setNote] = useState(null);

    const [totalPrice, setTotalPrice] = useState(0);

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
    const handlePrice = (profit_rate, production_price) => {
        console.log('profit rate', profit_rate)
        console.log('production price', production_price)
        setProfitRate(profit_rate);
        setProductionPrice(production_price > 0 ? production_price : 0);
    }



    useEffect(() => {
        const setAttribute = async () => {

            const formData = new FormData();
            formData.append('quote_id', index.id);
            const detail_data = await get_quote_detail(formData);
            const quote_detail = detail_data.data.quote_detail;



            if (quote_detail.quote_status.id !== 2) {
                dispatch(setToast({ color: "danger", title: 'Quote [ID: #' + quote_detail.id + ']', mess: "This quote is not in pricing process" }))
                navigate('/quotes_sale_staff/table')
            }



            setQuote(quote_detail)
            setAccount(quote_detail.account)
            setProduct(quote_detail.product)


            const mounting_type_list = await get_mounting_type_list();
            //const quote_detail = detail_data.data.quote_detail;
            setMountingType(mounting_type_list.data)


            setImageBase64(quote_detail.product.imageUrl)
            setTypeId(quote_detail.product.mounting_type ? quote_detail.product.mounting_type.id : null)
            setSize(quote_detail.product.mounting_size)
            setNote(quote_detail.note)

            setLoading(false)

        }
        setAttribute();

    }, [])
    useEffect(() => {
        const total = (parseFloat(productionPrice) + (metalList.reduce((total, item) => total + item.price, 0) + diamondList.reduce((total, item) => total + item.price, 0)) * (profitRate + 100) / 100).toFixed(2);
        console.log('Total', total)
        setTotalPrice(parseFloat(total));
    }, [profitRate, productionPrice, metalList, diamondList])


    const handleReport = async () => {
        //await get_account_list()
        const priced_quote = {
            "quote_id": quote.id,
            "mounting_type_id": isNaN(typeId) ? null : typeId,
            "mounting_size": isNaN(size) ? null : size,
            "imageUrl": imageBase64.includes('unknown.jpg') ? null : imageBase64,
            "diamond_list": diamondList,
            "metal_list": metalList,
            "production_price": productionPrice,
            "profit_rate": profitRate,
            "note": note.trim(),
            "total_price": totalPrice,

        }
        console.log('priced_quote', priced_quote)
        const formData = new FormData();
        formData.append('priced_quote', JSON.stringify(priced_quote));


        let response = await pricing_quote(formData, 'Quote ID ' + quote.id);

        if (response.success) {
            navigate('/quotes_sale_staff/table')
        }
        dispatch(setToast(response.mess))
        // set toast
        //dispatch(setToast({ color: "success", title: 'Quote [ID: #' + quote.id + ']', mess: "Pricing successfully !" }))


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
                                <strong>PRICING FOR QUOTE ID [ #{quote.id} ]</strong> <small><CurrencyCircleDollar size={30} color="lime" weight="duotone" /></small>
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
                                            <QuoteDetailCard quote={quote} />
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
                                    <CCol xs={12} md={6} lg={6}>

                                        <OtherCard handleChange={handleOther} mountingType={mountingType} quote={quote} product={product} />

                                    </CCol>
                                    <CCol xs={12} md={6} lg={6}>

                                        <PriceCard handleChange={handlePrice} quote={quote} product={product} />


                                    </CCol>
                                    <CCol xs={12} md={12} lg={12} >
                                        <span className="text-dark fw-bold fs-3">Total Price: {totalPrice} vnd</span>
                                    </CCol>
                                </CRow>
                                <div className="d-flex justify-content-center mt-5">
                                    <Button
                                        disabled={metalList.length === 0 || profitRate === 0 || productionPrice == null || productionPrice === 0 || isNaN(productionPrice)}
                                        onClick={() => handleReport()}
                                        color="success"
                                        variant="outlined"
                                        className="fw-bold d-flex align-items-center text-center">
                                        Request Pricing <CurrencyCircleDollar size={30} color="lime" weight="duotone" /></Button>
                                </div>

                            </CCardBody>
                        </CCard>
                    }

                </CCol>
            </CRow>
        </div>
    );

}
export default Quote_Detail;
