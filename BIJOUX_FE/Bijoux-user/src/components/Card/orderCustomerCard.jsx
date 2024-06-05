import React from "react";

import { Box } from '@mui/material';
import './orderCustomerCard.css';

export default function OrderCustomerCard({ OrderID, JewelryID, CustomerID, JewelryPrice, DepositHasPaid, ProfitRate, ProductionPrice, TotalPrice, OrderType, OrderStatus, Note, SaleStaffID, DesignStaffID, ProductionStaffID, CreatedDate }) {

    return (
        <>
            <Box sx={{ width: '1500px', height: '114px', display: 'flex', bgcolor: '#eef0ee', borderRadius: '10px', marginBottom: '20px' }}>
                <Box
                    sx={{
                        width: '118px'
                    }}
                >
                    <img
                        src="https://i.pinimg.com/564x/2f/89/36/2f89366dd68780e8099da31ab71474f2.jpg"
                        alt="Order"
                        style={{ width: '114px', height: 'auto' }}
                    />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <p className="order-id">Order ID: </p>
                        <p style={{ color: 'gray', fontSize: '20px', fontWeight: '500' }}>{OrderID}</p>
                    </Box>
                    <Box gap={10} sx={{ display: 'flex', marginRight: '10px', marginLeft: '10px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="order-information-label">Jewelry ID:</p>
                            <p>{JewelryID}</p>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="order-information-label">Customer ID:</p>
                            <p>{CustomerID}</p>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="order-information-label">Jewelry Price:</p>
                            <p>{JewelryPrice}</p>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="order-information-label">ProductPrice Price:</p>
                            <p>{ProductionPrice}</p>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="order-information-label">Total Price:</p>
                            <p>{TotalPrice}</p>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="order-information-label">Order Status:</p>
                            <p>{OrderStatus}</p>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p className="order-information-label">Created:</p>
                            <p>{CreatedDate}</p>
                        </Box>
                        <Box>
                            {/* Tạo ra 1 button với tiêu đề là Pay Deposit, nếu như {DepositHasPaid} === 0 thì nền xanh lá, chữ trắng và cho nhấn. Nếu như DepositHasPaid != 0 thì nền xám chữ trắng và không thể nhấn   */}
                            {DepositHasPaid === 0 ? <button style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>Pay Deposit</button> : <button style={{ backgroundColor: 'gray', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>Paid</button>}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}