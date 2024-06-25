import React, { useContext, useEffect, useState, useRef } from "react";

import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CRow,
    CSpinner,
    CCard,
    CCardHeader,
    CCardBody,
    CPlaceholder
} from '@coreui/react'
import { get_account_list } from "../../../api/main/accounts/Account_api";
import AvatarUpload from "../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { setToast } from "../../../redux/notification/toastSlice";
import { FaUserCheck } from "react-icons/fa";
import DateTimePicker from "../../component_items/DatePicker/DateTimePicker";
import AccountCard from "../Quote widget/AccountCard";
import QuoteDetailCard from "../Quote widget/QuoteDetailCard";
import NoteCard from "../Quote widget/NoteCard";
import AssignCard from "../Quote widget/AssignCard";
import { useNavigate } from "react-router-dom";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import AvatarInput from "../../component_items/Avatar/Avatar";
import { get } from "jquery";
import MetalCard from "../../Sale_staff/Modal_body/model/widget/MetalCard";
import DiamondCard from "../../Sale_staff/Modal_body/model/widget/DiamondCard";
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
import QuoteProductImage from "../Quote widget/QuoteProductImage";
import { QuotePageContext } from "../Quote_Page";
import { QuotePriceContext } from "../Quote_Price";
import { approve_quote, get_quote_detail } from "../../../api/main/orders/Quote_api";



