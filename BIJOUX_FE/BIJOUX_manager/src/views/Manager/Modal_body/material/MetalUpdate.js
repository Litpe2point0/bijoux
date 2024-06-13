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
    CInputGroupText,
    CInputGroup,
    CCardText
} from '@coreui/react'
import { get_account_list } from "../../../../api/accounts/Account_Api";
import AvatarUpload from "../../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { setToast } from "../../../../redux/notification/toastSlice";
import { useNavigate } from "react-router-dom";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import AvatarInput from "../../../component_items/Avatar/Avatar";
import { get } from "jquery";
import MetalCard from "../../../Sale_staff/Modal_body/model/widget/MetalCard";
import DiamondCard from "../../../Sale_staff/Modal_body/model/widget/DiamondCard";
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextareaAutosize, hexToRgb } from "@mui/material";
import QuoteProductImage from "../../Quote widget/QuoteProductImage";
import { Pencil } from "phosphor-react";
import { AspectRatio } from "@mui/joy";
import { MetalPageContext } from "../../Metal_Page";





const CustomForm = ({ metalInfo, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleDataChange } = useContext(MetalPageContext);

    const [loading, setLoading] = useState(true);



    const [metal, setMetal] = useState(null)
    const [buyPrice, setBuyPrice] = useState(0);
    const [salePrice, setSalePrice] = useState(0);

    // const [approve, setApprove] = useState(null);
    useEffect(() => {
        const setAttribute = async () => {

            await get_account_list();
            //console.log("quote", quoteInfo)
            // gọi api lấy quote detail từ metalInfo.id 
            setMetal(metalInfo)

            setLoading(false);
        }
        setAttribute()
    }, [])



    const handleActivate = async (new_activate) => {
        await get_account_list();
        handleDataChange();

        const deactivate = {
            metal_id: metal.id,
            deactivate: new_activate == 0 ? true : false
        }
        console.log('deactivate', deactivate)
        const formData = new FormData();
        formData.append('deactivate', JSON.stringify(deactivate));
        dispatch(setToast({ color: 'success', title: 'Metal id ' + metal.id, mess: (new_activate == 0 ? 'Activate' : 'Deactivate') + " successfully !" }))

        onClose();
    }

    const handlePriceChange = async () => {


        const update_price = {
            metal_id: metal.id,
            buy_price_per_gram: buyPrice,
            sale_price_per_gram: salePrice,
        }

        console.log('update_price', update_price)
        const formData = new FormData();
        formData.append('update_price', JSON.stringify(update_price));

        await get_account_list();
        // let mess = '';
        // let mess_color = '';

        // if (response.success) {
        //     mess = response.success
        handleDataChange();
        //     onClose();
        //     mess_color = 'success'
        // } else if (response.error) {
        //     mess = response.error;
        //     mess_color = 'danger'
        // }
        // let product = {
        //     id: response.new_product_id,
        // }

        dispatch(setToast({ color: 'success', title: 'Metal id ' + metal.id, mess: "Update successfully !" }))
        onClose();



    }


    return (

        <CForm
            className="row needs-validation"

        >
            {loading ? <CButton className="w-100" color="secondary" disabled>
                <CSpinner as="span" size="sm" aria-hidden="true" />
                Loading...
            </CButton> :
                <>
                    <CRow className="my-2">
                        <div style={{ height: '100%' }}  >

                            <CCard className="h-100">
                                <CCardHeader className="text-center text-light fw-bold" >
                                    CURRENT INFORMATION
                                </CCardHeader>
                                <CCardBody className="d-flex flex-column justify-content-between ">
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center' >
                                            <span style={{ fontSize: '15px' }}>ID: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={'#' + metal.id} />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center' >
                                            <span style={{ fontSize: '15px' }}>Name: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={metal.name} />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <span style={{ fontSize: '15px' }}>Buy Price: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={metal.buy_price_per_gram + ' vnd ' + ` (updated date: ${metal.created} )`} />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <span style={{ fontSize: '15px' }}>Sale Price: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={metal.sale_price_per_gram + ' vnd' + ` (updated date:${metal.created} )`} />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <span style={{ fontSize: '15px' }}>Specific Weight: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className="h-75 w-100 quote-detail-card" defaultValue={metal.specific_weight + ' gram/mm^3'} />
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <span style={{ fontSize: '15px' }}>Status: </span>
                                        </CCol>
                                        <CCol xs={12} sm={6} md={6} lg={6} xl={6} xxl={6} className='d-flex align-items-center'>
                                            <CFormInput disabled className={"h-75 w-100 quote-detail-card " + (metal.deactivated == 0 ? 'text-success' : 'text-danger')} defaultValue={metal.deactivated == 0 ? 'activated' : 'deactivated'} />
                                        </CCol>
                                    </CRow>


                                </CCardBody>
                            </CCard>


                        </div>
                    </CRow>
                    <CRow className="my-2 h-25" style={{ height: '100px' }}>
                        {/* <CCol md={3} >
                            
                                    <img 
                                    className="rounded-3 img-fluid"
                                        src={metal.imageUrl}
                                        alt=""
                                    />
                        </CCol> */}
                        <CCol md={12} style={{ height: 'fit-content' }}>
                            <CCard >
                                <CCardHeader className="text-center text-light fw-bold" >
                                    NEW PRICE
                                </CCardHeader>
                                <CCardBody className="d-flex flex-column justify-content-between ">

                                    <CRow className="w-100">
                                        <CCol sm={6} md={6} lg={6} >
                                            <span className="text-light">New Buy Price: </span>
                                        </CCol>
                                        <CCol sm={6} md={6} lg={6} >

                                            <CInputGroup >
                                                <CFormInput type="number" min={0} className="h-50 quote-detail-card" defaultValue={0} onChange={(e) =>
                                                    setBuyPrice(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))
                                                } />
                                                <CInputGroupText className="px-1 py-0">
                                                    <Pencil size={15} color="white" weight="duotone" />
                                                </CInputGroupText>
                                            </CInputGroup>
                                        </CCol>
                                    </CRow>
                                    <CRow className="w-100">
                                        <CCol sm={6} md={6} lg={6} >
                                            <span className="text-light">New Sale Price: </span>
                                        </CCol>
                                        <CCol sm={6} md={6} lg={6} >

                                            <CInputGroup >
                                                <CFormInput type="number" min={0} className="h-50 quote-detail-card" defaultValue={0} onChange={(e) =>
                                                    setSalePrice(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))
                                                } />
                                                <CInputGroupText className="px-1 py-0">
                                                    <Pencil size={15} color="white" weight="duotone" />
                                                </CInputGroupText>
                                            </CInputGroup>
                                        </CCol>
                                    </CRow>

                                </CCardBody>
                            </CCard>
                        </CCol>


                    </CRow>



                    <CCol xs={12} className="d-flex justify-content-center align-items-center my-4">
                        <CButton disabled={salePrice == 0 || buyPrice == 0} className="mx-2" color={(salePrice == 0 || buyPrice == 0) ? 'secondary' : 'success'} onClick={() => handlePriceChange()}  >
                            {(salePrice == 0 || buyPrice == 0) ? "Enter New Price For Update" : 'Update Price'}
                        </CButton>
                        |
                        <CButton className="mx-2" color={metal.deactivated == 0 ? "danger" : "info"} value={metal.deactivated == 0 ? 1 : 0} onClick={(e) => handleActivate(e.target.value)}  >
                            {metal.deactivated == 0 ? 'Deactivate' : 'Activate'}
                        </CButton>

                    </CCol>
                </>}
        </CForm>
    )
}

const MetalUpdate = ({ metal, onClose }) => {
    return (
        <CustomForm metalInfo={metal} onClose={onClose} />
    );
};

export default MetalUpdate;