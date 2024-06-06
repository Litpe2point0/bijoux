import React from "react";
import { Box, Avatar } from '@mui/material';

export default function SaleStaffContact({ SaleStaffAvatar, SaleStaffID, SaleStaffName, SaleStaffPhone, SaleStaffEmail }) {
    if (SaleStaffID === "Not assigned yet") {
        return (
            <Box sx={{ margin: '10px' }}>
                <p>Not assigned yet</p>
            </Box>
        )
    } else {
        return (
            <>

                <Box gap={2} sx={{ display: 'flex' }}>
                    <Box margin="10px">
                        <Avatar alt={SaleStaffName} src={SaleStaffAvatar} sx={{ width: '56px', height: "56px" }} />
                    </Box>
                    <Box sx={{ marginLeft: '10px', marginRight: '10px', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex' }}>
                            <p style={{ fontWeight: '500', marginRight: '5px' }}>Saler ID:</p>
                            <p>{SaleStaffID}</p>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            <p style={{ fontWeight: '500', marginRight: '5px' }}>Saler Name:</p>
                            <p>{SaleStaffName}</p>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            <p style={{ fontWeight: '500', marginRight: '5px' }}>Saler Phone:</p>
                            <p style={{ color: 'skyblue', fontWeight: '500' }}>{SaleStaffPhone}</p>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            <p style={{ fontWeight: '500', marginRight: '5px' }}>Saler Email:</p>
                            <p>{SaleStaffEmail}</p>
                        </Box>
                    </Box>
                </Box>
            </>
        );
    }
}