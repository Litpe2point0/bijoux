import React, { useState } from "react";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

const payment_history_data = [
    {
        id: 1,
        account_id: 1,
        order_id: 1,
        payment_type: { id: 1, name: 'Deposit' },
        isSuccess: 1,
        money: 100000,
        created: '10/06/2024'
    },
    {
        id: 2,
        account_id: 1,
        order_id: 1,
        payment_type: { id: 2, name: 'Paid the rest' },
        isSuccess: 1,
        money: 100000,
        created: '10/06/2024'
    },
    {
        id: 3,
        account_id: 1,
        order_id: 2,
        payment_type: { id: 1, name: 'Deposit' },
        isSuccess: 1,
        money: 100000,
        created: '10/06/2024'
    },
    {
        id: 4,
        account_id: 1,
        order_id: 2,
        payment_type: { id: 2, name: 'Paid the rest' },
        isSuccess: 1,
        money: 100000,
        created: '10/06/2024'
    },
    {
        id: 5,
        account_id: 1,
        order_id: 3,
        payment_type: { id: 1, name: 'Deposit' },
        isSuccess: 1,
        money: 100000,
        created: '10/06/2024'
    },
    {
        id: 6,
        account_id: 1,
        order_id: 3,
        payment_type: { id: 2, name: 'Paid the rest' },
        isSuccess: 1,
        money: 100000,
        created: '10/06/2024'
    }
]
export default function PaymentHistory() {

    const state_creator = (table) => {
        const state = {
            columnDefs: [
                { headerName: "ID", field: "payment.id", flex: 0.4 },
                { headerName: "Order ID", field: "payment.order_id" },
                { headerName: "Payment Type", field: "payment.payment_type.name" },
                { headerName: "Price", field: "payment.price" },
                { headerName: "Created", field: "payment.created" },
            ],
            rowData: table
        }
        return state
    }

    return (
        <div>
            <h1>Payment</h1>
        </div>
    );
}