const sales_staff = {
    "id": 1,
    "username": "john_doe đần",
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "phone": "+1234567890",
    "dob": "1985-06-15",
    "email": "john.doe@example.com",
    "fullname": "John Doe",
    "role": {
        "id": 2,
        "name": "Sale Staff"
    },
    "address": "123 Main St, Springfield, IL",
    "order_count": 5,
    "order_history": [
        {
            "id": 101,
            "product_id": 201,
            "account_id": 1,
            "deposit_has_paid": 150.00,
            "product_price": 1000.00,
            "profit_rate": 0.15,
            "production_price": 850.00,
            "total_price": 1150.00,
            "order_type": {
                "id": 1,
                "name": "Custom"
            },
            "order_status": {
                "id": 1,
                "name": "Completed"
            },
            "note": "Delivered on time",
            "saleStaff_id": 301,
            "designStaff_id": 302,
            "productionStaff_id": 303,
            "created": "2023-01-10T10:00:00.000Z"
        },
        {
            "id": 102,
            "product_id": 202,
            "account_id": 1,
            "deposit_has_paid": 200.00,
            "product_price": 1200.00,
            "profit_rate": 0.20,
            "production_price": 960.00,
            "total_price": 1400.00,
            "order_type": {
                "id": 2,
                "name": "Standard"
            },
            "order_status": {
                "id": 2,
                "name": "Pending"
            },
            "note": "Awaiting payment",
            "saleStaff_id": 304,
            "designStaff_id": 305,
            "productionStaff_id": 306,
            "created": "2023-03-15T12:00:00.000Z"
        }
    ]
}
const design_staff = {
    "id": 2,
    "username": "jane_smith ngu",
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "phone": "+0987654321",
    "dob": "1990-09-25",
    "email": "jane.smith@example.com",
    "fullname": "Jane Smith",
    "role": {
        "id": 3,
        "name": "Design Staff"
    },
    "address": "456 Elm St, Shelbyville, IL",
    "order_count": 3,
    "order_history": [
        {
            "id": 103,
            "product_id": 203,
            "account_id": 2,
            "deposit_has_paid": 100.00,
            "product_price": 800.00,
            "profit_rate": 0.10,
            "production_price": 720.00,
            "total_price": 900.00,
            "order_type": {
                "id": 1,
                "name": "Custom"
            },
            "order_status": {
                "id": 3,
                "name": "In Progress"
            },
            "note": "Expected delivery in 2 weeks",
            "saleStaff_id": 307,
            "designStaff_id": 308,
            "productionStaff_id": 309,
            "created": "2023-05-20T14:30:00.000Z"
        }
    ]
}
const production_staff = {
    "id": 3,
    "username": "alice_johnson ngốc",
    "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    "phone": "+1122334455",
    "dob": "1982-12-05",
    "email": "alice.johnson@example.com",
    "fullname": "Alice Johnson",
    "role": {
        "id": 4,
        "name": "Production Staff"
    },
    "address": "789 Maple St, Capital City, IL",
    "order_count": 2,
    "order_history": [
        {
            "id": 104,
            "product_id": 204,
            "account_id": 3,
            "deposit_has_paid": 250.00,
            "product_price": 1500.00,
            "profit_rate": 0.25,
            "production_price": 1125.00,
            "total_price": 1750.00,
            "order_type": {
                "id": 2,
                "name": "Standard"
            },
            "order_status": {
                "id": 1,
                "name": "Completed"
            },
            "note": "Great quality",
            "saleStaff_id": 310,
            "designStaff_id": 311,
            "productionStaff_id": 312,
            "created": "2023-07-25T16:45:00.000Z"
        },
        {
            "id": 105,
            "product_id": 205,
            "account_id": 3,
            "deposit_has_paid": 300.00,
            "product_price": 2000.00,
            "profit_rate": 0.30,
            "production_price": 1400.00,
            "total_price": 2300.00,
            "order_type": {
                "id": 1,
                "name": "Custom"
            },
            "order_status": {
                "id": 2,
                "name": "Pending"
            },
            "note": "Awaiting design approval",
            "saleStaff_id": 313,
            "designStaff_id": 314,
            "productionStaff_id": 315,
            "created": "2023-09-10T09:15:00.000Z"
        }
    ]
}

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
            "model": null,
            "mounting_size": 6,
            "product_diamond": [
                {
                    "id": 1,
                    "product_id": 1,
                    "diamond": {
                        "id": 1,
                        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
                        "size": 1.0,
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
                            "name": "Excellent"
                        },
                        "price": 10000.00,
                        "deactivated": false,
                        "created": "2023-01-01T00:00:00.000Z"
                    },
                    "diamond_shape": {
                        "id": 1,
                        "name": "Round",
                        "drawing_path": "https://example.com/shapes/round.png"
                    },
                    "count": 1,
                    "price": 10000.00,
                    "isAccepted": true
                },
                {
                    "id": 2,
                    "product_id": 1,
                    "diamond": {
                        "id": 2,
                        "imageUrl": "http://localhost:8000/image/Diamond/E_VVS1.jpg",
                        "size": 0.5,
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
                            "name": "Very Good"
                        },
                        "price": 5000.00,
                        "deactivated": false,
                        "created": "2023-01-01"
                    },
                    "diamond_shape": {
                        "id": 2,
                        "name": "Princess",
                        "drawing_path": "http://localhost:8000/image/Metal/1/main.jpg",
                    },
                    "count": 2,
                    "price": 10000.00,
                    "isAccepted": true
                }
            ],
            "product_metal": [
                {
                    "product_id": 1,
                    "metal": {
                        "id": 1,
                        "name": "Gold",
                        "buy_price_per_gram": 50.00,
                        "sale_price_per_gram": 75.00,
                        "imageUrl": "http://localhost:8000/image/Metal/1/main.jpg",
                        "specific_weight": 19.32,
                        "deactivated": false,
                        "created": "2023-01-01T00:00:00.000Z"
                    },
                    "volume": 3.0,
                    "weight": 60.0,
                    "isAccepted": true,
                    "price": 4500.00
                },
                {
                    "product_id": 1,
                    "metal": {
                        "id": 2,
                        "name": "Platinum",
                        "buy_price_per_gram": 100.00,
                        "sale_price_per_gram": 150.00,
                        "imageUrl": "http://localhost:8000/image/Metal/2/main.jpg",
                        "specific_weight": 21.45,
                        "deactivated": false,
                        "created": "2023-01-01T00:00:00.000Z"
                    },
                    "volume": 2.0,
                    "weight": 50.0,
                    "isAccepted": true,
                    "price": 7500.00
                }
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
            "id": 1,
            "name": "Pending"
        },
        "order_type": {
            "id": 1,
            "name": "Custom"
        },
        "product_price": 20000.00,
        "production_price": 15000.00,
        "total_price": 250000000.00,
        "profit_rate": 0.25,
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


