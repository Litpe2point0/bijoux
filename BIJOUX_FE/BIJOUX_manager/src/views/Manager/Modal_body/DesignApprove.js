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
    CPlaceholder,
    CPopover,
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody
} from '@coreui/react'
import { get_account_list } from "../../../api/accounts/Account_Api";
import AvatarUpload from "../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { clearToast, setToast } from "../../../redux/notification/toastSlice";
import { Staff_Page_Context } from "../Staff_Page";
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
import MetalCard from "../../Sale_staff/Quote widget/MetalCard";
import DiamondCard from "../../Sale_staff/Quote widget/DiamondCard";
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize } from "@mui/material";
import QuoteProductImage from "../Quote widget/QuoteProductImage";
import { ArrowFatLinesRight, CaretDoubleRight } from "phosphor-react";



// const sales_staff = {
//     "id": 1,
//     "username": "john_doe đần",
//     "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
//     "phone": "+1234567890",
//     "dob": "1985-06-15",
//     "email": "john.doe@example.com",
//     "fullname": "John Doe",
//     "role": {
//         "id": 2,
//         "name": "Sale Staff"
//     },
//     "address": "123 Main St, Springfield, IL",
//     "order_count": 5,

// }
// const design_staff = {
//     "id": 2,
//     "username": "jane_smith ngu",
//     "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
//     "phone": "+0987654321",
//     "dob": "1990-09-25",
//     "email": "jane.smith@example.com",
//     "fullname": "Jane Smith",
//     "role": {
//         "id": 3,
//         "name": "Design Staff"
//     },
//     "address": "456 Elm St, Shelbyville, IL",
//     "order_count": 3,
//     "order_history": [
//         {
//             "id": 103,
//             "product_id": 203,
//             "account_id": 2,
//             "deposit_has_paid": 100.00,
//             "product_price": 800.00,
//             "profit_rate": 0.10,
//             "production_price": 720.00,
//             "total_price": 900.00,
//             "order_type": {
//                 "id": 1,
//                 "name": "Custom"
//             },
//             "order_status": {
//                 "id": 3,
//                 "name": "In Progress"
//             },
//             "note": "Expected delivery in 2 weeks",
//             "saleStaff_id": 307,
//             "designStaff_id": 308,
//             "productionStaff_id": 309,
//             "created": "2023-05-20T14:30:00.000Z"
//         }
//     ]
// }
// const production_staff = {
//     "id": 3,
//     "username": "alice_johnson ngốc",
//     "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
//     "phone": "+1122334455",
//     "dob": "1982-12-05",
//     "email": "alice.johnson@example.com",
//     "fullname": "Alice Johnson",
//     "role": {
//         "id": 4,
//         "name": "Production Staff"
//     },
//     "address": "789 Maple St, Capital City, IL",
//     "order_count": 2,
//     "order_history": [
//         {
//             "id": 104,
//             "product_id": 204,
//             "account_id": 3,
//             "deposit_has_paid": 250.00,
//             "product_price": 1500.00,
//             "profit_rate": 0.25,
//             "production_price": 1125.00,
//             "total_price": 1750.00,
//             "order_type": {
//                 "id": 2,
//                 "name": "Standard"
//             },
//             "order_status": {
//                 "id": 1,
//                 "name": "Completed"
//             },
//             "note": "Great quality",
//             "saleStaff_id": 310,
//             "designStaff_id": 311,
//             "productionStaff_id": 312,
//             "created": "2023-07-25T16:45:00.000Z"
//         },
//         {
//             "id": 105,
//             "product_id": 205,
//             "account_id": 3,
//             "deposit_has_paid": 300.00,
//             "product_price": 2000.00,
//             "profit_rate": 0.30,
//             "production_price": 1400.00,
//             "total_price": 2300.00,
//             "order_type": {
//                 "id": 1,
//                 "name": "Custom"
//             },
//             "order_status": {
//                 "id": 2,
//                 "name": "Pending"
//             },
//             "note": "Awaiting design approval",
//             "saleStaff_id": 313,
//             "designStaff_id": 314,
//             "productionStaff_id": 315,
//             "created": "2023-09-10T09:15:00.000Z"
//         }
//     ]
// }

