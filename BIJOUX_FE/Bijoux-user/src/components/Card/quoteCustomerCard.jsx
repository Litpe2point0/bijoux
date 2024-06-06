import React from "react";
import { Box } from '@mui/material';
import './quoteCustomerCard.css'
import Popover from '@mui/material/Popover';
import { useState } from 'react';
import SaleStaffContact from "./saleStaffContact";



export default function QuoteCustomerCard({ QuoteID, QuoteType, JewelryID, Price, QuoteStatus, ProductionPrice, ProfitRate, TextNote, SaleStaffID, DesignerStaffID, ProductionStaffID, CreatedDate }) {
    const price = ({ Price } + { ProductionPrice }) * (1 + { ProfitRate });
    if (DesignerStaffID === null) {
        DesignerStaffID = "Not assigned yet";
    }
    if (SaleStaffID === null) {
        SaleStaffID = "Not assigned yet";
    }
    if (ProductionStaffID === null) {
        ProductionStaffID = "Not assigned yet";
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return (
        <>
            <Box sx={{ width: '1500px', height: '114px', display: 'flex', bgcolor: '#eef0ee', borderRadius: '10px', marginBottom: '20px' }}>
                <Box
                    sx={{
                        width: '118px'
                    }}
                >
                    <img
                        src="https://i.pinimg.com/564x/36/b0/df/36b0df8c02b9f728596e59fe52ceb792.jpg"
                        alt="Jewelry"
                        style={{ width: '114px', height: 'auto' }}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ fontWeight: '900', fontSize: '20px', marginRight: '5px', color: '#317C09' }}>Quote ID: </p>
                        <p style={{ color: 'gray', fontSize: '20px', fontWeight: '500' }}>{QuoteID}</p>
                    </Box>
                    <Box gap={10} sx={{ display: 'flex' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="quote-information-label">Jewelry ID:</p>
                            <p>{JewelryID}</p>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="quote-information-label">Jewelry Price:</p>
                            <p>{Price}</p>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="quote-information-label">Quote Status:</p>
                            <p>{QuoteStatus}</p>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="quote-information-label">Sale Staff ID:</p>
                            <p className="sale-staff-id" onClick={handleClick}>{SaleStaffID}</p>
                            <Popover
                                id="sale-staff-popover"
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <SaleStaffContact
                                    SaleStaffAvatar="https://i.pinimg.com/564x/d6/34/ae/d634aefa8a6ed784aa684f5398138371.jpg"
                                    SaleStaffID={SaleStaffID}
                                    SaleStaffName="Julia Reliana"
                                    SaleStaffEmail="juliareliana1998@gmail.com"
                                    SaleStaffPhone="078 854 1241"
                                />
                            </Popover>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="quote-information-label">Design Staff ID:</p>
                            <p>{DesignerStaffID}</p>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="quote-information-label">Production Staff ID:</p>
                            <p>{ProductionStaffID}</p>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="quote-information-label">Created Date:</p>
                            <p>{CreatedDate}</p>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}