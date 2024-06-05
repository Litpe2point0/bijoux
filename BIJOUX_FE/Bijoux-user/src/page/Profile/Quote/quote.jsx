import React from "react";
import { Box } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import QuoteCustomerCard from "../../../components/Card/quoteCustomerCard";

export default function Quote() {
    const quotes = [
        {
            QuoteID: "#Q0001",
            JewelryID: 101,
            QuoteType: "Template",
            QuoteStatus: "Received",
            ProductPrice: "In progress...",
            ProductionPrice: "In progress...",
            ProfitRate: "15%",
            TextNote: null,
            SaleStaffID: null,
            DesignStaffID: null,
            ProductionStaffID: null,
            CreatedDate: "2024/06/01"
        },
        {
            QuoteID: "#Q0002",
            JewelryID: 102,
            QuoteType: "Customization",
            QuoteStatus: "Assigned",
            ProductPrice: 1500,
            ProductionPrice: 500,
            ProfitRate: "20%",
            TextNote: "Need to add custom engraving",
            SaleStaffID: 201,
            DesignStaffID: 301,
            ProductionStaffID: 401,
            CreatedDate: "2024/06/02"
        },
        {
            QuoteID: "#Q0003",
            JewelryID: 103,
            QuoteType: "Template",
            QuoteStatus: "Approved",
            ProductPrice: 1200,
            ProductionPrice: 400,
            ProfitRate: "25%",
            TextNote: null,
            SaleStaffID: 202,
            DesignStaffID: null,
            ProductionStaffID: 402,
            CreatedDate: "2024/06/03"
        },
        {
            QuoteID: "#Q0004",
            JewelryID: 104,
            QuoteType: "Customization",
            QuoteStatus: "Declined",
            ProductPrice: 1000,
            ProductionPrice: 300,
            ProfitRate: "30%",
            TextNote: "Customer declined due to high price",
            SaleStaffID: 203,
            DesignStaffID: 302,
            ProductionStaffID: 403,
            CreatedDate: "2024/06/04"
        },
        {
            QuoteID: "#Q0005",
            JewelryID: 105,
            QuoteType: "Template",
            QuoteStatus: "Received",
            ProductPrice: "In progress...",
            ProductionPrice: "In progress...",
            ProfitRate: "10%",
            TextNote: "Standard template",
            SaleStaffID: null,
            DesignStaffID: null,
            ProductionStaffID: null,
            CreatedDate: "2024/06/05"
        },
        {
            QuoteID: "#Q0006",
            JewelryID: 106,
            QuoteType: "Customization",
            QuoteStatus: "Assigned",
            ProductPrice: 1800,
            ProductionPrice: 600,
            ProfitRate: "22%",
            TextNote: null,
            SaleStaffID: 204,
            DesignStaffID: 303,
            ProductionStaffID: 404,
            CreatedDate: "2024/06/06"
        },
        {
            QuoteID: "#Q0007",
            JewelryID: 107,
            QuoteType: "Template",
            QuoteStatus: "Approved",
            ProductPrice: 1300,
            ProductionPrice: 450,
            ProfitRate: "28%",
            TextNote: "Approved by customer",
            SaleStaffID: 205,
            DesignStaffID: null,
            ProductionStaffID: 405,
            CreatedDate: "2024/06/07"
        },
        {
            QuoteID: "#Q0008",
            JewelryID: 108,
            QuoteType: "Customization",
            QuoteStatus: "Declined",
            ProductPrice: 1100,
            ProductionPrice: 350,
            ProfitRate: "18%",
            TextNote: null,
            SaleStaffID: 206,
            DesignStaffID: 304,
            ProductionStaffID: 406,
            CreatedDate: "2024/06/08"
        },
        {
            QuoteID: "#Q0009",
            JewelryID: 109,
            QuoteType: "Template",
            QuoteStatus: "Assigned",
            ProductPrice: 1400,
            ProductionPrice: 480,
            ProfitRate: "26%",
            TextNote: "Assigned to production",
            SaleStaffID: 207,
            DesignStaffID: null,
            ProductionStaffID: 407,
            CreatedDate: "2024/06/09"
        },
        {
            QuoteID: "#Q0010",
            JewelryID: 110,
            QuoteType: "Customization",
            QuoteStatus: "Approved",
            ProductPrice: 1700,
            ProductionPrice: 570,
            ProfitRate: "24%",
            TextNote: "Custom design approved",
            SaleStaffID: 208,
            DesignStaffID: 305,
            ProductionStaffID: 408,
            CreatedDate: "2024/06/10"
        }
    ];

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <h1>
                    Your Quote List
                </h1>

                <Box gap={2}>
                    {quotes.map((quote, index) => (
                        <QuoteCustomerCard
                            key={index}
                            QuoteID={quote.QuoteID}
                            JewelryID={quote.JewelryID}
                            QuoteType={quote.QuoteType}
                            Price={quote.ProductPrice}
                            QuoteStatus={quote.QuoteStatus}
                            ProductionPrice={quote.ProductionPrice}
                            ProfitRate={quote.ProfitRate}
                            TextNote={quote.TextNote}
                            SaleStaffID={quote.SaleStaffID}
                            DesignerStaffID={quote.DesignStaffID}
                            ProductionStaffID={quote.ProductionStaffID}
                            CreatedDate={quote.CreatedDate}
                        />
                    ))}
                </Box>


            </Box>
        </>
    );
}