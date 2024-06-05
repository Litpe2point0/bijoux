import React from "react";
import { Box } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CButton } from '@coreui/react'
import OrderCustomerCard from "../../../components/Card/orderCustomerCard";

export default function Order() {
    const [type, setType] = React.useState("customization");
    // onClick={setType("customization")}
    // onClick={setType("template")}
    const orders = [
        {
            OrderID: "#ord0001",
            JewelryID: "#jew0001",
            CustomerID: "C001",
            JewelryPrice: 2000,
            DepositHasPaid: 1000,
            ProfitRate: 0.15,
            ProductionPrice: 500,
            TotalPrice: (2000 + 500) * (1 + 0.15),
            OrderType: "customization",
            OrderStatus: "Deposit",
            Note: null,
            SaleStaffID: 101,
            DesignStaffID: 201,
            ProductionStaffID: 301,
            CreatedDate: "2024/06/01"
        },
        {
            OrderID: "#ord0002",
            JewelryID: "#jew0002",
            CustomerID: "C002",
            JewelryPrice: 1500,
            DepositHasPaid: 750,
            ProfitRate: 0.20,
            ProductionPrice: 400,
            TotalPrice: (1500 + 400) * (1 + 0.20),
            OrderType: "template",
            OrderStatus: "Design",
            Note: "Needs to be ready by end of June",
            SaleStaffID: 102,
            DesignStaffID: null,
            ProductionStaffID: 302,
            CreatedDate: "2024/06/02"
        },
        {
            OrderID: "#ord0003",
            JewelryID: "#jew0003",
            CustomerID: "C003",
            JewelryPrice: 1800,
            DepositHasPaid: 900,
            ProfitRate: 0.18,
            ProductionPrice: 600,
            TotalPrice: (1800 + 600) * (1 + 0.18),
            OrderType: "customization",
            OrderStatus: "Manufacturing",
            Note: null,
            SaleStaffID: null,
            DesignStaffID: 203,
            ProductionStaffID: 303,
            CreatedDate: "2024/06/03"
        },
        {
            OrderID: "#ord0004",
            JewelryID: "#jew0004",
            CustomerID: "C004",
            JewelryPrice: 2500,
            DepositHasPaid: 1250,
            ProfitRate: 0.25,
            ProductionPrice: 700,
            TotalPrice: (2500 + 700) * (1 + 0.25),
            OrderType: "template",
            OrderStatus: "Payment",
            Note: "Urgent order",
            SaleStaffID: 104,
            DesignStaffID: null,
            ProductionStaffID: 304,
            CreatedDate: "2024/06/04"
        },
        {
            OrderID: "#ord0005",
            JewelryID: "#jew0005",
            CustomerID: "C005",
            JewelryPrice: 3000,
            DepositHasPaid: 0,
            ProfitRate: 0.22,
            ProductionPrice: 800,
            TotalPrice: (3000 + 800) * (1 + 0.22),
            OrderType: "customization",
            OrderStatus: "Delivery",
            Note: "First delivery attempt failed",
            SaleStaffID: 105,
            DesignStaffID: 205,
            ProductionStaffID: 305,
            CreatedDate: "2024/06/05"
        },
        {
            OrderID: "#ord0006",
            JewelryID: "#jew0006",
            CustomerID: "C006",
            JewelryPrice: 1200,
            DepositHasPaid: 600,
            ProfitRate: 0.20,
            ProductionPrice: 300,
            TotalPrice: (1200 + 300) * (1 + 0.20),
            OrderType: "template",
            OrderStatus: "Complete",
            Note: null,
            SaleStaffID: null,
            DesignStaffID: null,
            ProductionStaffID: 306,
            CreatedDate: "2024/06/06"
        },
        {
            OrderID: "#ord0007",
            JewelryID: "#jew0007",
            CustomerID: "C007",
            JewelryPrice: 2200,
            DepositHasPaid: 1100,
            ProfitRate: 0.18,
            ProductionPrice: 500,
            TotalPrice: (2200 + 500) * (1 + 0.18),
            OrderType: "customization",
            OrderStatus: "Decline",
            Note: "Customer canceled the order",
            SaleStaffID: 107,
            DesignStaffID: 207,
            ProductionStaffID: null,
            CreatedDate: "2024/06/07"
        },
        {
            OrderID: "#ord0008",
            JewelryID: "#jew0008",
            CustomerID: "C008",
            JewelryPrice: 1600,
            DepositHasPaid: 0,
            ProfitRate: 0.15,
            ProductionPrice: 400,
            TotalPrice: (1600 + 400) * (1 + 0.15),
            OrderType: "template",
            OrderStatus: "Deposit",
            Note: null,
            SaleStaffID: 108,
            DesignStaffID: null,
            ProductionStaffID: 308,
            CreatedDate: "2024/06/08"
        },
        {
            OrderID: "#ord0009",
            JewelryID: "#jew0009",
            CustomerID: "C009",
            JewelryPrice: 1300,
            DepositHasPaid: 650,
            ProfitRate: 0.20,
            ProductionPrice: 350,
            TotalPrice: (1300 + 350) * (1 + 0.20),
            OrderType: "customization",
            OrderStatus: "Design",
            Note: "Customer wants a unique design",
            SaleStaffID: 109,
            DesignStaffID: 209,
            ProductionStaffID: 309,
            CreatedDate: "2024/06/09"
        },
        {
            OrderID: "#ord0010",
            JewelryID: "#jew0010",
            CustomerID: "C010",
            JewelryPrice: 1400,
            DepositHasPaid: 0,
            ProfitRate: 0.25,
            ProductionPrice: 450,
            TotalPrice: (1400 + 450) * (1 + 0.25),
            OrderType: "template",
            OrderStatus: "Manufacturing",
            Note: null,
            SaleStaffID: null,
            DesignStaffID: null,
            ProductionStaffID: 310,
            CreatedDate: "2024/06/10"
        }
    ];

    const filteredOrders = orders.filter(order => order.OrderType === type);

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1>Your Order List</h1>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around', marginBottom: '5px' }}>
                    <Box>
                        <CButton color="dark" size="lg" shape="rounded-pill" onClick={() => setType('customization')}>Customization</CButton>
                    </Box>
                    <Box>
                        <CButton color="dark" size="lg" shape="rounded-pill" onClick={() => setType('template')}>Template</CButton>
                    </Box>
                </Box>
                <Box sx={{ width: '100%', borderBottom: '3px solid #000', marginBottom: '20px' }}></Box>

                <Box>
                    {filteredOrders.map(order => (
                        <OrderCustomerCard
                            key={order.OrderID}
                            OrderID={order.OrderID}
                            JewelryID={order.JewelryID}
                            CustomerID={order.CustomerID}
                            JewelryPrice={order.JewelryPrice}
                            DepositHasPaid={order.DepositHasPaid}
                            ProfitRate={order.ProfitRate}
                            ProductionPrice={order.ProductionPrice}
                            TotalPrice={order.TotalPrice}
                            OrderType={order.OrderType}
                            OrderStatus={order.OrderStatus}
                            Note={order.Note}
                            SaleStaffID={order.SaleStaffID}
                            DesignStaffID={order.DesignStaffID}
                            ProductionStaffID={order.ProductionStaffID}
                            CreatedDate={order.CreatedDate}
                        />
                    ))}
                </Box>
            </Box>
        </>
    );
}