const CustomForm = ({ quoteInfo, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleDataChange } = useContext(QuotePriceContext);


    const [loading, setLoading] = useState(true);



    const [quote, setQuote] = useState(null)
    const [product, setProduct] = useState(null)


    const [saleStaff, setSaleStaff] = useState(null)
    const [designStaff, setDesignStaff] = useState(null)
    const [productionStaff, setProductionStaff] = useState(null)

    const [metalList, setMetalList] = useState([]);
    const [diamondList, setDiamondList] = useState([])
    const [note, setNote] = useState(null);

    useEffect(() => {
        const setAttribute = async () => {

            const formData = new FormData();
            formData.append('quote_id', quoteInfo.id);
            const detail_data = await get_quote_detail(formData);
            const quote_detail = detail_data.data.quote_detail;

            setQuote(quote_detail)
            setProduct(quote_detail.product)


            setSaleStaff(quote_detail.sale_staff);
            setDesignStaff(quote_detail.design_staff);
            setProductionStaff(quote_detail.production_staff);

            setMetalList(quote_detail.product.product_metal)
            setDiamondList(quote_detail.product.product_diamond)
            setNote(quote_detail.note)


            setLoading(false);
        }
        setAttribute()
    }, [])


    const handleNote = (new_note) => {
        setNote(new_note)
        console.log("new note", new_note)
    }

    const handleSubmit = async (approve) => {


        const approval = {
            quote_id: quote.id,
            approve: approve,
            note: note
        }
        console.log('approval', approval)
        const formData = new FormData();
        formData.append('approval', JSON.stringify(approval));

        await get_account_list();

        let response = await approve_quote(formData, 'Quote ID ' + quote.id);

        if (response.success) {
            handleDataChange();
            onClose();
        }
        dispatch(setToast(response.mess))
        



    }


    return (

        <CForm
            className="row g-3 needs-validation"
            onSubmit={handleSubmit}
        >
            {loading ? <CButton className="w-100" color="secondary" disabled>
                <CSpinner as="span" size="sm" aria-hidden="true" />
                Loading...
            </CButton> :
                <>



                    <CCol lg={6} className="d-flex flex-column">
                        <AccountCard account={quote.account} avatarSize={100} cardHeight={'120px'} />
                        <div className='flex-grow-1'>
                            <NoteCard minRows={8} maxRows={20} isLoading={loading} note={note} handleChange={handleNote} cardHeight={'100%'} />

                        </div>
                    </CCol>
                    <CCol lg={6}>
                        <div style={{ height: 'fit-content' }}>
                            <QuoteDetailCard quote={quote} />
                        </div>
                        <div className="mt-1" style={{ height: 'fit-content' }}  >

                            <CCard className="h-100">
                                <CCardHeader className="text-center text-light fw-bold" >
                                    ADDITIONAL INFORMATION
                                </CCardHeader>
                                <CCardBody className="d-flex flex-column justify-content-between">

                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center' >
                                            <span style={{ fontSize: '15px' }}>Mounting Type: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={product.mounting_type ? product.mounting_type.name : "No Specific Type"} />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <span style={{ fontSize: '15px' }}>Mounting Size: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={product.mounting_size} />
                                        </CCol>
                                    </CRow>


                                </CCardBody>
                            </CCard>

                        </div>
                        <div className="h-50 d-flex p-2 flex-column mt-1 rounded w-100"  >
                            <CCard className="" style={{ height: 'fit-content' }}>
                                <CCardHeader className="text-center text-light fw-bold" >
                                    PRODUCT IMAGE
                                </CCardHeader>
                                <CCardBody className="d-flex flex-column justify-content-between" >

                                    <QuoteProductImage defaultImage={product.imageUrl} disabled={true} />


                                </CCardBody>
                            </CCard>
                        </div>


                    </CCol>
                    <CCol md={12}>
                        <CRow>
                            <CCol md={4}>
                                <span ><b>Sale Staff: </b></span>

                                <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                    <ListItemDecorator className='px-2'>
                                        <AvatarInput size={30} src={saleStaff.imageUrl} />
                                    </ListItemDecorator>
                                    {saleStaff.fullname}
                                </CButton>

                            </CCol>
                            <CCol md={4}>
                                <span><b>Design Staff: </b></span>

                                <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                    <ListItemDecorator className='px-2'>
                                        <AvatarInput size={30} src={designStaff.imageUrl} />
                                    </ListItemDecorator>
                                    {designStaff.fullname}
                                </CButton>

                            </CCol>
                            <CCol md={4}>
                                <span><b>Production Staff: </b></span>

                                <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                    <ListItemDecorator className='px-2'>
                                        <AvatarInput size={30} src={productionStaff.imageUrl} />
                                    </ListItemDecorator>
                                    {productionStaff.fullname}
                                </CButton>

                            </CCol>
                        </CRow>
                    </CCol>
                    <CCol md={12}>
                        <div className="my-4">
                            <CCard className="bg-light metal-card" >
                                <CCardHeader>
                                    <span className="text-dark fw-bold fs-5 d-flex align-items-center">METAL</span>
                                </CCardHeader>
                                <CCardBody>
                                    <List className="rounded" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                        {metalList.length > 0 && metalList.map((item, index) => {
                                            return (
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <img width={'100%'} src={item.metal.imageUrl} alt="metal" />

                                                        </Avatar>
                                                    </ListItemAvatar>


                                                    <ListItemText className="text-dark w-25" primary='Type' secondary={item.metal.name} />
                                                    <ListItemText className="text-dark w-25" primary='Volume' secondary={item.volume} />
                                                    <ListItemText className="text-dark w-25" primary='Weight' secondary={item.weight} />
                                                    <ListItemText className="text-dark w-25" primary='Caculated Price' secondary={item.price + ' vnd'} />

                                                </ListItem>
                                            )
                                        })}
                                    </List>
                                    <CRow className="w-100 text-end d-flex justify-content-end">
                                        <CCol xl={2} className="p-0 m-0 d-flex  align-items-center text-end">
                                            <span className="text-danger fw-bold fs-5">Metal Sum: </span>
                                        </CCol>
                                        <CCol xl={2} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">{metalList.reduce((total, item) => total + item.price, 0)} vnd</span>

                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </div>
                        <div className="my-4">
                            <CCard className="bg-light metal-card" >
                                <CCardHeader   >

                                    <span className="text-dark fw-bold fs-5 d-flex align-items-center">Diamond</span>

                                </CCardHeader>
                                <CCardBody>
                                    <List className="rounded" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                        {diamondList.length > 0 && diamondList.map((item, index) => {
                                            return (
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <img width={'100%'} src={item.diamond.imageUrl} alt="metal" />

                                                        </Avatar>

                                                    </ListItemAvatar>
                                                    <ListItemText className="text-dark w-25" primary='Shape' secondary={item.diamond_shape.name} />
                                                    <ListItemText className="text-dark w-25" primary='Size' secondary={item.diamond.size} />
                                                    <ListItemText className="text-dark w-25" primary='Origin' secondary={item.diamond.diamond_origin.name} />
                                                    <ListItemText className="text-dark w-25" primary='Color' secondary={item.diamond.diamond_color.name} />
                                                    <ListItemText className="text-dark w-25" primary='Clarity' secondary={item.diamond.diamond_clarity.name} />
                                                    <ListItemText className="text-dark w-25" primary='Cut' secondary={item.diamond.diamond_cut.name} />
                                                    <ListItemText className="text-dark w-25" primary='Count' secondary={item.count} />
                                                    <ListItemText className="text-dark w-25" primary='Total Price' secondary={item.price + ' vnd'} />
                                                    {diamondList.length == 0 &&
                                                        <IconButton onClick={() => handleRemove(index)} aria-label="delete" size="large" color="error">
                                                            <XCircle size={30} color="crimson" weight="duotone" />
                                                        </IconButton>
                                                    }
                                                </ListItem>
                                            )
                                        })}
                                    </List>
                                    <CRow className="w-100  text-end d-flex justify-content-end">
                                        <CCol xl={2} className="p-0 m-0 d-flex  align-items-center">
                                            <span className="text-danger fw-bold fs-5">Diamond Sum: </span>
                                        </CCol>
                                        <CCol xl={2} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">{diamondList.reduce((total, item) => total + item.price, 0)} vnd</span>

                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </div>
                    </CCol>
                    <CCol md={12}>

                        <div className="my-0">
                            <CCard className="bg-light metal-card" >
                                <CCardHeader   >

                                    <span className="text-dark fw-bold fs-5 d-flex align-items-center">Quote Summary</span>

                                </CCardHeader>
                                <CCardBody className="d-flex flex-column justify-content-center">
                                    <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center">
                                            <span className="text-dark fw-bold fs-5 ">Product Price: </span>
                                        </CCol>
                                        <CCol lg={3} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">{diamondList.reduce((total, item) => total + item.price, 0)}000000 vnd</span>

                                        </CCol>
                                    </CRow>
                                    <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center">
                                            <span className="text-dark fw-bold fs-5">Profit Price: </span>
                                        </CCol>
                                        <CCol lg={3} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">{quote.product_price * (quote.profit_rate / 100)} vnd ({quote.profit_rate}%)</span>

                                        </CCol>
                                    </CRow>
                                    <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center ">
                                            <span className="text-dark fw-bold fs-5 ">Production Price: </span>
                                        </CCol>
                                        <CCol lg={3} className=" p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">{quote.production_price} vnd</span>

                                        </CCol>
                                    </CRow>

                                    <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center">
                                            <span className="text-danger fw-bold fs-4">Total: </span>
                                        </CCol>
                                        <CCol lg={3} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">{quote.total_price} vnd</span>

                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </div>
                    </CCol>
                    <CCol xs={12} className="d-flex justify-content-center align-items-center">
                        <CButton className="mx-2" color="danger" onClick={() => handleSubmit(false)}  >
                            Decline
                        </CButton>
                        |
                        <CButton className="mx-2" color="success" onClick={(e) => handleSubmit(true)}  >
                            Approve
                        </CButton>

                    </CCol>
                </>}
        </CForm>
    )
}

const QuoteApprove = ({ quote, onClose }) => {
    return (
        <CustomForm quoteInfo={quote} onClose={onClose} />
    );
};

export default QuoteApprove;
