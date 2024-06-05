import React from "react";
import { Box } from '@mui/material';
import { CImage, CButton } from '@coreui/react';


export default function Services() {
    return (
        <>
            <Box gap={3} sx={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
                <Box>
                    <CImage className="d-block w-1" src="https://i.pinimg.com/564x/4c/b4/22/4cb422933d78f641dc6b33662ed03ed4.jpg" alt="template-image" />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3>Design a Jewelry by template</h3>
                    <Box width={550}>
                        <p>Feel free to design by yourself with our free templates. You can choose each available detail to combine into a finished product</p>
                    </Box>
                    <CButton href='/services/template' color="dark">Design Now</CButton>
                </Box>
            </Box>

            <Box gap={3} sx={{ display: 'flex', justifyContent: 'center', marginTop: '60px', marginBottom: '60px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3>Design a jewelry by your own ideas</h3>
                    <Box width={550}>
                        <p>Can’t find your design from the templates ?
                            Don’t worry, we have our own consultant team to support you ! We will listen to your idea and realize it</p>
                    </Box>
                    <CButton href='/services/customization' color="dark">Contact Now</CButton>
                </Box>
                <Box>
                    <CImage className="d-block w-1" src="https://i.pinimg.com/564x/8d/85/7d/8d857d7873db1734733b0982b1f0aea6.jpg" alt="template-image" />
                </Box>
            </Box>
        </>
    );
}