const design_process_detail_data = {
    // "design_process": {
    //     "id": 1,
    //     "order": {
    //         "id": 1,
    //         "product": {
    //             "id": 1,
    //             "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
    //             "mounting_type": {
    //                 "id": 1,
    //                 "name": "ring"
    //             },
    //             "model_id": null,
    //             "mounting_size": 6,
    //             "product_diamond": [
    //                 {
    //                     "id": 1,
    //                     "product_id": 1,
    //                     "diamond": {
    //                         "id": 1,
    //                         "imageUrl": "http://localhost:8000/image/Diamond/D_VS1.jpg",
    //                         "size": 1.0,
    //                         "diamond_color": {
    //                             "id": 1,
    //                             "name": "D"
    //                         },
    //                         "diamond_origin": {
    //                             "id": 1,
    //                             "name": "Natural"
    //                         },
    //                         "diamond_clarity": {
    //                             "id": 1,
    //                             "name": "IF"
    //                         },
    //                         "diamond_cut": {
    //                             "id": 1,
    //                             "name": "Excellent"
    //                         },
    //                         "price": 10000.00,
    //                         "deactivated": 0,
    //                         "created": "2023-01-01"
    //                     },
    //                     "diamond_shape": {
    //                         "id": 1,
    //                         "name": "Round",
    //                         "drawing_path": "http://localhost:8000/image/Diamond/J_VVS2.jpg",
    //                     },
    //                     "count": 1,
    //                     "price": 10000.00,
    //                     "status": 1
    //                 },
    //                 {
    //                     "id": 2,
    //                     "product_id": 1,
    //                     "diamond": {
    //                         "id": 2,
    //                         "imageUrl": "http://localhost:8000/image/Diamond/J_VVS1.jpg",
    //                         "size": 0.5,
    //                         "diamond_color": {
    //                             "id": 2,
    //                             "name": "E"
    //                         },
    //                         "diamond_origin": {
    //                             "id": 1,
    //                             "name": "Natural"
    //                         },
    //                         "diamond_clarity": {
    //                             "id": 2,
    //                             "name": "VVS1"
    //                         },
    //                         "diamond_cut": {
    //                             "id": 2,
    //                             "name": "Very Good"
    //                         },
    //                         "price": 5000.00,
    //                         "deactivated": 0,
    //                         "created": "2023-01-01"
    //                     },
    //                     "diamond_shape": {
    //                         "id": 2,
    //                         "name": "Princess",
    //                         "drawing_path": "https://example.com/shapes/princess.png"
    //                     },
    //                     "count": 2,
    //                     "price": 10000.00,
    //                     "status": true
    //                 }
    //             ],
    //             "product_metal": [
    //                 {
    //                     "product_id": 1,
    //                     "metal": {
    //                         "id": 1,
    //                         "name": "Gold",
    //                         "buy_price_per_gram": 50.00,
    //                         "sale_price_per_gram": 75.00,
    //                         "imageUrl": "http://localhost:8000/image/Metal/1/main.jpg",
    //                         "specific_weight": 19.32,
    //                         "deactivated": 0,
    //                         "created": "2023-01-01T00:00:00.000Z"
    //                     },
    //                     "volume": 3.0,
    //                     "weight": 60.0,
    //                     "status": 1,
    //                     "price": 4500.00
    //                 },
    //                 {
    //                     "product_id": 1,
    //                     "metal": {
    //                         "id": 2,
    //                         "name": "Platinum",
    //                         "buy_price_per_gram": 100.00,
    //                         "sale_price_per_gram": 150.00,
    //                         "imageUrl": "http://localhost:8000/image/Metal/2/main.jpg",
    //                         "specific_weight": 21.45,
    //                         "deactivated": 0,
    //                         "created": "2023-01-01T00:00:00.000Z"
    //                     },
    //                     "volume": 2.0,
    //                     "weight": 50.0,
    //                     "status": 1,
    //                     "price": 7500.00
    //                 }
    //             ]
    //         },
    //         "account": {
    //             "id": 1,
    //             "username": "john_doe",
    //             "password": "hashed_password",
    //             "imageUrl": "http://localhost:8000/image/Account/1/main.jpg",
    //             "dob": "1985-06-15",
    //             "email": "john.doe@example.com",
    //             "fullname": "John Doe",
    //             "role": {
    //                 "id": 1,
    //                 "name": "Customer"
    //             },
    //             "phone": "+1234567890",
    //             "address": "123 Main St, Springfield, IL"
    //         },
    //         "order_status": {
    //             "id": 1,
    //             "name": "Pending"
    //         },
    //         "order_type": {
    //             "id": 1,
    //             "name": "Custom"
    //         },
    //         "product_price": 20000.00,
    //         "production_price": 15000.00,
    //         "profit_rate": 0.25,
    //         "sale_staff": {
    //             "id": 2,
    //             "username": "sales_jane",
    //             "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
    //             "dob": "1990-07-20",
    //             "email": "jane.sales@example.com",
    //             "fullname": "Jane Sales",
    //             "role": {
    //                 "id": 2,
    //                 "name": "Sales"
    //             },
    //             "phone": "+1230987654",
    //             "address": "456 Elm St, Shelbyville, IL",
    //             "order_count": 100,
    //             "deactivated": 0,
    //             "deactivated_date": null
    //         },
    //         "design_staff": {
    //             "id": 3,
    //             "username": "design_bob",
    //             "imageUrl": "http://localhost:8000/image/Account/3/main.jpg",
    //             "dob": "1988-05-22",
    //             "email": "bob.design@example.com",
    //             "fullname": "Bob Designer",
    //             "role": {
    //                 "id": 3,
    //                 "name": "Designer"
    //             },
    //             "phone": "+3216549870",
    //             "address": "789 Maple St, Capital City, IL",
    //             "order_count": 150,
    //             "deactivated": 0,
    //             "deactivated_date": null
    //         },
    //         "production_staff": {
    //             "id": 4,
    //             "username": "prod_alice",
    //             "imageUrl": "http://localhost:8000/image/Account/4/main.jpg",
    //             "dob": "1992-11-30",
    //             "email": "alice.prod@example.com",
    //             "fullname": "Alice Producer",
    //             "role": {
    //                 "id": 4,
    //                 "name": "Production"
    //             },
    //             "phone": "+3214560987",
    //             "address": "321 Oak St, Ogdenville, IL",
    //             "order_count": 200,
    //             "deactivated": 0,
    //             "deactivated_date": null
    //         },
    //         "note": "This is a special custom order.",
    //         "created": "2024-05-20T08:30:00.000Z"
    //     },
    //     "imageUrl": "http://localhost:8000/image/Metal/2/main.jpg",
    //     "note": "Initial design phase",
    //     "mounting_type": {
    //         "id": 1,
    //         "name": "Ring"
    //     },
    //     "mounting_size": 6,
    //     "product_price": 40000.00,
    //     'profit_rate': 0.25,
    //     "production_price": 15000.00,

    //     "design_process_status": {
    //         "id": 1,
    //         "name": "In Progress"
    //     }
    // }
    "design_process": {
        "id": 1,
        "order": {
            "id": 1,
            "product": {
                "id": 1,
                "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
                "mounting_type": {
                    "id": 1,
                    "name": "Ring"
                },
                "model_id": null,
                "mounting_size": 6,
                "product_diamond": [
                    {
                        "id": 1,
                        "product_id": 1,
                        "diamond": {
                            "id": 1,
                            "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
                            "size": "1.0",
                            "diamond_color": {
                                "id": 1,
                                "name": "D"
                            },
                            "diamond_origin": {
                                "id": 1,
                                "name": "South Africa"
                            },
                            "diamond_clarity": {
                                "id": 1,
                                "name": "IF"
                            },
                            "diamond_cut": {
                                "id": 1,
                                "name": "Round"
                            },
                            "price": 5000.00,
                            "deactivated": 0,
                            "created": "2024-05-20"
                        },
                        "diamond_shape": {
                            "id": 1,
                            "name": "Round",
                            "drawing_path": "http://localhost:8000/image/Diamond/D_IF.jpg",
                        },
                        "count": 1,
                        "price": 5000.00,
                        "status": 1
                    },
                    {
                        "id": 2,
                        "product_id": 1,
                        "diamond": {
                            "id": 2,
                            "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
                            "size": "0.5",
                            "diamond_color": {
                                "id": 2,
                                "name": "E"
                            },
                            "diamond_origin": {
                                "id": 2,
                                "name": "Botswana"
                            },
                            "diamond_clarity": {
                                "id": 2,
                                "name": "VVS1"
                            },
                            "diamond_cut": {
                                "id": 2,
                                "name": "Princess"
                            },
                            "price": 2500.00,
                            "deactivated": 0,
                            "created": "2024-05-21"
                        },
                        "diamond_shape": {
                            "id": 2,
                            "name": "Princess",
                            "drawing_path": "https://example.com/shapes/princess.svg"
                        },
                        "count": 2,
                        "price": 5000.00,
                        "status": 0
                    }
                ],
                "product_metal": [
                    {
                        "product_id": 1,
                        "metal": {
                            "id": 1,
                            "name": "Gold",
                            "buy_price_per_gram": 50.00,
                            "sale_price_per_gram": 60.00,
                            "imageUrl": "http://localhost:8000/image/Metal/1/main.jpg",
                            "specific_weight": 19.32,
                            "deactivated": 0,
                            "created": "2024-05-20"
                        },
                        "volume": 10.0,
                        "weight": 5.0,
                        "status": 0,
                        "price": 300.00
                    },
                    {
                        "product_id": 1,
                        "metal": {
                            "id": 2,
                            "name": "Platinum",
                            "buy_price_per_gram": 70.00,
                            "sale_price_per_gram": 80.00,
                            "imageUrl": "http://localhost:8000/image/Metal/2/main.jpg",
                            "specific_weight": 21.45,
                            "deactivated": 0,
                            "created": "2024-05-21T09:00:00.000Z"
                        },
                        "volume": 8.0,
                        "weight": 4.0,
                        "status": 1,
                        "price": 320.00
                    }
                ]
            },
            "account": {
                "id": 1,
                "username": "user1",
                "password": "hashed_password",
                "imageUrl": "http://localhost:8000/image/Account/1/main.jpg",
                "dob": "1990-01-01",
                "email": "user1@example.com",
                "fullname": "John Doe",
                "role": {
                    "id": 1,
                    "name": "Customer"
                },
                "phone": "1234567890",
                "address": "123 Main St, City, Country"
            },
            "order_status": {
                "id": 2,
                "name": "Designing"
            },
            "order_type": {
                "id": 2,
                "name": "Customize"
            },
            "deposit_has_paid": 1233,
            "product_price": 15000.00,
            "production_price": 12000.00,
            "total_price": 123131341414,
            "profit_rate": 0.25,
            "sale_staff": {
                "id": 1,
                "username": "salestaff1",
                "imageUrl": "http://localhost:8000/image/Account/1/main.jpg",
                "dob": "1985-05-15",
                "email": "salestaff1@example.com",
                "fullname": "Jane Smith",
                "role": {
                    "id": 2,
                    "name": "Sales"
                },
                "phone": "0987654321",
                "address": "456 Elm St, City, Country",
                "order_count": 100,
                "deactivated": 0,
                "deactivated_date": null
            },
            "design_staff": {
                "id": 2,
                "username": "designstaff1",
                "imageUrl": "http://localhost:8000/image/Account/2/main.jpg",
                "dob": "1988-07-10",
                "email": "designstaff1@example.com",
                "fullname": "Alice Johnson",
                "role": {
                    "id": 3,
                    "name": "Designer"
                },
                "phone": "1231231234",
                "address": "789 Pine St, City, Country",
                "order_count": 50,
                "deactivated": 0,
                "deactivated_date": null
            },
            "production_staff": {
                "id": 3,
                "username": "productionstaff1",
                "imageUrl": "http://localhost:8000/image/Account/3/main.jpg",
                "dob": "1979-11-20",
                "email": "productionstaff1@example.com",
                "fullname": "Robert Brown",
                "role": {
                    "id": 4,
                    "name": "Production"
                },
                "phone": "4564564567",
                "address": "321 Oak St, City, Country",
                "order_count": 200,
                "deactivated": 0,
                "deactivated_date": null
            },
            "note": "This is a special custom order.\n\newf\nưef\nw\nèwefwfwfwfweef\nf\nưef\nưefe\nừ\nưefweefwefwefw\n\n\nưeefwf\nfefw\nfw\nèweefThis is a special custom order.\n\newf\nưef\nw\nèwefwfwfwfweef\nf\nưef\nưefe\nừ\nưefweefwefwefw\n\n\nưeefwf\nfefw\nfw\nèweef",
            "created": "2024-05-20"
        },
        "imageUrl": "http://localhost:8000/image/Metal/1/main.jpg",
        "note": "This is a special custom order.\n\newf\nưef\nw\nèwefwfwfwfweef\nf\nưef\nưefe\nừ\nưefweefwefwefw\n\n\nưeefwf\nfefw\nfw\nèweef",
        "mounting_type": {
            "id": 1,
            "name": "Prong"
        },
        "mounting_size": 6,
        "design_process_status": {
            "id": 2,
            "name": "Priced"
        },
        "production_price": 15000.00,
        "profit_rate": 0.25,

        "created": "2024-05-20",
        "product_price": 20000.00,
        "total_price": 25000.00
    },
}



