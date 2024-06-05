import React from "react";
import './customization.css';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { CButton } from '@coreui/react';
import { Box } from '@mui/material';
import { Image } from 'react-bootstrap';
import { useState } from 'react';
import QuotePopup from '../../../../components/Popup/CustomizationPopup/quotePopUp';

export default function Customization() {

    const [open, setOpen] = useState(false);

    return (
        <div className="customization-container">

            <Box className="customization-head-content">
                <h1>Custom Your Own Jewelry</h1>
            </Box>

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '50px', marginBottom: '50px' }}>
                <Splitter gutterSize={20} style={{ height: '500px', width: '60%' }}>
                    <SplitterPanel className="flex align-items-center justify-content-cente responsive-text" size={25} minSize={10}>
                        At our jewelry store, we have a team of professional staff ready to assist you in turning your ideas into reality. Share your desired jewelry concepts with us, and we will bring them to life as soon as possible. You will receive advisory support throughout the process and have the opportunity to view design drafts for your product at each stage. Why wait? Contact us now!
                    </SplitterPanel>
                    <SplitterPanel className="flex align-items-center justify-content-center" size={75}>
                        <Image src="https://i.pinimg.com/564x/84/ad/42/84ad429fd46a57cf0ef3882a2595e867.jpg" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    </SplitterPanel>
                </Splitter>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CButton color="dark" size="lg" onClick={() => setOpen(true)}>Contact Now</CButton>
            </Box>
            <QuotePopup open={open} handleClose={() => setOpen(false)} />
        </div >
    );
}