import React, { useContext, useEffect, useState, useRef, createContext } from "react";

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
    CPlaceholder,
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody,
    CPopover
} from '@coreui/react'
import { get_account_list } from "../../../api/accounts/Account_Api";
import AvatarUpload from "../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { setToast } from "../../../redux/notification/toastSlice";
import { FaUserCheck } from "react-icons/fa";
import DateTimePicker from "../../component_items/DatePicker/DateTimePicker";
import QuoteDetailCard from "./QuoteDetailCard";

import { useNavigate } from "react-router-dom";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import AvatarInput from "../../component_items/Avatar/Avatar";
import { get } from "jquery";
import MetalCard from "../Modal_body/model/widget/MetalCard";
import DiamondCard from "../Modal_body/model/widget/DiamondCard";
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize, Typography } from "@mui/material";
import AssignCard from "../../Manager/Quote widget/AssignCard";
import QuoteProductImage from "../../Manager/Quote widget/QuoteProductImage";
import AccountCard from "../../Manager/Quote widget/AccountCard";
import NoteCard from "../../Manager/Quote widget/NoteCard";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Modal_Button from "../../component_items/Modal/ModalButton";
import ProductionStatusChange from "../Modal_body/ProductionStatusChange";
import UploadSingle from "./UploadSingle";
import { ArrowCircleDown } from "phosphor-react";
import ProductionComplete from "../Modal_body/ProductionComplete";

const production_status_data = [
    {
        "id": 1,
        "order_id": 101,
        "production_status": {
            "id": 1,
            "name": "Unrealized"
        },
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "created": "2024-01-01"
    },
    {
        "id": 2,
        "order_id": 102,
        "production_status": {
            "id": 2,
            "name": "Casting"
        },
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "created": "2024-01-02"
    },
    {
        "id": 3,
        "order_id": 103,
        "production_status": {
            "id": 3,
            "name": "Assembly"
        },
        "imageUrl": null,
        "created": "2024-01-03"
    },
    {
        "id": 4,
        "order_id": 104,
        "production_status": {
            "id": 4,
            "name": "Stone Setting"
        },
        "imageUrl": null,
        "created": "2024-01-04"
    },
    {
        "id": 5,
        "order_id": 105,
        "production_status": {
            "id": 5,
            "name": "Polishing"
        },
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "created": "2024-01-05"
    },
    {
        "id": 6,
        "order_id": 106,
        "production_status": {
            "id": 2,
            "name": "Casting"
        },
        "imageUrl": null,
        "created": "2024-01-06"
    },
    {
        "id": 7,
        "order_id": 107,
        "production_status": {
            "id": 3,
            "name": "Assembly"
        },
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "created": "2024-01-07"
    },
    {
        "id": 8,
        "order_id": 108,
        "production_status": {
            "id": 1,
            "name": "Unrealized"
        },
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "created": "2024-01-08"
    },
    {
        "id": 9,
        "order_id": 109,
        "production_status": {
            "id": 5,
            "name": "Polishing"
        },
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "created": "2024-01-09"
    },
    {
        "id": 10,
        "order_id": 110,
        "production_status": {
            id: 6,
            name: 'Polishing'
        },
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "created": "2024-01-10"
    }
]


