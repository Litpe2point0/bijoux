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
import { get_account_list } from "../../../api/accounts/Account_Api";
import AvatarUpload from "../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { setToast } from "../../../redux/notification/toastSlice";
import { Staff_Page_Context } from "../Staff_Page";
import { FaUserCheck } from "react-icons/fa";
import NoteCard from "../Quote widget/NoteCard";
import AssignCard from "../Quote widget/AssignCard";
import { useNavigate } from "react-router-dom";
import { queue } from "jquery";



const CustomForm = ({ orderInfo, account, handleTableChange, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [note, setNote] = useState(null);

    useEffect(() => {
        const setAttribute = async () => {
            await get_account_list();

            setNote(orderInfo.note)

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

            const cancel = {
                order_id: orderInfo.id,
                note: note.trim()
            }
            console.log('cancel order', cancel)
            const formData = new FormData();
            formData.append('cancel', JSON.stringify(cancel));

            await get_account_list();
            // let mess = '';
            // let mess_color = '';

            // if (response.success) {
            //     mess = response.success
            //     handleTableChange();
            //     onClose();
            //     setValidated(false)
            //     mess_color = 'success'
            // } else if (response.error) {
            //     mess = response.error;
            //     mess_color = 'danger'
            // }
            // let product = {
            //     id: response.new_product_id,
            // }

            dispatch(setToast({ color: 'success', title: 'Order id ' + orderInfo.id, mess: "Cancel successfully !" }))
            onClose();

        }

    }


    return (
        <CForm
            className="row g-3 needs-validation"
            onSubmit={handleSubmit}
        >
            <CFormLabel htmlFor="note" className="form-label">This action will not permanent delete the item from the system</CFormLabel>
            <CCol md={12}>
                <NoteCard isLoading={loading} note={note} handleChange={handleNote} />
            </CCol>
            <CCol xs={12} className="d-flex justify-content-center">
               
                    <CButton color="danger" type="submit" disabled={loading} >
                        Sure to cancel
                    </CButton>
                

            </CCol>
            
        </CForm>
    )
}

const OrderCancel = ({ order, handleTableChange, onClose }) => {
    return (
        <CustomForm orderInfo={order} handleTableChange={handleTableChange} onClose={onClose} />
    );
};

export default OrderCancel;
