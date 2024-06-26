import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { create_payment_link, get_order_status_list } from '../../../api/main/orders/Order_api';
import numeral from 'numeral';

// Danh sách các bước trong stepper
// const steps = [
//     { id: 1, name: "Deposit" },
//     { id: 2, name: "Designing" },
//     { id: 3, name: "Manufacturing" },
//     { id: 4, name: "Payment" },
//     { id: 5, name: "Delivery" },
//     { id: 6, name: "Received" }
// ];
const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};




export default function OrderStepper({ order }) {

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [orderStatusList, setOrderStatusList] = useState([]);

    useEffect(() => {
        const setAttribute = async () => {
            //setActiveStep(getOrderStepIndex(order.order_status.id).id);
            //console.log('>>active step', getOrderStepIndex(order.order_status.id).id);
            const orderStatusList_data = await get_order_status_list(null, 'Get order status list', true);
            setOrderStatusList(orderStatusList_data.data);
            setLoading(false);
        };

        setAttribute();

    }, []);
    useEffect(() => {
        setLoading(true);
        if (orderStatusList.length > 0) {
            setActiveStep(getOrderStepIndex(order.order_status.id).id)
            setLoading(false);
        }
    }, [orderStatusList])

    const getOrderStepIndex = (orderStatusId) => {
        return orderStatusList.find(step => step.id === orderStatusId);
    };

    const getOrderStepName = (orderStatusId) => {
        const step = orderStatusList.find(step => step.id === orderStatusId);
        return step ? step.name : '';
    };

    const handleCreatePaymentLink = async () => {
        const order_information = {
            order_id: order.id,
            return_url: window.location.href + "?payment_status=success",
            cancel_url: window.location.href + "?payment_status=cancel",
        }
        const formData = new FormData();
        formData.append("order_information", JSON.stringify(order_information));
        const payment_link = await create_payment_link(formData, "Create payment link", true);
        window.location.href = payment_link.data.payment_link;

    }

    return (
        <Box sx={{ width: '100%' }}>
            {!loading && (
                <Stepper activeStep={activeStep - 1} alternativeLabel>
                    {orderStatusList.map((step, index) => (
                        <Step key={step.id}>
                            <StepLabel >
                                <div className='flex flex-col items-center w-full'>
                                    {step.name}
                                    {activeStep == step.id && activeStep == 1 &&
                                        <button onClick={() => handleCreatePaymentLink()} className='bg-sky-500 hover:bg-sky-900 rounded-md w-[300px] text-white font-semibold h-[25px]'>Paynow <CurrencyFormatter value={order.total_price / 2 - order.deposit_has_paid} /> </button>
                                    }
                                    {activeStep == step.id && activeStep == 4 &&
                                        <button onClick={() => handleCreatePaymentLink()} className='bg-sky-500 hover:bg-sky-900 rounded-md w-[300px] text-white font-semibold h-[25px]'>Paynow <CurrencyFormatter value={order.total_price - order.deposit_has_paid} /> </button>
                                    }
                                </div>
                            </StepLabel>

                        </Step>
                    ))}
                </Stepper>
            )}
        </Box>
    );
}