import React, { Children, useState } from 'react';
import {
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
} from '@coreui/react';
import './modal.css'
import { Switch } from '@mui/material';

const Model_Switch = (props) => {
    const [visible, setVisible] = useState(false);
    const [checked, setChecked] = useState(props.modelInfo.deactivated == 0);  
    const handleClose = (result) => {
        setChecked(result)
        setVisible(false);
    };
    const handleSwitch = (e) => {
        setVisible(!visible)
        const check = e.target.checked;
        setChecked(check)
        console.log(check)
        setVisible(true)
        
      }

    return (
        <>
            <Switch checked={checked} color={props.color} size="small" sx={{ width: '100%' }} onChange={handleSwitch} />
            
            <CModal size='xl' className='custom-modal' backdrop="static" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <CModalTitle>{props.title}</CModalTitle>
                </CModalHeader>
                <CModalBody>

                    {React.isValidElement(props.children) ? React.cloneElement(props.children, { onClose: handleClose, activate: checked }) : props.children}

                </CModalBody>
            </CModal>
        </>
    )
}

export default Model_Switch