const order_detail_data = {
    "order_detail": {
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
        "order_status": {
            "id": 4,
            "name": "Manufacturing"
        },
        "order_type": {
            "id": 2,
            "name": "Custom"
        },
        "deposit_has_paid": 1000.00,
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

export const ProductionStatusContext = createContext();

const CustomForm = ({ orderInfo, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [order, setOrder] = useState(null)
    const [product, setProduct] = useState(null)

    const [productionProcessList, setProductionProcessList] = useState([])
    const [currentProductionProcess, setCurrentProductionProcess] = useState(null)

    const [saleStaff, setSaleStaff] = useState(null)
    const [designStaff, setDesignStaff] = useState(null)
    const [productionStaff, setProductionStaff] = useState(null)

    const [metalList, setMetalList] = useState([]);
    const [diamondList, setDiamondList] = useState([])
    const [note, setNote] = useState(null);

    useEffect(() => {
        const setAttribute = async () => {

            await get_account_list();
            //console.log("order", orderInfo)
            // gọi api lấy order detail từ orderInfo.id 
            const order_detail = order_detail_data.order_detail
            setOrder(order_detail)
            setProduct(order_detail.product)
            console.log('order_detail.product', order_detail.product)

            setSaleStaff(order_detail.sale_staff);
            setDesignStaff(order_detail.design_staff);
            setProductionStaff(order_detail.production_staff);

            setMetalList(order_detail.product.product_metal)
            setDiamondList(order_detail.product.product_diamond)
            setNote(order_detail.note)

            setProductionProcessList(production_status_data)
            setCurrentProductionProcess(production_status_data[production_status_data.length - 1])

            setLoading(false);
        }
        setAttribute()
    }, [])


    const handleNote = (new_note) => {
        setNote(new_note)
        console.log("new note", new_note)
    }

    const handleProductionStatus = (status_id, imageBase64) => {
        setLoading(true);
        const updateProductinStatus = async () => {
            await get_account_list();


            alert("ON DATA CHANGE TRONG MODAL NÈ")
            setLoading(false);
        }
        updateProductinStatus()
    }
    // const handleProductionComplete = () => {
    //     setLoading(true);
    //     const updateProductinStatus = async () => {
    //         await get_account_list();


    //         alert("ON DATA CHANGE TRONG MODAL NÈ")
    //         setLoading(false);
    //     }
    //     updateProductinStatus()
    // }

    return (
        <ProductionStatusContext.Provider value={{ order: order, handleDataChange: handleProductionStatus }}>
            <CForm
                className="row g-3 needs-validation"

            >
                {loading ? <CButton className="w-100" color="secondary" disabled>
                    <CSpinner as="span" size="sm" aria-hidden="true" />
                    Loading...
                </CButton> :
                    <>

                        <CCol lg={6} className="d-flex flex-column">
                            <AccountCard account={order.account} avatarSize={100} cardHeight={'120px'} />
                            <div className='flex-grow-1'>
                                <NoteCard disabled={true} minRows={8} maxRows={20} isLoading={loading} note={note} handleChange={handleNote} cardHeight={'100%'} />

                            </div>
                        </CCol>
                        <CCol lg={6}>
                            <div style={{ height: 'fit-content' }}>
                                <QuoteDetailCard quote={order} title={'INFORMATION OF ORDER'} />
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
                                                <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={product.mounting_type.name} />
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

                            <CRow className="d-flex justify-content-center">
                                {order.order_type.id == 2 &&
                                    <>
                                        <CCol md={4}>
                                            <span ><b>Sale Staff: </b></span>
                                            <CPopover
                                                title="Contact Info"
                                                content={
                                                    <>
                                                        <div>Phone Number: {saleStaff.phone}</div>
                                                        <div>Email: {saleStaff.email}</div>
                                                    </>
                                                }
                                                placement="right"
                                                trigger={"hover"}
                                            >
                                                <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                                    <ListItemDecorator className='px-2'>
                                                        <AvatarInput size={30} src={saleStaff.imageUrl} />
                                                    </ListItemDecorator>
                                                    {saleStaff.fullname}
                                                </CButton>
                                            </CPopover>


                                        </CCol>
                                        <CCol md={4}>
                                            <span><b>Design Staff: </b></span>
                                            <CPopover
                                                title="Contact Info"
                                                content={
                                                    <>
                                                        <div>Phone Number: {designStaff.phone}</div>
                                                        <div>Email: {designStaff.email}</div>
                                                    </>
                                                }
                                                placement="right"
                                                trigger={"hover"}
                                            >
                                                <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                                    <ListItemDecorator className='px-2'>
                                                        <AvatarInput size={30} src={designStaff.imageUrl} />
                                                    </ListItemDecorator>
                                                    {designStaff.fullname}
                                                </CButton>
                                            </CPopover>
                                        </CCol>
                                    </>
                                }

                                <CCol md={4}>
                                    <span><b>Production Staff: </b></span>
                                    <CPopover
                                        title="Contact Info"
                                        content={
                                            <>
                                                <div>Phone Number: {productionStaff.phone}</div>
                                                <div>Email: {productionStaff.email}</div>
                                            </>
                                        }
                                        placement="right"
                                        trigger={"hover"}
                                    >
                                        <CButton color="light w-100 d-flex align-items-center justify-content-start" >
                                            <ListItemDecorator className='px-2'>
                                                <AvatarInput size={30} src={productionStaff.imageUrl} />
                                            </ListItemDecorator>
                                            {productionStaff.fullname}
                                        </CButton>
                                    </CPopover>


                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md={12}>

                            <div className="my-1">
                                <CAccordion >
                                    <CAccordionItem>
                                        <CAccordionHeader>METAL LIST</CAccordionHeader>
                                        <CAccordionBody>
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
                                        </CAccordionBody>
                                    </CAccordionItem>
                                </CAccordion>

                            </div>
                            <div className="my-1">
                                <CAccordion >
                                    <CAccordionItem>
                                        <CAccordionHeader>DIAMOND LIST</CAccordionHeader>
                                        <CAccordionBody>
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
                                        </CAccordionBody>
                                    </CAccordionItem>
                                </CAccordion>

                            </div>
                            <div className="my-1">
                                <CAccordion activeItemKey={1}>
                                    <CAccordionItem itemKey={1}>
                                        <CAccordionHeader>PRODUCTION PROCESS</CAccordionHeader>
                                        <CAccordionBody>
                                            <Timeline position="right">
                                                {productionProcessList.map((item, index) => {
                                                    console.log("listingnownfownefo", item)
                                                    return <TimelineItem>
                                                        <TimelineOppositeContent
                                                            sx={{ m: 'auto 0' }}
                                                            align="right"
                                                            variant="body2"
                                                            color="textSuccess"
                                                        >
                                                            {item.created}
                                                        </TimelineOppositeContent>
                                                        <TimelineSeparator>
                                                            <TimelineConnector sx={{ bgcolor: 'success.main' }} />
                                                            <TimelineDot color="secondary" variant="outlined">
                                                                <ArrowCircleDown size={20} weight="duotone" color="aqua " />
                                                            </TimelineDot>
                                                            <TimelineConnector sx={{ bgcolor: 'success.main' }} />
                                                        </TimelineSeparator>
                                                        <TimelineContent sx={{ py: '12px', px: 2 }}>
                                                            <div className="p-1 rounded-1 border border-3 border-secondary d-flex align-items-center justify-content-between">
                                                                <Typography variant="h6" component="span">
                                                                    {item.production_status.name}
                                                                </Typography>
                                                                <span className="w-25">
                                                                    {
                                                                        item.imageUrl &&
                                                                        <Typography>
                                                                            <Modal_Button
                                                                                size={'lg'}
                                                                                title={"Production Process Image"}
                                                                                content={
                                                                                    <Button size="small">View Image</Button>
                                                                                }
                                                                                color={"light"} >
                                                                                <UploadSingle defaultImage={item.imageUrl} disabled={true} />
                                                                            </Modal_Button>
                                                                        </Typography>
                                                                    }
                                                                </span>

                                                            </div>



                                                        </TimelineContent>
                                                    </TimelineItem>

                                                })}
                                                {/* <TimelineItem>
                                                    <TimelineOppositeContent
                                                        sx={{ m: 'auto 0' }}
                                                        align="right"
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        9:30 am
                                                    </TimelineOppositeContent>
                                                    <TimelineSeparator>
                                                        <TimelineConnector />
                                                        <TimelineDot>
                                                           
                                                        </TimelineDot>
                                                        <TimelineConnector />
                                                    </TimelineSeparator>
                                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                                        <Typography variant="h6" component="span">
                                                            Eat
                                                        </Typography>
                                                        <Typography>Because you need strength</Typography>
                                                    </TimelineContent>
                                                </TimelineItem>
                                                <TimelineItem>
                                                    <TimelineOppositeContent
                                                        sx={{ m: 'auto 0' }}
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        10:00 am
                                                    </TimelineOppositeContent>
                                                    <TimelineSeparator>
                                                        <TimelineConnector />
                                                        <TimelineDot color="primary">
                                                            
                                                        </TimelineDot>
                                                        <TimelineConnector />
                                                    </TimelineSeparator>
                                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                                        <Typography variant="h6" component="span">
                                                            Code
                                                        </Typography>
                                                        <Typography>Because it&apos;s awesome!</Typography>
                                                    </TimelineContent>
                                                </TimelineItem>
                                                <TimelineItem>
                                                    <TimelineSeparator>
                                                        <TimelineConnector />
                                                        <TimelineDot color="primary" variant="outlined">
                                                            
                                                        </TimelineDot>
                                                        <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                                                    </TimelineSeparator>
                                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                                        <Typography variant="h6" component="span">
                                                            Sleep
                                                        </Typography>
                                                        <Typography>Because you need rest</Typography>
                                                    </TimelineContent>
                                                </TimelineItem>
                                                <TimelineItem>
                                                    <TimelineSeparator>
                                                        <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                                                        <TimelineDot color="secondary">
                                                            
                                                        </TimelineDot>
                                                        <TimelineConnector />
                                                    </TimelineSeparator>
                                                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                                                        <Typography variant="h6" component="span">
                                                            Repeat
                                                        </Typography>
                                                        <Typography>Because this is the life you love!</Typography>
                                                    </TimelineContent>
                                                </TimelineItem> */}
                                            </Timeline>
                                        </CAccordionBody>
                                    </CAccordionItem>
                                </CAccordion>

                            </div>
                        </CCol>
                        <CCol xs={12} className="d-flex justify-content-center align-items-center">
                            <div style={{ width: 'fit-content' }}>
                                {order.order_status.id == 3 && currentProductionProcess.production_status.id != 6 &&

                                    <Modal_Button
                                        size={'lg'}
                                        title={"Set Production Status"}
                                        content={
                                            <CButton color="success w-100" >
                                                Update Production Status
                                            </CButton>
                                        }
                                        color={"light"} >
                                        <ProductionStatusChange currentProductionStatus={currentProductionProcess.production_status} />
                                    </Modal_Button>
                                }
                                {order.order_status.id == 3 && currentProductionProcess.production_status.id == 6 &&
                                    <Modal_Button
                                        size={'lg'}
                                        title={"Production Completion Confirmation"}
                                        content={
                                            <CButton color="success w-100" >
                                                Confirm To Finish
                                            </CButton>
                                        }
                                        color={"light"} >
                                        <ProductionComplete currentProductionProcess={currentProductionProcess} />
                                    </Modal_Button>
                                }

                            </div>
                        </CCol>
                    </>}
            </CForm>
        </ProductionStatusContext.Provider>

    )
}

const OrderDetail = ({ order, onClose }) => {
    return (
        <CustomForm orderInfo={order} onClose={onClose} />
    );
};

export default OrderDetail;