const CustomForm = ({ designInfo, handleTableChange, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [handleImageChange, setHandleImageChange] = useState(false);


    const [designProcess, setDesignProcess] = useState(null)
    const [order, setOrder] = useState(null)
    const [product, setProduct] = useState(null)


    const [saleStaff, setSaleStaff] = useState(null)
    const [designStaff, setDesignStaff] = useState(null)
    const [productionStaff, setProductionStaff] = useState(null)


    //current version
    const [metalList, setMetalList] = useState([]);
    const [diamondList, setDiamondList] = useState([])
    const [note, setNote] = useState(null);


    useEffect(() => {
        const setAttribute = async () => {

            await get_account_list();
            //console.log("quote", quoteInfo)
            // gọi api lấy design process detail từ designInfo.id
            const design_process = design_process_detail_data.design_process
            setDesignProcess(design_process)


            setOrder(design_process.order)
            setProduct(design_process.order.product)

            setSaleStaff(design_process.order.sale_staff);
            setDesignStaff(design_process.order.design_staff);
            setProductionStaff(design_process.order.production_staff);


            setMetalList(design_process.order.product.product_metal.filter(item => item.status == 0))
            setDiamondList(design_process.order.product.product_diamond.filter(item => item.status == 0))
            setNote(design_process.note)


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
            design_process_id: designProcess.id,
            approve: approve, 
            note: note

    }
    console.log('approval', approval)
    const formData = new FormData();
    formData.append('approval', JSON.stringify(approval));

    await get_account_list();
    // let mess = '';
    // let mess_color = '';

    // if (response.success) {
    //     mess = response.success
    //     handleTableChange();
    //     onClose();
    //     mess_color = 'success'
    // } else if (response.error) {
    //     mess = response.error;
    //     mess_color = 'danger'
    // }
    // let product = {
    //     id: response.new_product_id,
    // }

    dispatch(setToast({ color: 'success', title: 'Design id: ' + designProcess.id, mess: "Approve successfully !" }))
    //dispatch(clearToast())
    onClose();



}


return (

    <CForm
        className="row g-3 needs-validation"
    >
        {loading ? <CButton className="w-100" color="secondary" disabled>
            <CSpinner as="span" size="sm" aria-hidden="true" />
            Loading...
        </CButton> :
            <>
                {/* <CCol lg={6} className="d-flex flex-column">
                        <CAccordion >
                            <CAccordionItem>
                                <CAccordionHeader>Accordion Item #1</CAccordionHeader>
                                <CAccordionBody>
                                    <AccountCard account={order.account} avatarSize={100} cardHeight={'120px'} />
                                </CAccordionBody>
                            </CAccordionItem>
                        </CAccordion>
                    </CCol> */}


                <CCol lg={6} className="d-flex flex-column">
                    <CAccordion >
                        <CAccordionItem>
                            <CAccordionHeader>CUSTOMER INFORMATION</CAccordionHeader>
                            <CAccordionBody>
                                <AccountCard account={order.account} avatarSize={100} cardHeight={'120px'} />
                            </CAccordionBody>
                        </CAccordionItem>
                    </CAccordion>
                    {/* <AccountCard account={order.account} avatarSize={100} cardHeight={'120px'} /> */}
                    <div className='flex-grow-1'>
                        <NoteCard title={"Designer's note"} mainNote={order.note} minRows={8} maxRows={20} isLoading={loading} note={note} handleChange={handleNote} cardHeight={'100%'} />

                    </div>
                </CCol>
                <CCol lg={6}>
                    <div style={{ height: 'fit-content' }}>
                        <CAccordion >
                            <CAccordionItem>
                                <CAccordionHeader>INFORMATION OF ORDER</CAccordionHeader>
                                <CAccordionBody>
                                    <QuoteDetailCard quote={order} title={'INFORMATION OF ORDER'} />
                                </CAccordionBody>
                            </CAccordionItem>
                        </CAccordion>
                        {/* <QuoteDetailCard quote={order} title={'INFORMATION OF ORDER'} /> */}
                    </div>
                    <div className="mt-1" style={{ height: 'fit-content' }}  >
                        <CAccordion >
                            <CAccordionItem>
                                <CAccordionHeader>INFORMATION OF ORDER</CAccordionHeader>
                                <CAccordionBody>
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
                                                    <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={designProcess.mounting_type.name} />
                                                </CCol>
                                            </CRow>
                                            <CRow>
                                                <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                                    <span style={{ fontSize: '15px' }}>Mounting Size: </span>
                                                </CCol>
                                                <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                                    <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={designProcess.mounting_size} />
                                                </CCol>
                                            </CRow>


                                        </CCardBody>
                                    </CCard>
                                </CAccordionBody>
                            </CAccordionItem>
                        </CAccordion>


                    </div>
                    <div className="d-flex p-2 flex-column mt-1 rounded w-100 " style={{ height: 'fit-content' }}>
                        <CCard className=" h-100" style={{ height: 'fit-content' }}>
                            <CCardHeader className="text-center text-light fw-bold" >
                                DESIGNED IMAGE
                            </CCardHeader>
                            <CCardBody className="d-flex flex-column justify-content-between" style={{ maxWidth: '100%', maxHeight: '100%' }}  >
                                <Button
                                    sx={{ fontSize: '8px', fontWeight: 'bold' }}
                                    color="info"
                                    variant="outlined"
                                    className="fw-bold"
                                    onClick={() => {
                                        setHandleImageChange(!handleImageChange);
                                        console.log(!handleImageChange)
                                        console.log(product.imageUrl)
                                        console.log(designProcess.imageUrl)

                                    }}>
                                    {handleImageChange == true ? 'view current image' : 'view previous image'}
                                </Button>
                                <QuoteProductImage defaultImage={handleImageChange == true ? product.imageUrl : designProcess.imageUrl} disabled={true} />


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
                            {/* <CCardHeader>
                                    <span className="text-dark fw-bold fs-5 d-flex align-items-center">METAL</span>
                                </CCardHeader> */}
                            <CCardBody>
                                <CRow>
                                    <CCol md={6}>
                                        <span className="text-secondary fw-bold fs-5 d-flex align-items-center">Previous </span>
                                        <List className="rounded" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                            {product.product_metal.length > 0 && product.product_metal.map((item, index) => {
                                                return (
                                                    <ListItem>

                                                        <ListItemAvatar>
                                                            <CPopover
                                                                title="Popover title"
                                                                content={
                                                                    <>
                                                                        <div>Volume: {item.volume}</div>
                                                                        <div>Weight: {item.weight}</div>
                                                                    </>
                                                                }
                                                                placement="right"
                                                                trigger={"hover"}
                                                            >
                                                                <Avatar>
                                                                    <img width={'100%'} src={item.metal.imageUrl} alt="metal" />
                                                                </Avatar>
                                                            </CPopover>

                                                        </ListItemAvatar>


                                                        <ListItemText
                                                            className="text-dark w-25"
                                                            primary='Type'
                                                            color="secondary"
                                                            secondary={<span className="text-secondary">{item.metal.name}</span>} />

                                                        <ListItemText
                                                            className="text-dark w-25"
                                                            primary='Caculated Price'
                                                            secondary={<span className="text-secondary">{item.price} vnd</span>} />

                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    </CCol>
                                    <CCol md={6}>
                                        <span className="text-success fw-bold fs-5 d-flex align-items-center">Updating</span>

                                        <List className="rounded" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                            {metalList.length > 0 && metalList.map((item, index) => {
                                                return (
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <CPopover
                                                                title="Info"
                                                                content={
                                                                    <>
                                                                        <div>Volume: {item.volume}</div>
                                                                        <div>Weight: {item.weight}</div>
                                                                    </>
                                                                }
                                                                placement="right"
                                                                trigger={"hover"}
                                                            >
                                                                <Avatar>
                                                                    <img width={'100%'} src={item.metal.imageUrl} alt="metal" />
                                                                </Avatar>
                                                            </CPopover>

                                                        </ListItemAvatar>


                                                        <ListItemText
                                                            className="text-dark w-25"
                                                            primary='Type'
                                                            secondary={<span className="text-success">{item.metal.name}</span>} />

                                                        <ListItemText
                                                            className="text-dark w-25"
                                                            primary='Carculated Price'
                                                            secondary={<span className="text-success">{item.price} vnd</span>} />

                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    </CCol>
                                </CRow>


                                <CRow className="w-100 text-center d-flex justify-content-center">
                                    <CCol md={12} >
                                        <span className="text-danger fw-bold fs-5">Metal Sum </span>
                                    </CCol>

                                    <CCol xl={2} className="p-0 m-0 d-flex align-items-center justify-content-center">
                                        <span className="text-secondary fs-6">{product.product_metal.reduce((total, item) => total + item.price, 0)} vnd</span>

                                    </CCol>
                                    <CCol xl={2} className="p-0 m-0 d-flex  align-items-center justify-content-center">
                                        <CaretDoubleRight size={30} color='gray' weight="light" />

                                    </CCol>
                                    <CCol xl={2} className="p-0 m-0 d-flex align-items-center justify-content-center">
                                        <span className="text-success fs-6">{metalList.reduce((total, item) => total + item.price, 0)} vnd</span>

                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </div>
                    <div className="my-4">
                        <CCard className="bg-light metal-card" >

                            <CCardBody>



                                <CRow>
                                    <CCol md={6}>
                                        <span className="text-secondary fw-bold fs-5 d-flex align-items-center">Previous</span>
                                        <List className="rounded" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                            {product.product_diamond.length > 0 && product.product_diamond.map((item, index) => {
                                                return (
                                                    <ListItem>
                                                        <ListItemAvatar>

                                                            <CPopover
                                                                title="Info"
                                                                content={
                                                                    <>
                                                                        <div>Shape: {item.diamond_shape.name}</div>
                                                                        <div>Size: {item.diamond.size}</div>
                                                                        <div>Origin: {item.diamond.diamond_origin.name}</div>
                                                                        <div>Color: {item.diamond.diamond_color.name}</div>
                                                                        <div>Clarity: {item.diamond.diamond_clarity.name}</div>
                                                                    </>
                                                                }
                                                                placement="right"
                                                                trigger={"hover"}
                                                            >
                                                                <Avatar>
                                                                    <img width={'100%'} src={item.diamond.imageUrl} alt="metal" />
                                                                </Avatar>
                                                            </CPopover>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            className="text-dark w-25"
                                                            primary='Count'
                                                            secondary={<span className="text-secondary">{item.count}</span>} />
                                                        <ListItemText
                                                            className="text-dark w-25"
                                                            primary='Total Price'
                                                            secondary={<span className="text-secondary">{item.price} vnd</span>} />

                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    </CCol>
                                    <CCol md={6}>
                                        <span className="text-success fw-bold fs-5 d-flex align-items-center">Updating</span>
                                        <List className="rounded" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                            {diamondList.length > 0 && diamondList.map((item, index) => {
                                                return (
                                                    <ListItem>
                                                        <ListItemAvatar>

                                                            <CPopover
                                                                title="Popover title"
                                                                content={
                                                                    <>
                                                                        <div>Shape: {item.diamond_shape.name}</div>
                                                                        <div>Size: {item.diamond.size}</div>
                                                                        <div>Origin: {item.diamond.diamond_origin.name}</div>
                                                                        <div>Color: {item.diamond.diamond_color.name}</div>
                                                                        <div>Clarity: {item.diamond.diamond_clarity.name}</div>
                                                                    </>
                                                                }
                                                                placement="right"
                                                                trigger={"hover"}
                                                            >
                                                                <Avatar>
                                                                    <img width={'100%'} src={item.diamond.imageUrl} alt="metal" />
                                                                </Avatar>
                                                            </CPopover>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            className="text-dark w-25"
                                                            primary='Count'
                                                            secondary={<span className="text-success">{item.count}</span>} />
                                                        <ListItemText
                                                            className="text-dark w-25"
                                                            primary='Total Price'
                                                            secondary={<span className="text-success">{item.price} vnd</span>} />

                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    </CCol>
                                </CRow>
                                <CRow className="w-100 text-center d-flex justify-content-center">
                                    <CCol md={12}>
                                        <span className="text-danger fw-bold fs-5">Diamond Sum </span>
                                    </CCol>

                                    <CCol xl={2} className="p-0 m-0 d-flex align-items-center justify-content-center">
                                        <span className="text-secondary fs-6">{product.product_diamond.reduce((total, item) => total + item.price, 0)} vnd</span>

                                    </CCol>
                                    <CCol xl={2} className="p-0 m-0 d-flex  align-items-center justify-content-center">
                                        <CaretDoubleRight size={30} color='gray' weight="light" />

                                    </CCol>
                                    <CCol xl={2} className="p-0 m-0 d-flex align-items-center justify-content-center">
                                        <span className="text-success fs-6">{diamondList.reduce((total, item) => total + item.price, 0)} vnd</span>

                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </div>
                </CCol>
                <CCol md={12}>

                    <div className="my-0">
                        <CCard className="bg-light metal-card" >

                            <CCardBody className="d-flex flex-column justify-content-center">
                                <CRow className="d-flex justify-content-center">

                                    <CCol md={5} className="p-0">
                                        <span className="text-secondary fw-bold fs-5 d-flex align-items-center">Previous </span>

                                        <CRow className="w-100  text-end d-flex justify-content-center">
                                            <CCol lg={5} className=" px-0 m-0 d-flex  align-items-center">
                                                <span className="text-dark  fs-5 ">Product Price: </span>
                                            </CCol>
                                            <CCol lg={5} className="p-0 m-0 d-flex align-items-center">
                                                <span className="text-secondary fs-6">{order.product_price} vnd</span>

                                            </CCol>
                                        </CRow>
                                        <CRow className="w-100  text-end d-flex justify-content-center">
                                            <CCol lg={5} className=" px-0 m-0 d-flex  align-items-center">
                                                <span className="text-dark  fs-5">Profit Price: </span>
                                            </CCol>
                                            <CCol lg={5} className="p-0 m-0 d-flex align-items-center">
                                                <span className="text-secondary fs-6">{order.product_price * (designProcess.profit_rate / 100)} vnd ({designProcess.profit_rate}%)</span>

                                            </CCol>
                                        </CRow>
                                        <CRow className="w-100  text-end d-flex justify-content-center">
                                            <CCol lg={5} className=" px-0 m-0 d-flex  align-items-center ">
                                                <span className="text-dark  fs-5 ">Production Price: </span>
                                            </CCol>
                                            <CCol lg={5} className=" p-0 m-0 d-flex align-items-center">
                                                <span className="text-secondary fs-6">{order.production_price} vnd</span>

                                            </CCol>
                                        </CRow>
                                    </CCol>
                                    {/* <CCol md={1} className="d-flex align-items-center justify-content-center p-0">
                                            <CaretDoubleRight size={30} color='gray' weight="light" />
                                        </CCol> */}
                                    <CCol md={5} className="p-0">
                                        <span className="text-success fw-bold fs-5 d-flex align-items-center">Updating </span>

                                        <CRow className="w-100  text-end d-flex justify-content-center">
                                            <CCol lg={5} className=" px-0 m-0 d-flex  align-items-center">
                                                <span className="text-dark  fs-5 ">Product Price: </span>
                                            </CCol>
                                            <CCol lg={5} className="p-0 m-0 d-flex align-items-center">
                                                <span className="text-success fs-6">{designProcess.product_price} vnd</span>

                                            </CCol>
                                        </CRow>
                                        <CRow className="w-100  text-end d-flex justify-content-center">
                                            <CCol lg={5} className=" px-0 m-0 d-flex  align-items-center">
                                                <span className="text-dark  fs-5">Profit Price: </span>
                                            </CCol>
                                            <CCol lg={5} className="p-0 m-0 d-flex align-items-center">
                                                <span className="text-success fs-6">{designProcess.product_price * (designProcess.profit_rate / 100)} vnd ({designProcess.profit_rate}%)</span>

                                            </CCol>
                                        </CRow>
                                        <CRow className="w-100  text-end d-flex justify-content-center">
                                            <CCol lg={5} className=" px-0 m-0 d-flex  align-items-center ">
                                                <span className="text-dark  fs-5 ">Production Price: </span>
                                            </CCol>
                                            <CCol lg={5} className=" p-0 m-0 d-flex align-items-center">
                                                <span className="text-success fs-6">{designProcess.production_price} vnd</span>

                                            </CCol>
                                        </CRow>
                                    </CCol>
                                </CRow>
                                <CRow className="w-100 text-center d-flex justify-content-center">
                                    <CCol md={12}>
                                        <span className="text-danger w-100 text-center fw-bold fs-5">Total</span>
                                    </CCol>

                                    <CCol xl={2} className="p-0 m-0 d-flex align-items-center justify-content-center">
                                        <span className="text-secondary fs-6">{order.total_price} vnd</span>

                                    </CCol>
                                    <CCol xl={2} className="p-0 m-0 d-flex  align-items-center justify-content-center">
                                        <CaretDoubleRight size={30} color='gray' weight="light" />

                                    </CCol>
                                    <CCol xl={2} className="p-0 m-0 d-flex align-items-center justify-content-center">
                                        <span className="text-success fs-6">{designProcess.total_price} vnd</span>

                                    </CCol>
                                </CRow>


                                {/* <CRow className="w-100  text-end d-flex justify-content-center">
                                        <CCol lg={3} className="text-center px-0 m-0 d-flex  align-items-center">
                                            <span className="text-dark fw-bold fs-4">Total: </span>
                                        </CCol>
                                        <CCol lg={3} className="p-0 m-0 d-flex align-items-center">
                                            <span className="text-secondary fs-6">{designProcess.total_price} vnd</span>

                                        </CCol>
                                    </CRow> */}
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

const DesignApprove = ({ designProcess, handleTableChange, onClose }) => {
    return (
        <CustomForm designInfo={designProcess} handleTableChange={handleTableChange} onClose={onClose} />
    );
};

export default DesignApprove;
