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
} from '@coreui/react'
import { get_account_list } from "../../../api/accounts/Account_Api";
import AvatarUpload from "../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { clearToast, setToast } from "../../../redux/notification/toastSlice";
import { useNavigate } from "react-router-dom";
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { ProductionStatusContext } from "../Quote widget/OrderDetail";
import UploadSingle from "../Quote widget/UploadSingle";


const production_status_list_data = [
    {
        id: 1,
        name: 'Unrealized'
    },
    {
        id: 2,
        name: 'Casting'
    },
    {
        id: 3,
        name: 'Assembly'
    },
    {
        id: 4,
        name: 'Stone Setting'
    },
    {
        id: 5,
        name: 'Polishing'
    },
    {
        id: 6,
        name: 'Finished'
    },
]



const CustomForm = ({ currentProductionProcess, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { order, handleDataChange } = useContext(ProductionStatusContext)

    const [loading, setLoading] = useState(true);

    const [productionStatusList, setProductionStatusList] = useState(null)

    //report
    //const [imageBase64, setImageBase64] = useState(false);
    const [status, setStatus] = useState(currentProductionProcess.production_status);



    useEffect(() => {
        const setAttribute = async () => {

            await get_account_list();
            //console.log("quote", quoteInfo)
            // gọi api lấy design process detail từ designInfo.id
            const production_status_list = production_status_list_data
            setProductionStatusList(production_status_list)

            setLoading(false);
        }
        
        setAttribute()
    }, [])


    const handleSubmit = async () => {
        setLoading(true);
        const order_id=order.id 

        console.log('order_id',order_id)
        const formData = new FormData();
        formData.append('order_id', JSON.stringify(order_id));

        await get_account_list();
        


        const result= status.id==1 || status.id ==2 ? false : true;
        if(result){
            handleDataChange()
            dispatch(setToast({ color: 'success', title: 'Order id: ' + order.id, mess: "Update production status successfully !" }))
            //dispatch(clearToast())
            onClose();
        }else{
            dispatch(setToast({ color: 'danger', title: 'Order id: ' + order.id, mess: "Update production status failed !" }))
            setLoading(false);
        }
    }

    return (
        <>
            {loading
                ?
                <CButton color="light w-100" disabled>
                    <CSpinner as="span" size="sm" aria-hidden="true" />
                    Loading...
                </CButton>
                :
                <CForm
                    className="row g-3 needs-validation d-flex justify-content-center"
                >   
                    
                    <div className="mt-2">
                    This action will turn order into payment status

                    </div>
                    <UploadSingle defaultImage={currentProductionProcess.imageUrl} disabled={true} />

                    <CButton color="success w-100" onClick={() => handleSubmit()}  >
                        Confirm to complete
                    </CButton>
                </CForm>
            }
        </>

    )
}

const ProductionComplete = ({ currentProductionProcess, onClose }) => {
    return (
        <CustomForm currentProductionProcess={currentProductionProcess} onClose={onClose} />
    );
};

export default ProductionComplete;
