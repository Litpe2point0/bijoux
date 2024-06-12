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



const CustomForm = ({ currentProductionStatus, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { order, handleDataChange } = useContext(ProductionStatusContext)

    const [loading, setLoading] = useState(true);

    const [productionStatusList, setProductionStatusList] = useState(null)

    //report
    const [imageBase64, setImageBase64] = useState(false);
    const [status, setStatus] = useState(currentProductionStatus);



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
    const handleStatusSelect = (e, newValue) => {
        setStatus(JSON.parse(newValue))
    }
    const handleImageChange = (image) => {
        setImageBase64(image)
    }

    const handleSubmit = async () => {
        setLoading(true);

        const new_production_process = {
            order_id: order.id,
            production_status_id: status.id,
            imageUrl: imageBase64,
        }

        console.log('new_production_process', new_production_process)
        const formData = new FormData();
        formData.append('new_production_process', JSON.stringify(new_production_process));

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

                    <Select
                        onChange={handleStatusSelect}
                        variant="soft"
                        className="px-1 py-0"
                        defaultValue={JSON.stringify(status)}
                        slotProps={{
                            listbox: {
                                sx: {
                                    '--ListItemDecorator-size': '44px',
                                },
                            },
                        }}
                        sx={{
                            '--ListItemDecorator-size': '44px',
                            width: '100%',
                            height: '1.5em',
                        }}
                    >
                        {productionStatusList.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <Option value={JSON.stringify(item)} label={item.name} >
                                    {item.name}
                                </Option>
                            </React.Fragment>
                        ))}
                    </Select>
                    <UploadSingle handleSingleFileBase64={handleImageChange} defaultImage={imageBase64} disabled={false} />
                    <CButton color="success w-100" onClick={() => handleSubmit()}  >
                        Confirm
                    </CButton>
                </CForm>
            }
        </>

    )
}

const ProductionStatusChange = ({ currentProductionStatus, onClose }) => {
    return (
        <CustomForm currentProductionStatus={currentProductionStatus} onClose={onClose} />
    );
};

export default ProductionStatusChange;
