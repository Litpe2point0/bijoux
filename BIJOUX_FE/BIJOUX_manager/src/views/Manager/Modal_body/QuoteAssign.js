import React, { useContext, useEffect, useState, useRef } from "react";

import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CRow,
    CSpinner
} from '@coreui/react'
import { get_account_list, get_staff_list } from "../../../api/main/accounts/Account_api";
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
import { QuotePageContext } from "../Quote_Page";
import { assign_quote } from "../../../api/main/orders/Quote_api";

const sales_staff = [
    {
        "id": 23,
        "username": "john_doe đần",
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "phone": "+1234567890",
        "dob": "1985-06-15",
        "email": "john.doe@example.com",
        "fullname": "john_doe đần",
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
                "id": 123,
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
    },
    {
        "id": 123,
        "username": "jane_smith ngu",
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "phone": "+0987654321",
        "dob": "1990-09-25",
        "email": "jane.smith@example.com",
        "fullname": "jane_smith ngu",
        "role": {
            "id": 2,
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
]
const design_staff = [
    {
        "id": 123,
        "username": "jane_smith hhhhh",
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "phone": "+0987654321",
        "dob": "1990-09-25",
        "email": "jane.smith@example.com",
        "fullname": "jane_smith hhhhh",
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
    },
    {
        "id": 4,
        "username": "jane_smith ngu",
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "phone": "+0987654321",
        "dob": "1990-09-25",
        "email": "jane.smith@example.com",
        "fullname": "jane_smith ngu",
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
]
const production_staff = [
    {
        "id": 123,
        "username": "alice_johnson ngốc",
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "phone": "+1122334455",
        "dob": "1982-12-05",
        "email": "alice.johnson@example.com",
        "fullname": "alice_johnson ngốc",
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
    },
    {
        "id": 66,
        "username": "alice_johnson dddd",
        "imageUrl": "http://localhost:8000/image/Diamond/D_IF.jpg",
        "phone": "+1122334455",
        "dob": "1982-12-05",
        "email": "alice.johnson@example.com",
        "fullname": "alice_johnson dddd",
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
]

const CustomForm = ({ quoteInfo, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleDataChange } = useContext(QuotePageContext);

    const [loading, setLoading] = useState(true);

    const [quote, setQuote] = useState(null)

    const [saleStaffs, setSaleStaffs] = useState(null)
    const [designStaffs, setDesignStaffs] = useState(null)
    const [productionStaffs, setProductionStaffs] = useState(null)

    const [note, setNote] = useState(null);

    const [assignedSaleStaff, setAssignedSaleStaff] = useState(null);
    const [assignedDesignStaff, setAssignedDesignStaff] = useState(null);
    const [assignedProductionStaff, setAssignedProductionStaff] = useState(null);

    useEffect(() => {
        const setAttribute = async () => {


            setQuote(quoteInfo)
            setNote(quoteInfo.note)


            const staffList = await get_staff_list();
            const sale_staff_list=staffList.data.sale_staff_list;
            const design_staff_list=staffList.data.design_staff_list;
            const production_staff_list=staffList.data.production_staff_list;

            setSaleStaffs(sale_staff_list);
            setDesignStaffs(design_staff_list);
            setProductionStaffs(production_staff_list);


            setAssignedSaleStaff(quoteInfo.saleStaff_id != null ? sale_staff_list.filter(staff => staff.id == quoteInfo.saleStaff_id)[0] : null);
            setAssignedDesignStaff(quoteInfo.designStaff_id != null ? design_staff_list.filter(staff => staff.id == quoteInfo.designStaff_id)[0] : null);
            setAssignedProductionStaff(quoteInfo.productionStaff_id != null ? production_staff_list.filter(staff => staff.id == quoteInfo.productionStaff_id)[0] : null);
            setLoading(false);
        }
        setAttribute()
    }, [])


    const handleNote = (new_note) => {
        setNote(new_note)
        console.log("new note", new_note)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.stopPropagation()
        } else if (form.checkValidity() === true) {

            const assigned_information = {
                quote_id: quote.id,
                saleStaff_id: assignedSaleStaff.id,
                designStaff_id: assignedDesignStaff.id,
                productionStaff_id: assignedProductionStaff.id,
                note: note.trim()
            }
            console.log('assigned_information', assigned_information)
            const formData = new FormData();
            formData.append('assigned_information', JSON.stringify(assigned_information));


            let response = await assign_quote(formData, 'Quote ID ' + quote.id);

            if (response.success) {
                handleDataChange();
                onClose();
            }
            dispatch(setToast(response.mess))


            
        }

    }
    const handleAssign = (selectedStaff, role_id) => {
        if (role_id == 2) {
            setAssignedSaleStaff(selectedStaff)
        } else if (role_id == 3) {
            setAssignedDesignStaff(selectedStaff)
        } else if (role_id == 4) {
            setAssignedProductionStaff(selectedStaff)
        }

    }

    return (
        <CForm
            className="row g-3 needs-validation"
            onSubmit={handleSubmit}
        >
            <CCol md={6}>
                <AccountCard account={quoteInfo.account} avatarSize={130} cardHeight={'100%'} />
            </CCol>
            <CCol md={6}>
                <QuoteDetailCard quote={quoteInfo} />
            </CCol>
            <CCol md={12}>
                <NoteCard minRows={10} maxRows={30} isLoading={loading} note={note} handleChange={handleNote} />
            </CCol>
            <CCol md={12}>
                <CRow>
                    <CCol md={4}>
                        <span ><b>Sale Staff: </b></span>
                        {loading ?
                            <CButton color="light w-100" disabled>
                                <CSpinner as="span" size="sm" aria-hidden="true" />
                                Loading...
                            </CButton>
                            :
                            <AssignCard selection={assignedSaleStaff} staffList={saleStaffs} handleAssign={handleAssign} />

                        }
                    </CCol>
                    <CCol md={4}>
                        <span><b>Design Staff: </b></span>
                        {loading ?
                            <CButton color="light w-100" disabled>
                                <CSpinner as="span" size="sm" aria-hidden="true" />
                                Loading...
                            </CButton>
                            :
                            <AssignCard selection={assignedDesignStaff} staffList={designStaffs} handleAssign={handleAssign} />
                        }
                    </CCol>
                    <CCol md={4}>
                        <span><b>Production Staff: </b></span>
                        {loading ?
                            <CButton color="light w-100" disabled>
                                <CSpinner as="span" size="sm" aria-hidden="true" />
                                Loading...
                            </CButton>
                            :
                            <AssignCard selection={assignedProductionStaff} staffList={productionStaffs} handleAssign={handleAssign} />
                        }
                    </CCol>
                </CRow>
            </CCol>
            <CCol xs={12} className="d-flex justify-content-center">
                <CButton color="success" type="submit" disabled={!assignedSaleStaff || !assignedDesignStaff || !assignedProductionStaff} >
                    Confirm this assignment
                </CButton>
            </CCol>
        </CForm>
    )
}

const AssignForm = ({ quote, onClose }) => {
    return (
        <CustomForm quoteInfo={quote} onClose={onClose} />
    );
};

export default AssignForm;
