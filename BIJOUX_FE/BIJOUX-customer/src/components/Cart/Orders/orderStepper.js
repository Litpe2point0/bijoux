import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { create_payment_link, get_order_status_list } from '../../../api/main/orders/Order_api';
import numeral from 'numeral';
import { instantAlertMaker } from '../../../api/instance/axiosInstance';
import { ArrowBendRightUp, Package } from 'phosphor-react';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

function getUrlWithoutQuery() {
    return window.location.origin + window.location.pathname;
}

export default function OrderStepper({ order }) {

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [orderStatusList, setOrderStatusList] = useState([]);
    const [isRefunding, setIsRefunding] = useState(false); // State to control refunding state

    useEffect(() => {
        const fetchOrderStatusList = async () => {
            const orderStatusList_data = await get_order_status_list(null, 'Get order status list', true);
            setOrderStatusList(order.order_type.id == 2 ? orderStatusList_data.data : orderStatusList_data.data.filter(item => item.id !== 2));
           
            setLoading(false);
        };

        fetchOrderStatusList();

    }, []);

    useEffect(() => {
        if (orderStatusList.length > 0) {
            setActiveStep(getOrderStepIndex(order.order_status.id).id);
            //alert(getOrderStepIndex(order.order_status.id).id)
        }
    }, [orderStatusList, order.order_status.id]);

    const getOrderStepIndex = (orderStatusId) => {
        return orderStatusList.find(step => step.id === orderStatusId);
    };

    const getOrderStepName = (orderStatusId) => {
        const step = orderStatusList.find(step => step.id === orderStatusId);
        return step ? step.name : '';
    };

    const handleCreatePaymentLink = async () => {
        if (isRefunding) {
            instantAlertMaker('info', 'Refunding', `${numeral(order.deposit_has_paid - order.total_price).format('0,0')} VND are refunding to you, please wait...`);
            return; // Disable further action or handle differently for refunding process
        }

        const order_information = {
            order_id: order.id,
            return_url: getUrlWithoutQuery() + "?payment_status=success",
            cancel_url: getUrlWithoutQuery() + "?payment_status=cancel",
        };

        const formData = new FormData();
        formData.append("order_information", JSON.stringify(order_information));

        const payment_link = await create_payment_link(formData, "Create payment link", true);
        if (payment_link.data.payment_link) {
            window.location.href = payment_link.data.payment_link;
        } else {
            instantAlertMaker('warning', 'Error', "Unable to create payment link at the moment.");
        }
    };

    useEffect(() => {
        setIsRefunding(order.deposit_has_paid - order.total_price > 0);
    }, [order.deposit_has_paid, order.total_price]);

    return (
        <Box sx={{ width: '100%' }}>
        {/* {order.order_type.id}
        <br/>
        {(order.order_type.id == 2 && activeStep >= 3) ?  (activeStep - 3) : (activeStep - 1) } */}
            {!loading && (
                <Stepper activeStep={(order.order_type.id == 1 && activeStep >= 3) ?  (activeStep - 2) : (activeStep - 1) } alternativeLabel>
                    {orderStatusList.filter(step => step.id !== 7).map((step, index) => (
                        <Step key={step.id}>
                            <StepLabel icon={step.id === 6 && activeStep === 6 && <Package color='limegreen' size={'1.5rem'} weight="duotone" />}>
                                <div className='flex flex-col items-center w-full'>
                                    {isRefunding && step.id === 4 ? ('Refund') : (step.name)}

                                    {activeStep === step.id &&
                                        <React.Fragment>
                                            {step.id === 1 &&
                                                <button onClick={() => handleCreatePaymentLink()} className='bg-sky-500 hover:bg-sky-900 rounded-md w-[200px] text-white font-semibold h-[25px]'>
                                                    Paynow <CurrencyFormatter value={order.total_price / 2 - order.deposit_has_paid} />
                                                </button>
                                            }
                                            {step.id === 4 &&
                                                <button onClick={() => handleCreatePaymentLink()} className={
                                                    isRefunding ? "bg-gray-500 rounded-md w-[200px] text-white font-semibold h-[25px]" : "bg-sky-500 hover:bg-sky-900 rounded-md w-[200px] text-white font-semibold h-[25px]"
                                                }>
                                                    {isRefunding ? 'Refunding...' :
                                                        <>
                                                            Paynow <CurrencyFormatter value={order.total_price - order.deposit_has_paid} />
                                                        </>
                                                    }
                                                </button>
                                            }
                                        </React.Fragment>
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
